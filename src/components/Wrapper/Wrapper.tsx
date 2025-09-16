"use client";
import supabase from "@/lib/supabaseClient";
import { AppDispatch } from "@/store";
import {
  selectUser,
  selectUserToken,
  setToken,
  setUser,
} from "@/store/slices/userSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectUserToken);
  const user = useSelector(selectUser);

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
    } catch (error) {
      dispatch(setUser({ user: null }));
    }
  };

  const getUserToken = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      dispatch(setToken({ token: data.session.access_token }));
    }
  };

  useEffect(() => {
    if (token) return;
    getUserToken();
  }, []);

  useEffect(() => {
    if ((user && user.id) || !token) return;
    getUserData();
  }, [token]);

  return <div>{children}</div>;
};

export default Wrapper;
