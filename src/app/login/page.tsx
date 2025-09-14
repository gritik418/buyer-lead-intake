"use client";
import supabase from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
    setLoading(false);
    if (data) {
      setMessage("Check your email for the magic link!");
    }
    if (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) redirect("/");
    });
  }, []);

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
              className="flex w-full cursor-pointer rounded-md bg-indigo-500 px-3 h-10 items-center justify-center text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                "Sign in"
              )}
            </button>
          </div>

          {!error && message ? (
            <p className="text-green-800 font-semibold py-1 rounded my-3 bg-green-100 sm:mx-auto sm:w-full sm:max-w-sm text-center">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="text-red-800 font-semibold py-1 rounded my-3 bg-red-100 sm:mx-auto sm:w-full sm:max-w-sm text-center">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
