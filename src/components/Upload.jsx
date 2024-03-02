import React from "react";
import { useContext } from "react";
import { AppContext } from "../App";

function Upload() {
  const { showFile } = useContext(AppContext);
  return (
    <div className="w-[50%] flex justify-center items-center mx-auto">
      <label
        htmlFor="file-upload"
        className="bg-green-500 text-white px-4 py-2 hover:cursor-pointer hover:bg-green-400"
      >
        Upload
      </label>
      <input
        id="file-upload"
        className="hidden"
        type="file"
        onChange={(e) => showFile(e)}
      />
    </div>
  );
}

export default Upload;
