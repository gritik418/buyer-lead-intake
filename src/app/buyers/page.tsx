import ImportCSV from "@/components/ImportCSV/ImportCSV";
import Navbar from "@/components/Navbar/Navbar";
import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import StatusDropdown from "@/components/StatusDropdown/StatusDropdown";
import prisma from "@/lib/prismaClient";
import { Buyer, City, PropertyType, Status, Timeline } from "@prisma/client";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

type QueryParams = Promise<{
  search?: string;
  city?: City;
  propertyType?: PropertyType;
  status?: Status;
  timeline?: Timeline;
  page?: string;
  sort?: string;
}>;

export const revalidate = 0;

export default async function BuyersPage(props: { searchParams: QueryParams }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (searchParams.search) {
    where.OR = [
      { fullName: { contains: searchParams.search, mode: "insensitive" } },
      { email: { contains: searchParams.search, mode: "insensitive" } },
      { phone: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  if (searchParams.city) where.city = searchParams.city;
  if (searchParams.propertyType) where.propertyType = searchParams.propertyType;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.timeline) where.timeline = searchParams.timeline;

  let orderBy: any = { updatedAt: "desc" };

  if (searchParams?.sort) {
    const keyValue = searchParams.sort.split(":");
    if (keyValue.length === 2) {
      orderBy = {
        [keyValue[0]]: keyValue[1],
      };
    }
  }

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: orderBy,
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 min-h-screen flex flex-col text-white h-full">
        <div className="p-6 max-w-7xl mx-auto flex flex-col">
          <div className="flex gap-8 justify my-8 items-center justify-between">
            <h1 className="text-2xl font-bold">Buyers</h1>

            <div className="flex gap-3">
              <ImportCSV />

              <Link
                href={`/api/buyers/export?${new URLSearchParams(
                  searchParams as any
                ).toString()}`}
                className="flex gap-2 bg-green-500 py-1 px-2 rounded-md items-center text-white"
              >
                Export CSV
              </Link>

              <Link
                href={"/buyers/new"}
                className="flex gap-2 bg-indigo-500 py-1 px-2 rounded-md items-center"
              >
                Add Buyer
                <FaPlus />
              </Link>
            </div>
          </div>

          <SearchBar />

          <form className="flex flex-wrap gap-4 my-6" action={"/buyers"}>
            <select
              name="city"
              defaultValue={searchParams.city || ""}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              <option value="">All Cities</option>
              {Object.values(City).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              name="propertyType"
              defaultValue={searchParams.propertyType || ""}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              <option value="">All Property Types</option>
              {Object.values(PropertyType).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={searchParams.status || ""}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              <option value="">All Status</option>
              {Object.values(Status).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              name="timeline"
              defaultValue={searchParams.timeline || ""}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              <option value="">All Timelines</option>
              {Object.values(Timeline).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={searchParams.sort || "updatedAt:desc"}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              <option value="updatedAt:desc">Updated (newest first)</option>
              <option value="updatedAt:asc">Updated (oldest first)</option>
              <option value="fullName:asc">{"Name (A - Z)"}</option>
              <option value="fullName:desc">{"Name (Z - A)"}</option>
            </select>

            <button
              type="submit"
              className="bg-indigo-500 cursor-pointer px-4 py-1 rounded text-white"
            >
              Apply
            </button>
          </form>

          <div className="overflow-x-auto w-full border border-gray-700 rounded">
            <table className="min-w-[1000px] border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-500">
                  <th className="border px-2 py-1 whitespace-nowrap">Name</th>
                  <th className="border px-2 py-1">Phone</th>
                  <th className="border px-2 py-1">City</th>
                  <th className="border px-2 py-1">Property Type</th>
                  <th className="border px-2 py-1">BHK</th>
                  <th className="border px-2 py-1">Budget</th>
                  <th className="border px-2 py-1">Timeline</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Updated At</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((b: Buyer) => (
                  <tr key={b.id}>
                    <td className="border px-2 py-1">{b.fullName}</td>
                    <td className="border px-2 py-1">{b.phone}</td>
                    <td className="border px-2 py-1">{b.city}</td>
                    <td className="border px-2 py-1">{b.propertyType}</td>
                    <td className="border px-2 py-1 text-center ">
                      {b.bhk || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {b.budgetMin ? b.budgetMin : "-"} -{" "}
                      {b.budgetMax ? b.budgetMax : "-"}
                    </td>
                    <td className="border px-2 py-1">{b.timeline}</td>
                    {/* <td className="border px-2 py-1">{b.status}</td>
                     */}
                    <td className="border px-2 py-1">
                      <StatusDropdown
                        defaultSelected={b.status}
                        ownerId={b.ownerId}
                        buyerId={b.id}
                      />
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(b.updatedAt).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      <a
                        href={`/buyers/${b.id}`}
                        className="text-indigo-400 font-semibold hover:underline"
                      >
                        View / Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 w-full flex flex-row items-center gap-2">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
