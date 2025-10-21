import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

import React from "react";

import "./md.css";

export default function Viewer({ value }) {
  return (
    <div
      className="markdown-body overflow-auto"
      dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
    ></div>
  );
}
