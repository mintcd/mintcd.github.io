import React from "react";

const Checkbox = () => {
  return (
    <label
      htmlFor="hr"
      className="flex flex-row items-center gap-2.5 dark:text-white light:text-black"
    >
      <input id="hr" type="checkbox" className="peer hidden" />
      <div
        className="h-5 w-5 flex rounded-md border border-[#a2a1a833] light:bg-[#e8e8e8] dark:bg-[#212121] peer-checked:bg-[#7152f3] transition"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-5 h-5 light:stroke-[#e8e8e8] dark:stroke-[#212121]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12.6111L8.92308 17.5L20 6.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
};

export default Checkbox;
