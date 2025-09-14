import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="h-16 bg-gray-800 text-white flex items-center justify-between px-6 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <Link href={"/"}>
          <h1 className="font-bold text-xl">BLI</h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link href={"/buyers"} className="hover:text-gray-300">
            Buyers
          </Link>
          <button className="hover:text-gray-300">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
