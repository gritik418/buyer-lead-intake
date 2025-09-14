import SearchBar from "@/components/SearchBar/SearchBar";
import prisma from "@/lib/prismaClient";
import { Buyer, City, PropertyType, Status, Timeline } from "@prisma/client";

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
    <div className="bg-gray-900 min-h-screen text-white h-full">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Buyers</h1>

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
        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <a
                key={p}
                href={`?page=${p}`}
                className={`px-3 py-1 border rounded ${
                  p === page ? "bg-blue-500 text-white" : ""
                }`}
              >
                {p}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
