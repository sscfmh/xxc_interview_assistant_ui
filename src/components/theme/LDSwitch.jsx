import clsx from "clsx";

import React from "react";

export default function LDSwitch({ toggleTheme, isDark }) {
  return (
    <div
      onClick={() => {
        toggleTheme();
      }}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {/* light/dark */}
      <i
        className={clsx("fa", {
          "fa-moon-o": isDark,
          "fa-sun-o": !isDark,
        })}
      />
    </div>
  );
}
