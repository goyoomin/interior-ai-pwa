"use client";

import React, { useContext, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "../../../config/db";
import { Users } from "../../../config/schema";
import { UserDetailContext } from "../../_context/UserDetailContext";

function BuyCredits() {
  const [selectedOption, setSelectedOption] = useState(null);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const creditsOption = [
    {
      credits: 5,
      amount: 0.99,
    },
    {
      credits: 10,
      amount: 1.99,
    },
    {
      credits: 25,
      amount: 3.99,
    },
    {
      credits: 50,
      amount: 6.99,
    },
    {
      credits: 100,
      amount: 9.99,
    },
  ];

  const onPaymentSuccess = async () => {
    if (!selectedOption || !userDetail?.email) return;

    const updatedCredits =
      Number(userDetail?.credits || 0) + Number(selectedOption.credits);

    const result = await db
      .update(Users)
      .set({
        credits: updatedCredits,
      })
      .where(eq(Users.email, userDetail.email))
      .returning({
        id: Users.id,
        credits: Users.credits,
      });

    if (result) {
      setUserDetail((prev) => ({
        ...prev,
        credits: updatedCredits,
      }));

      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen px-5 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">Buy More Credits</h2>

      <div className="flex flex-wrap gap-4 justify-center">
        {creditsOption.map((item, index) => (
          <div
            key={index}
            className={`card bg-base-100 w-40 shadow-xl border cursor-pointer ${
              selectedOption?.credits === item.credits
                ? "border-primary border-2"
                : "border-gray-100"
            }`}
          >
            <div className="card-body items-center text-center p-5">
              <h2 className="card-title text-lg">{item.credits} Credits</h2>
              <p className="text-sm">for ${item.amount}</p>

              <button
                className="btn btn-primary btn-sm mt-3"
                onClick={() => setSelectedOption(item)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10 px-4">
        {selectedOption?.amount && (
          <PayPalButtons
            style={{
              layout: "horizontal",
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: selectedOption.amount.toFixed(2),
                      currency_code: "USD",
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              await actions.order.capture();
              await onPaymentSuccess();
            }}
            onCancel={() => {
              console.log("Payment Cancelled");
            }}
            onError={(err) => {
              console.error("PayPal Checkout Error", err);
              alert("결제 처리 중 오류가 발생했습니다.");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default BuyCredits;