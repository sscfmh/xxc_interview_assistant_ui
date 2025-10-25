import React, { useState } from "react";

import Viewer from "@/components/md/Viewer";

export default function SimpleCommentItem({
  avatar,
  nickName,
  time,
  content,
  heartCnt,
  handleClickHeart,
}) {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-2">
          <img className="size-8 rounded-full" src={avatar} alt="404" />
          <p className="font-light">{nickName}</p>
          <p className="text-sm font-extralight">{time}</p>
        </div>
        <div>
          <Viewer value={content} />
        </div>
        <div className="flex justify-end">
          <div
            onClick={() => {
              handleClickHeart && handleClickHeart();
            }}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <i className="fa fa-heart"></i>
            <span>{heartCnt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
