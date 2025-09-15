"use client";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const DeleteBuyerButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
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

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setToken(data.session.access_token);
      }
    };
    getUser();
  }, []);

  if (!token) return null;

  return (
    <button
      onClick={handleDelete}
      className="text-white cursor-pointer px-2 py-1 rounded text-base flex items-center font-semibold bg-red-400 gap-1"
    >
      <FaTrash /> Delete
    </button>
  );
};

export default DeleteBuyerButton;
