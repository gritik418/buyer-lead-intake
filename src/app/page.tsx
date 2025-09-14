"use client";
import Navbar from "@/components/Navbar/Navbar";
import supabase from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) redirect("/login");
      else setUser(data.session.user);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-gray-900"
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
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="flex-1 flex flex-col bg-gray-900 h-[calc(100vh-64px)] pb-16 items-center justify-center text-center px-6">
        <h2 className="text-4xl sm:text-5xl text-white font-bold mb-4">
          Manage Your Buyer Leads Efficiently
        </h2>
        <p className="text-gray-400 max-w-xl mb-8">
          Capture, organize, and track real estate buyer leads with ease. Import
          via CSV, filter and search leads
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/buyers/new"
            className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-500/90 transition"
          >
            Add New Lead
          </Link>
          <Link
            href="/buyers"
            className="px-6 py-3 rounded-lg border-2 border-gray-700 font-semibold bg-white text-black hover:bg-gray-200 transition"
          >
            View All Leads
          </Link>
        </div>
      </main>
    </div>
  );
}
