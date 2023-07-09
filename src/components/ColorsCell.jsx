import React from "react";

export default function ColorsCell({ values }) {
  return (
    <div className="flex">
      {values.map((color, index) => (
        <span
          key={index}
          className="inline-block bg-blue-500 text-white text-xs py-1 px-2 rounded-full mr-1"
        >
          {color}
        </span>
      ))}
    </div>
  );
}
