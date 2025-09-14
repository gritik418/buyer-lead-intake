"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FaFile } from "react-icons/fa";

const ImportCSV = () => {
  return (
    <Dialog.Root>
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

          <input
            type="file"
            accept=".csv"
            className="mb-4 w-full text-sm file:bg-indigo-500 file:text-white file:px-3 file:py-1 file:rounded-md"
          />

          <div className="flex justify-end gap-2 mt-8">
            <Dialog.Close className="cursor-pointer px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
              Cancel
            </Dialog.Close>
            <button className="px-3 py-1 cursor-pointer rounded-md bg-indigo-500 hover:bg-indigo-600">
              Upload
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImportCSV;
