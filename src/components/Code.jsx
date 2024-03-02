import React, { useContext } from "react";
import { AppContext } from "../App";

function Code() {
  const { data, highlighted, minus } = useContext(AppContext);
  return (
    <div className="bg-gray-100 w-[750px] max-w-[95%] min-h-[300px] rounded-sm p-2">
      <div className="">
        {data.text.length > 0 ? (
          data.text.map((line, index) => {
            const numberOfSpaces = data.spaces[index];
            const spaceString = Array(numberOfSpaces + 1).join("\u00A0");
            let targetted = highlighted && highlighted.has(index + 1);
            if (minus) {
              var value = minus.get(index + 1);
            }
            return (
              <div key={index} className="relative">
                {targetted && value && (
                  <span className="absolute -left-[50px] text-red-500 font-medium">
                    -{value}
                  </span>
                )}
                <div
                  className={`flex justify-start items-center ${
                    targetted ? "text-red-500" : ""
                  } ${highlighted && !targetted ? "text-green-700" : ""}`}
                >
                  <span className="text-gray-500 text-xs sm:text-sm select-none mr-3">
                    {index + 1} &nbsp;
                  </span>
                  {spaceString}
                  {line}
                  <br />
                </div>
              </div>
            );
          })
        ) : (
          <span className="text-gray-400">Upload a python file</span>
        )}
      </div>
    </div>
  );
}

export default Code;
