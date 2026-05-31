"use client";

import React from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

function RoomDesignCard({ room }) {
  return (
    <div>
      <div className="overflow-hidden rounded-lg">
        <ReactBeforeSliderComponent
          firstImage={{
            imageUrl: room?.aiImage,
          }}
          secondImage={{
            imageUrl: room?.orgImage,
          }}
        />
      </div>

      <h2 className="mt-2 text-sm">
        🏡 Room Type: {room?.roomType}
      </h2>

      <h2 className="text-sm">
        🎨 Design Type: {room?.designType}
      </h2>
    </div>
  );
}

export default RoomDesignCard;