"use client";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      },
    });
  };

  return (
    <main className="mx-auto h-screen bg-gray-900 p-6">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        {/* Branding */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <h1 className="text-indigo-300 text-4xl font-extrabold tracking-tight">
            BLT <span className="text-white">– Buyer Lead Intake</span>
          </h1>
          <p className="mt-3 text-base text-gray-400">
            Streamline and manage your leads efficiently
          </p>
          <h2
            className="mt-10 text-2xl font-semibold text-white"
            id="sign-in-heading"
          >
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-gray-400">Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleLogin}
              className="flex w-full cursor-pointer justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
