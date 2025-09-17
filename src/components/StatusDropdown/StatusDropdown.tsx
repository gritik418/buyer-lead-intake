"use client";
import { selectUser, selectUserToken } from "@/store/slices/userSlice";
import { Status } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type PropsType = {
  defaultSelected?: Status;
  ownerId: string;
  buyerId: string;
};

const StatusDropdown = ({ defaultSelected, ownerId, buyerId }: PropsType) => {
  const user = useSelector(selectUser);
  const token = useSelector(selectUserToken);

  const [currentStatus, setCurrentStatus] = useState<Status | undefined>(
    defaultSelected
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user || !user.id || (user.id !== ownerId && user.role !== "ADMIN")) {
    return <p> {defaultSelected}</p>;
  }
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    setCurrentStatus(newStatus);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/buyers/${buyerId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (result?.success) {
        toast.success(result?.message);
      } else {
        toast.error(result?.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setCurrentStatus(defaultSelected);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isLoading}
      >
        {Object.keys(Status).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusDropdown;
