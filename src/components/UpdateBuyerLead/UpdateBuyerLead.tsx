"use client";
import supabase from "@/lib/supabaseClient";
import { BuyerType } from "@/validators/buyer";
import { Buyer } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  buyer: Buyer;
}

const UpdateBuyerForm = ({ buyer }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Buyer>({
    defaultValues: buyer,
  });

  const propertyType = watch("propertyType");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setToken(data.session.access_token);
      } else {
        redirect("/login");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (propertyType !== "Apartment" && propertyType !== "Villa") {
      setValue("bhk", null);
    }
  }, [propertyType, setValue]);

  const submitHandler = async (data: Buyer) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/buyers/${buyer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, bhk: data.bhk || undefined }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json?.errors) {
          Object.entries(json.errors).forEach(([field, errorObj]: any) => {
            if (errorObj?._errors?.length) {
              setError(field as keyof BuyerType, {
                type: "manual",
                message: errorObj._errors[0],
              });
            }
          });
        } else {
          setErrorMessage(json?.error || "Something went wrong.");
        }
      } else {
        router.push("/buyers");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block font-medium">
          Full Name
        </label>
        <input
          {...register("fullName", { required: "Full Name is required" })}
          id="fullName"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />
        {errors.fullName && (
          <p className="text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          {...register("email", { required: "Email is required" })}
          id="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block font-medium">
          Phone
        </label>
        <input
          {...register("phone", { required: "Phone is required" })}
          id="phone"
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="city" className="block font-medium">
          City
        </label>
        <select
          {...register("city", { required: "City is required" })}
          id="city"
          className="w-full border p-2 rounded"
        >
          <option value="">Select City</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
      </div>

      <div>
        <label htmlFor="propertyType" className="block font-medium">
          Property Type
        </label>
        <select
          {...register("propertyType", {
            required: "Property Type is required",
          })}
          id="propertyType"
          className="w-full border p-2 rounded"
        >
          <option value="">Select Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        {errors.propertyType && (
          <p className="text-red-500">{errors.propertyType.message}</p>
        )}
      </div>

      {(propertyType === "Apartment" || propertyType === "Villa") && (
        <div>
          <label htmlFor="bhk" className="block font-medium">
            BHK
          </label>
          <select
            {...register("bhk")}
            id="bhk"
            className="w-full border p-2 rounded"
          >
            <option value="">Select BHK</option>
            <option value="One">1</option>
            <option value="Two">2</option>
            <option value="Three">3</option>
            <option value="Four">4</option>
            <option value="Studio">Studio</option>
          </select>
          {errors.bhk && <p className="text-red-500">{errors.bhk.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="purpose" className="block font-medium">
          Purpose
        </label>
        <select
          {...register("purpose", { required: "Purpose is required" })}
          id="purpose"
          className="w-full border p-2 rounded"
        >
          <option value="">Purpose</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        {errors.purpose && (
          <p className="text-red-500">{errors.purpose.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetMin" className="block font-medium">
          Budget Min
        </label>
        <input
          {...register("budgetMin", {
            valueAsNumber: true,
            required: "Budget Min is required",
          })}
          id="budgetMin"
          placeholder="Budget Min"
          className="w-full border p-2 rounded"
        />
        {errors.budgetMin && (
          <p className="text-red-500">{errors.budgetMin.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetMax" className="block font-medium">
          Budget Max
        </label>
        <input
          {...register("budgetMax", {
            valueAsNumber: true,
            required: "Budget Max is required",
          })}
          id="budgetMax"
          placeholder="Budget Max"
          className="w-full border p-2 rounded"
        />
        {errors.budgetMax && (
          <p className="text-red-500">{errors.budgetMax.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="timeline" className="block font-medium">
          Timeline
        </label>
        <select
          {...register("timeline", { required: "Timeline is required" })}
          id="timeline"
          className="w-full border p-2 rounded"
        >
          <option value="">Timeline</option>
          <option value="ZeroTo3m">0-3m</option>
          <option value="ThreeTo6m">3-6m</option>
          <option value="Over6m">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>
        {errors.timeline && (
          <p className="text-red-500">{errors.timeline.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="source" className="block font-medium">
          Source
        </label>
        <select
          {...register("source", { required: "Source is required" })}
          id="source"
          className="w-full border p-2 rounded"
        >
          <option value="">Source</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Walk_in">Walk-in</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
        {errors.source && (
          <p className="text-red-500">{errors.source.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block font-medium">
          Notes
        </label>
        <textarea
          {...register("notes")}
          id="notes"
          placeholder="Notes"
          className="w-full border p-2 rounded"
        />
        {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
      </div>

      <div>
        <label htmlFor="tags" className="block font-medium">
          Tags
        </label>
        <input
          {...register("tags")}
          id="tags"
          placeholder="Tags (, separated)"
          className="w-full border p-2 rounded"
        />
      </div>

      <input
        className="hidden"
        {...register("updatedAt")}
        value={buyer.updatedAt.toISOString()}
        name="updatedAt"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 mt-8 text-white px-4 py-2 w-full rounded-lg font-semibold cursor-pointer"
      >
        {isSubmitting ? "Updating..." : "Update Lead"}
      </button>
    </form>
  );
};

export default UpdateBuyerForm;
