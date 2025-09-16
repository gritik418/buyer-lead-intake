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
  const recentHistory = history as History[];

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white">Recent Changes</h2>

      <ul className="space-y-6">
        {recentHistory.slice(0, 5).map((h: History, index: number) => {
          if (
            h.diff.action === "Created" ||
            recentHistory[index + 1] == undefined
          )
            return (
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

                    <div className="text-green-400 font-bold">
                      {h.diff.action}
                    </div>
                  </div>
                  <pre className="bg-gray-900 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
                    {JSON.stringify(h.diff?.data, null, 2)}
                  </pre>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(h.changedAt).toLocaleString()}
                </div>
              </li>
            );
          else {
            return (
              <li key={h.id} className="bg-gray-700 p-3 rounded-md">
                <div className="text-sm text-gray-300">
                  <div className="flex justify-between">
                    <div>
                      {h.diff.action} by:{" "}
                      <span className="font-semibold">
                        {h?.user?.name} {h?.user?.name && h.user?.email && " "}{" "}
                        {h?.user?.email}
                      </span>{" "}
                    </div>

                    <div className="text-green-400 font-bold">
                      {h.diff.action}
                    </div>
                  </div>
                  <div className="flex bg-gray-900 rounded mt-1 items-center justify-between">
                    <div className="flex-5/12 p-2 whitespace-pre-wrap text-xs">
                      <div className="flex w-full font-semibold text-indigo-300 text-sm items-center justify-center mb-4">
                        Old
                      </div>
                      <pre>
                        {JSON.stringify(
                          recentHistory[index + 1]?.diff?.data,
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    <div className="flex-1/12">{"->"}</div>

                    <div className="flex-5/12 p-2 whitespace-pre-wrap text-xs">
                      <div className="flex w-full font-semibold text-indigo-300 text-sm items-center justify-center mb-4">
                        New
                      </div>
                      <pre>{JSON.stringify(h.diff?.data, null, 2)}</pre>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(h.changedAt).toLocaleString()}
                </div>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default BuyerHistoryComponent;
