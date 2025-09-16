"use client";
import supabase from "@/lib/supabaseClient";
import { selectUser } from "@/store/slices/userSlice";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="h-16 bg-gray-800 text-white flex items-center justify-between px-6 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <Link href={"/"}>
          <h1 className="font-bold text-xl">BLI</h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link href={"/buyers"} className="hover:text-gray-300">
            Buyers
          </Link>

          {user && user.id ? (
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer bg-gray-700 py-1 px-2 rounded-sm gap-2 text-sm hover:text-gray-300 transition-colors"
            >
              Logout
              <LogOut className="text-[8px] h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
