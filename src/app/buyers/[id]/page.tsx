import BuyerHistoryComponent from "@/components/BuyerHistory/BuyerHistory";
import DeleteBuyerButton from "@/components/DeleteBuyerButton/DeleteBuyerButton";
import Navbar from "@/components/Navbar/Navbar";
import UpdateBuyerForm from "@/components/UpdateBuyerLead/UpdateBuyerLead";
import prisma from "@/lib/prismaClient";
import { notFound } from "next/navigation";

export default async function BuyerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = await prisma.buyer.findUnique({
    where: { id: id },
  });

  if (!buyer) return notFound();

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
