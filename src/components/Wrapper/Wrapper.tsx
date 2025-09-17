"use client";
import supabase from "@/lib/supabaseClient";
import { AppDispatch } from "@/store";
import {
  selectUser,
  selectUserToken,
  setToken,
  setUser,
} from "@/store/slices/userSlice";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectUserToken);
  const user = useSelector(selectUser);
  const [checkedUser, setCheckedUser] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      const getUserToken = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          dispatch(setToken({ token: data.session.access_token }));
        } else {
          setCheckedUser(true);
        }
      };
      getUserToken();
    }
  }, [token, dispatch, pathname]);

  useEffect(() => {
    if (token) {
      const getUserData = async () => {
        try {
          const response = await fetch("/api/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          });

          const result = await response.json();

          if (result?.success) {
            dispatch(setUser({ user: result?.user }));
          } else {
            dispatch(setUser({ user: null }));
          }
        } catch (error: unknown) {
          console.error(error);
          dispatch(setUser({ user: null }));
        } finally {
          setCheckedUser(true);
        }
      };

      if (!user?.id) {
        getUserData();
      } else {
        setCheckedUser(true);
      }
    }

    if (user?.id) setCheckedUser(true);
  }, [token, user?.id, dispatch]);

  useEffect(() => {
    if (checkedUser && (!user || !user.id)) {
      const isProtected = pathname.includes("/buyers");

      if (isProtected) {
        redirect("/login");
      }
    }
  }, [checkedUser, user, router, pathname]);

  if (!checkedUser) {
    return (
      <div className="bg-gray-900 h-screen w-screen flex items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-white"
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

  return <div>{children}</div>;
};

export default Wrapper;
