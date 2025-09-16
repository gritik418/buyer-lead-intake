"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState<string>(searchParams.get("search") || "");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set("search", debouncedQuery);
    else params.delete("search");

    router.replace(`/buyers?${params.toString()}`);
  }, [debouncedQuery]);

  return (
    <div className="flex">
      <label htmlFor="buyer-search" className="sr-only">
        Search Buyers
      </label>
      <input
        type="text"
        id="buyer-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, phone, or email..."
        className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
