import React from "react";

export default function Editor({ value, onChange, placeholder }) {
  return (
    <div className="h-full">
      <textarea
        className="h-full w-full rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all focus:ring-1 focus:ring-primary/50 focus:outline-none dark:border-gray-700 dark:bg-neutral-800"
        value={value || ""}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        placeholder={placeholder || "Please enter your content..."}
      ></textarea>
    </div>
  );
}
