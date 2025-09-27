import React from "react";

export default function Brand({
  Icon = <i className="fa fa-pencil-square-o mr-2"></i>,
  brandName,
}) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <h1 className="flex items-center text-xl font-bold text-primary">
        {Icon}
        <span>{brandName}</span>
      </h1>
    </div>
  );
}
