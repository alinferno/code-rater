import React from "react";
import { useContext } from "react";
import { AppContext } from "../App";

function Score() {
  const { score } = useContext(AppContext);
  return (
    <div className="flex justify-center items-center flex-col gap-1">
      <h1 className="text-5xl font-medium">
        <span
          className={`${
            score < 20
              ? "text-red-500"
              : score < 50
              ? "text-yellow-400"
              : score < 70
              ? "text-green-500"
              : score < 90
              ? "text-green-600"
              : "text-green-700"
          }`}
        >
          {score}&nbsp;
        </span>
        / 100
      </h1>
      <h2 className="font-medium text-2xl text-red-600">-30</h2>
    </div>
  );
}

export default Score;
