import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-5xl">
            <h1 className="text-5xl font-bold mb-4">
              AI Room and Home{" "}
              <span className="text-primary">Interior AI</span>
            </h1>

            <p className="text-lg mb-6">Transform Your Space with AI</p>

            <div className="flex justify-center mb-10">
              <Link href="/dashboard" className="btn btn-primary">
                Get started
              </Link>
            </div>

            <div className="flex justify-center">
              <Image
                src="/group.png"
                alt="Interior AI"
                width={1000}
                height={600}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}