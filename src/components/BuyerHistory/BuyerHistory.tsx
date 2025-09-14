import React from "react";
import { BuyerHistory, User } from "@prisma/client";

interface History extends BuyerHistory {
  user?: User;
  diff: {
    action?: "Created" | "Updated";
    data?: DiffData;
  };
}
interface DiffData {
  [key: string]: any;
}

const BuyerHistoryComponent = ({ history }: { history: BuyerHistory[] }) => {
  const recentHistory: History[] = history
    .sort(
      (a, b) =>
        new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    )
    .slice(0, 5) as History[];

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white">Recent Changes</h2>

      <ul className="space-y-6">
        {recentHistory.map((h: History) => (
          <li key={h.id} className="bg-gray-700 p-3 rounded-md">
            <div className="text-sm text-gray-300">
              <div className="flex justify-between">
                <div>
                  {h.diff.action} by:{" "}
                  <span className="font-semibold">
                    {h?.user?.name}
                    {h?.user?.email}
                  </span>{" "}
                </div>

                <div className="text-green-400 font-bold">{h.diff.action}</div>
              </div>
              <pre className="bg-gray-900 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
                {JSON.stringify(h.diff?.data, null, 2)}
              </pre>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(h.changedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerHistoryComponent;
