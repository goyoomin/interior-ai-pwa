"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { db } from "../config/db";
import { Users } from "../config/schema";
import { UserDetailContext } from "./_context/UserDetailContext";

function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      verifyUser();
    }
  }, [isLoaded, user]);

  const verifyUser = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) return;

    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail));

    if (result.length === 0) {
      const newUser = await db
        .insert(Users)
        .values({
          name: user?.fullName,
          email: userEmail,
          imageUrl: user?.imageUrl,
          credits: 5,
        })
        .returning({
          id: Users.id,
          name: Users.name,
          email: Users.email,
          imageUrl: Users.imageUrl,
          credits: Users.credits,
        });

      setUserDetail(newUser[0]);
    } else {
      setUserDetail(result[0]);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          currency: "USD",
        }}
      >
        {children}
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  );
}

export default Provider;