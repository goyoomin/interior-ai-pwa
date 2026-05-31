"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";
import RoomDesignCard from "./RoomDesignCard";

function Listing() {
  const { user } = useUser();
  const [userRoomList, setUserRoomList] = useState([]);

  useEffect(() => {
    if (user) {
      GetUserRoomList();
    }
  }, [user]);

  const GetUserRoomList = async () => {
    const result = await db
      .select()
      .from(AiGeneratedImage)
      .where(
        eq(
          AiGeneratedImage.userEmail,
          user?.primaryEmailAddress?.emailAddress
        )
      )
      .orderBy(desc(AiGeneratedImage.id));

    console.log("User Room List:", result);
    setUserRoomList(result);
  };

  return (
    <div>
      <div className="mt-10 flex justify-between items-center text-xl font-bold">
        <h2>Hello, {user?.fullName}</h2>

        <Link href="/dashboard/create-new">
          <button className="btn btn-primary">
            + Generate AI Interior
          </button>
        </Link>
      </div>

      {userRoomList?.length === 0 ? (
        <div className="flex justify-center items-center h-full text-2xl text-gray-500 mt-32">
          No Interior AI Designs Generated Yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {userRoomList.map((room, index) => (
            <RoomDesignCard key={index} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Listing;