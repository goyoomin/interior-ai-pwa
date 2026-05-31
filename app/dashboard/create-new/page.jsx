"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { eq } from "drizzle-orm";

import { storage } from "../../../config/firebaseConfig";
import { db } from "../../../config/db";
import { Users } from "../../../config/schema";
import { UserDetailContext } from "../../_context/UserDetailContext";

import ImageSelection from "./_components/ImageSelection";
import RoomType from "./_components/RoomType";
import DesignType from "./_components/DesignType";
import AdditionalReq from "./_components/AdditionalReq";
import CustomLoading from "./_components/CustomLoading";
import AiOutputDialog from "./_components/AiOutputDialog";

function CreateNew() {
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState();
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [orgImage, setOrgImage] = useState();

  const onHandleInputChange = (value, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const saveRawImageToFirebase = async () => {
    const fileName = Date.now() + "_raw.png";
    const imageRef = ref(storage, "interior-ai/" + fileName);

    await uploadBytes(imageRef, formData.image);
    console.log("File Uploaded...");

    const downloadUrl = await getDownloadURL(imageRef);
    console.log("Uploaded Raw Image URL:", downloadUrl);

    setOrgImage(downloadUrl);
    return downloadUrl;
  };

  const updateUserCredits = async () => {
    if (!userDetail?.email) {
      return;
    }

    const updatedCredits = Number(userDetail?.credits || 0) - 1;

    const result = await db
      .update(Users)
      .set({
        credits: updatedCredits,
      })
      .where(eq(Users.email, userDetail.email))
      .returning({
        id: Users.id,
      });

    if (result) {
      setUserDetail((prev) => ({
        ...prev,
        credits: updatedCredits,
      }));
    }
  };

  const generateAIImage = async () => {
    if (!formData?.image) {
      alert("이미지를 선택하세요.");
      return;
    }

    if (!formData?.roomType) {
      alert("Room Type을 선택하세요.");
      return;
    }

    if (!formData?.designType) {
      alert("Design Type을 선택하세요.");
      return;
    }

    if (Number(userDetail?.credits || 0) <= 0) {
      alert("크레딧이 부족합니다. Buy More Credits에서 충전해주세요.");
      return;
    }

    try {
      setLoading(true);

      const rawImageUrl = await saveRawImageToFirebase();

      const result = await axios.post("/api/interior-ai", {
        imageUrl: rawImageUrl,
        roomType: formData.roomType,
        designType: formData.designType,
        additionalReq: formData.additionalReq || "",
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });

      console.log("API result:", result.data);

      setAiOutputImage(result.data.result);
      await updateUserCredits();

      setOpenOutputDialog(true);
      setLoading(false);
    } catch (error) {
      console.error("Generate error:", error);
      console.error("Server Response:", error.response?.data);
      alert("AI 이미지 생성 또는 DB 저장 중 오류가 발생했습니다. Console을 확인하세요.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2
        style={{
          color: "purple",
          fontWeight: "bold",
          fontSize: "2.5rem",
          textAlign: "center",
        }}
      >
        Create AI Interior
      </h2>

      {loading ? (
        <CustomLoading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            <ImageSelection
              selectedFile={(value) => onHandleInputChange(value, "image")}
            />
          </div>

          <div className="rounded-lg shadow-sm space-y-5">
            <RoomType
              selectedRoomType={(value) =>
                onHandleInputChange(value, "roomType")
              }
            />

            <DesignType
              selectedDesignType={(value) =>
                onHandleInputChange(value, "designType")
              }
            />

            <AdditionalReq
              additionalReqInput={(value) =>
                onHandleInputChange(value, "additionalReq")
              }
            />

            <button
              className="btn btn-primary w-full mt-5"
              onClick={generateAIImage}
            >
              Generate
            </button>

            <p className="text-gray-500 text-xs mt-1">
              Each generation costs one credit
            </p>
          </div>
        </div>
      )}

      <AiOutputDialog
        openDialog={openOutputDialog}
        setOpenDialog={setOpenOutputDialog}
        orgImage={orgImage}
        aiImage={aiOutputImage}
      />
    </div>
  );
}

export default CreateNew;