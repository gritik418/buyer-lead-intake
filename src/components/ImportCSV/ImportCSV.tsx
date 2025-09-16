"use client";

import { selectUserToken } from "@/store/slices/userSlice";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaFile, FaFileCsv, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";

type ErrorsType = {
  row: number;
  errors: string[];
};

const ImportCSV = () => {
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const token = useSelector(selectUserToken);
  const [errors, setErrors] = useState<ErrorsType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    setErrorMessage("");
    setErrors([]);
    if (!file) {
      setErrorMessage("Please select a CSV file");
      return;
    }
    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/buyers/import", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      setLoading(false);

      if (result?.success) {
        setFileName("");
        setFile(null);
        setErrorMessage("");
        setErrors([]);
        setOpen(false);
        toast.success(result?.message);
        return;
      } else {
        if (result?.invalidRows) {
          setErrors(result?.invalidRows);
          setErrorMessage(
            `Imported ${result?.importedCount} ${
              result?.importedCount > 1 ? "buyers" : "buyer"
            }, and skipped ${result.invalidRows.length} ${
              result.invalidRows.length > 1 ? "rows" : "row"
            }.`
          );
          toast.error(result?.message);
          return;
        }
        if (result?.message) {
          toast.error(result?.message);
          return;
        } else {
          toast.error(result?.message);
          return;
        }
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="flex gap-2 cursor-pointer bg-indigo-500 py-1 px-3 rounded-md items-center text-white hover:bg-indigo-600">
          Import from CSV <FaFile />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[400px] max-w-full -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-md shadow-lg text-white">
          <Dialog.Title className="text-lg font-bold mb-2">
            Import Buyers CSV
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 mb-4">
            Upload a CSV file with your buyers (max 200 rows). We will validate
            each row and show errors if any.
          </Dialog.Description>

          <div className="relative mb-4 h-32 w-full rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 transition">
            <label
              htmlFor="file"
              className="absolute cursor-pointer inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-gray-300"
            >
              {fileName ? (
                <div className="flex flex-col items-center gap-1">
                  <FaFileCsv className="text-green-500 text-4xl" />
                  <span className="text-sm text-gray-200">{fileName}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FaUpload className="text-3xl text-gray-400" />
                  <span className="text-sm">Upload CSV file</span>
                </div>
              )}
            </label>
            <input
              id="file"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                setErrorMessage("");
                setErrors([]);
                const selectedFile = e.target.files?.[0] || null;
                setFileName(selectedFile?.name || "");
                setFile(selectedFile);
              }}
            />
          </div>

          {errorMessage ? (
            <p className="text-red-500 text-center">{errorMessage}</p>
          ) : null}

          {errors.length > 0 && (
            <div className="mt-4 bg-red-900/40 border border-red-600 rounded-md p-3 text-sm max-h-40 overflow-y-auto">
              <p className="font-semibold text-red-400 mb-2">
                Validation Errors:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                {errors.map((err: any, index: number) => (
                  <li key={index} className="text-red-300">
                    <span className="font-medium">Row {err.row}:</span>{" "}
                    {err.errors.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close className="cursor-pointer px-3 h-10 rounded-md bg-gray-700 hover:bg-gray-600">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleUpload}
              className="px-3 h-10 flex items-center justify-center w-20 cursor-pointer rounded-md bg-indigo-500 hover:bg-indigo-600"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImportCSV;
