import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";

import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebaseConfig";

import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function ConvertImageToBase64(imageUrl) {
  const resp = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const base64ImageRaw = Buffer.from(resp.data).toString("base64");
  const base64Image = "data:image/png;base64," + base64ImageRaw;

  return base64Image;
}

export async function POST(request) {
  const { imageUrl, roomType, designType, additionalReq, userEmail } =
    await request.json();

  try {
    const prompt =
      "A " +
      roomType +
      " with a " +
      designType +
      " style interior. " +
      (additionalReq || "");

    console.log("Input Image URL:", imageUrl);
    console.log("Prompt:", prompt);
    console.log("User Email:", userEmail);

    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: imageUrl,
          prompt: prompt,
        },
      }
    );

    console.log("Replicate Output:", output);

    const outputUrl = Array.isArray(output) ? output[0] : output;

    console.log("AI Image URL:", outputUrl);

    const base64Image = await ConvertImageToBase64(outputUrl);

    const fileName = Date.now() + ".png";
    const storageRef = ref(storage, "interior-ai/" + fileName);

    await uploadString(storageRef, base64Image, "data_url");

    const downloadUrl = await getDownloadURL(storageRef);

    console.log("Final Firebase AI Image URL:", downloadUrl);

    const dbResult = await db
      .insert(AiGeneratedImage)
      .values({
        roomType: roomType,
        designType: designType,
        orgImage: imageUrl,
        aiImage: downloadUrl,
        userEmail: userEmail,
      })
      .returning({
        id: AiGeneratedImage.id,
      });

    console.log("DB Insert Result:", dbResult);

    return NextResponse.json({
      result: downloadUrl,
      dbResult: dbResult,
    });
  } catch (error) {
    console.error("AI generation or DB insert error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}