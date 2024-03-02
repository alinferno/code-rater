import React from "react";
import { useContext } from "react";
import { AppContext } from "../App";

function Score() {
  const { score } = useContext(AppContext);
  return (
    <div>
      <h1 className="text-4xl font-medium">
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
    </div>
  );
}

export default Score;
