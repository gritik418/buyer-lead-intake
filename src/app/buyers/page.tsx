import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import prisma from "@/lib/prismaClient";
import { Buyer, City, PropertyType, Status, Timeline } from "@prisma/client";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface QueryParams {
  search?: string;
  city?: City;
  propertyType?: PropertyType;
  status?: Status;
  timeline?: Timeline;
  page?: string;
}

export const revalidate = 0;

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: QueryParams;
}) {
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

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white h-full">
      <div className="p-6 max-w-7xl mx-auto flex flex-col">
        <div className="flex gap-8 justify my-8 items-center justify-between">
          <h1 className="text-2xl font-bold">Buyers</h1>

          <Link
            href={"/buyers/new"}
            className="flex gap-2 bg-indigo-500 py-1 px-2 rounded-md items-center"
          >
            Add Buyer
            <FaPlus />
          </Link>
        </div>

        <SearchBar />

        <table className="w-full mt-6 border-collapse border">
          <thead>
            <tr className="bg-gray-500">
              <th className="border px-2 py-1">Name</th>
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
                <td className="border px-2 py-1">{b.status}</td>
                <td className="border px-2 py-1">
                  {new Date(b.updatedAt).toLocaleString()}
                </td>
                <td className="border px-2 py-1">
                  <a
                    href={`/buyers/${b.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View / Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 w-full flex flex-row items-center gap-2">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
