"use client";

import React, { useState } from "react";

function ImageSelection({ selectedFile }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const onFileSelected = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      if (selectedFile) {
        selectedFile(file);
      }
    }
  };

  return (
    <div>
      <label>Select Image of your room</label>

      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={onFileSelected}
        />
      </div>

      {selectedImage && (
        <div className="mt-5 max-w-[500px] w-full">
          <img
            src={selectedImage}
            alt="Selected room"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}

export default ImageSelection;