"use client";

import React, { useContext } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { UserDetailContext } from "../../_context/UserDetailContext";

function Header() {
  const contextValue = useContext(UserDetailContext);
  const userDetail = contextValue?.userDetail;

  const credits = userDetail?.credits ?? 5;

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Interior AI
        </Link>

        <p>2022810004 고유민</p>
      </div>

      <div className="flex-none gap-3">
        <Link href="/dashboard/buy-credits">
          <button className="btn btn-ghost">Buy More Credits</button>
        </Link>

        <button className="btn">
          <div className="badge badge-secondary">{credits}</div>
          Credits left
        </button>

        <UserButton />
      </div>
    </div>
  );
}

export default Header;