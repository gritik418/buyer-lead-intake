import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex-1 flex flex-col bg-gray-900 h-[calc(100vh-64px)] pb-16 items-center justify-center text-center px-6">
        <h2 className="text-4xl sm:text-5xl text-white font-bold mb-4">
          Manage Your Buyer Leads Efficiently
        </h2>
        <p className="text-gray-400 max-w-xl mb-8">
          Capture, organize, and track real estate buyer leads with ease. Import
          via CSV, filter and search leads
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/buyers/new"
            className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-500/90 transition"
          >
            Add New Lead
          </Link>
          <Link
            href="/buyers"
            className="px-6 py-3 rounded-lg border-2 border-gray-700 font-semibold bg-white text-black hover:bg-gray-200 transition"
          >
            View All Leads
          </Link>
        </div>
      </main>
    </div>
  );
}
