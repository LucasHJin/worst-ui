import React from "react";

// https://www.geeksforgeeks.org/how-to-use-modal-component-in-reactjs/
export const Modal = ({ isShown, onYes, onNo, numberArr }) => {
  if (!isShown) return null;

  const formattedNumberArr = `(${numberArr.slice(0, 3).join("")}) ${numberArr
    .slice(3, 6)
    .join("")}-${numberArr.slice(6).join("")}`;
  return (
    <div className="flex items-center justify-center fixed inset-0 backdrop-blur-sm">
      <div className="border rounded-xl bg-white w-1/4 shadow-xl p-6 flex flex-col items-center">
        <p className="text-xl font-semibold mb-1.5">Is this your phone number?</p>
        <p className="text-xl">{formattedNumberArr}</p>
        <div className="flex flex-row gap-5 items-center mt-3.5">
          <button
            onClick={onYes}
            className="border rounded bg-green-300 p-1.5 w-40"
          >
            Yes!
          </button>
          <button
            onClick={onNo}
            className="border rounded bg-red-300 p-1.5 w-40"
          >
            No 😠
          </button>
        </div>
      </div>
    </div>
  );
};
