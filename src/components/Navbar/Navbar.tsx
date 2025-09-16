"use client";
import supabase from "@/lib/supabaseClient";
import { AppDispatch } from "@/store";
import { selectUser, setToken, setUser } from "@/store/slices/userSlice";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    dispatch(setUser({ user: null }));
    dispatch(setToken({ token: null }));

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
          {user?.id ? (
            <Link href={"/buyers"} className="hover:text-gray-300">
              Buyers
            </Link>
          ) : (
            <Link
              href={"/login"}
              className="flex items-center justify-center gap-1 bg-gray-600 py-1 px-3 rounded-sm font-semibold"
            >
              Login <LogIn size={18} />
            </Link>
          )}

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
