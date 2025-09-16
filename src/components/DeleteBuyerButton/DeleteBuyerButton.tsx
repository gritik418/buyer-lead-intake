"use client";
import { selectUserToken } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const DeleteBuyerButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const token = useSelector(selectUserToken);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!token) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this buyer?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/buyers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result?.success) {
        toast.success(result?.message);
        router.push("/buyers");
        return;
      } else {
        toast.error(result?.message);
        return;
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <button
      onClick={handleDelete}
      className="text-white h-10 w-24 justify-center cursor-pointer px-2 py-1 rounded text-base flex items-center font-semibold bg-red-400 gap-2"
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
        <>
          <FaTrash /> Delete
        </>
      )}
    </button>
  );
};

export default DeleteBuyerButton;
