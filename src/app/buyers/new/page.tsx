"use client";
import Navbar from "@/components/Navbar/Navbar";
import TagChipsInput from "@/components/TagChips/TagChips";
import { selectUser, selectUserToken } from "@/store/slices/userSlice";
import { buyerSchema, BuyerType } from "@/validators/buyer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CreateBuyerPage() {
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector(selectUserToken);
  const user = useSelector(selectUser);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<BuyerType>({
    resolver: zodResolver(buyerSchema) as any,
    defaultValues: {
      budgetMin: 5000,
      budgetMax: 10000,
    },
  });

  const propertyType = watch("propertyType");

  const onSubmit = async (data: BuyerType) => {
    if (!user || !user.id) {
      toast.error("Login to create a lead.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, bhk: data.bhk || undefined, tags }),
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
    <div>
      <Navbar />
      <div className="bg-gray-900 py-10 pb-20">
        <div className="max-w-xl text-white mx-auto p-6">
          <h1 className="text-4xl font-bold mb-8">Create New Lead</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block font-medium">
                Full Name
              </label>
              <input
                {...register("fullName")}
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
                {...register("email")}
                id="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium">
                Phone
              </label>
              <input
                {...register("phone")}
                id="phone"
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block font-medium">
                City
              </label>
              <select
                {...register("city")}
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
              {errors.city && (
                <p className="text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="propertyType" className="block font-medium">
                Property Type
              </label>
              <select
                {...register("propertyType")}
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
                {errors.bhk && (
                  <p className="text-red-500">{errors.bhk.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="purpose" className="block font-medium">
                Purpose
              </label>
              <select
                {...register("purpose")}
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
                {...register("budgetMin", { valueAsNumber: true })}
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
                {...register("budgetMax", { valueAsNumber: true })}
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
                {...register("timeline")}
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
                {...register("source")}
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
              {errors.notes && (
                <p className="text-red-500">{errors.notes.message}</p>
              )}
            </div>

            <div className="my-4">
              <label className="font-semibold">Tags</label>
              <TagChipsInput tags={tags} onChange={setTags} />
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <button
              type="submit"
              className="bg-blue-600 mt-8 text-white px-4 py-2 w-full rounded-lg font-semibold cursor-pointer"
            >
              {loading ? "Saving..." : "Create Lead"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
