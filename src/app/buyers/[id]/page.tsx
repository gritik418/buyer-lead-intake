import BuyerHistoryComponent from "@/components/BuyerHistory/BuyerHistory";
import DeleteBuyerButton from "@/components/DeleteBuyerButton/DeleteBuyerButton";
import Navbar from "@/components/Navbar/Navbar";
import UpdateBuyerForm from "@/components/UpdateBuyerLead/UpdateBuyerLead";
import prisma from "@/lib/prismaClient";
import Link from "next/link";

export default async function BuyerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = await prisma.buyer.findUnique({
    where: { id: id },
  });

  if (!buyer)
    return (
      <div className="p-4 py-8 flex flex-col justify-center gap-6 items-center bg-gray-900 h-screen w-screen text-center">
        <div className="flex flex-col gap-2">
          <p className="text-gray-200 text-lg">
            Oops! The buyer you&apos;re looking for does not exist.
          </p>
          <p className="text-gray-400">
            They might have been removed or the ID is incorrect.
          </p>
        </div>
        <Link
          href="/buyers"
          className="bg-indigo-600 w-max text-white p-3 font-semibold rounded-lg"
        >
          Back to buyers
        </Link>
      </div>
    );

  const history = await prisma.buyerHistory.findMany({
    where: { buyerId: id },
    orderBy: { changedAt: "desc" },
    take: 6,
    include: {
      buyer: true,
      user: true,
    },
  });

  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 py-12">
        <div className="p-6 max-w-4xl mx-auto text-white">
          <div className="flex items-center mb-10 justify-between">
            <h1 className="text-2xl sm:text-4xl font-bold">
              View & Edit Buyer
            </h1>

            <DeleteBuyerButton id={id} />
          </div>

          <UpdateBuyerForm buyer={buyer} />

          {history.length > 0 ? (
            <BuyerHistoryComponent history={history} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
