import clsx from "clsx";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

import React from "react";

import "./md.css";

export default function Viewer({ value, className }) {
  return (
    <div
      className={clsx(
        "markdown-body overflow-auto rounded-lg border border-gray-200 bg-white transition-all px-2 dark:border-gray-700 dark:bg-neutral-800",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
    ></div>
  );
}
