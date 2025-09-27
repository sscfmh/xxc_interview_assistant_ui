import { Pagination, Tabs } from "antd";

import React, { useEffect, useState } from "react";

import randomImgUtils from "@/utils/randomImgUtils";

const _tabItems = [
  {
    key: "1",
    label: "NodeJS",
  },
  {
    key: "2",
    label: "Java",
  },
  {
    key: "3",
    label: "Rust",
  },
];

const QcCard = ({ title, imgUrl, desc }) => {
  return (
    <div className="flex cursor-pointer items-center rounded-xl bg-white p-4 transition-all hover:scale-105 dark:bg-gray-800">
      <div className="w-1/4">
        <img className="size-16 rounded-xl" src={imgUrl} alt="404" />
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <h2 className="text-xl font-medium">{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default function QuestionCollectionList() {
  const [tabItems, setTabItems] = useState([..._tabItems]);
  useEffect(() => {
    setTabItems([..._tabItems]);
  }, []);
  const [qcPageQueryReq, setQcPageQueryReq] = useState({
    tagId: "",
    page: 1,
    pageSize: 20,
  });
  const [qcPageQueryRes, setQcPageQueryRes] = useState({
    total: 0,
    data: [],
  });
  useEffect(() => {
    setQcPageQueryRes({
      total: 100,
      data: new Array(17).fill(null).map((_, idx) => {
        return {
          id: idx,
          title: "NodeJS面试合集",
          desc: "NodeJS面试合集",
          imgUrl: randomImgUtils.randomImgUrl(),
        };
      }),
    });
  }, [qcPageQueryReq]);
  return (
    <div className="flex min-h-screen flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Question Collection</h1>
      <Tabs items={tabItems} size="large" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {qcPageQueryRes.data?.map((item) => {
          return (
            <QcCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              imgUrl={item.imgUrl}
            />
          );
        })}
      </div>
      <Pagination
        showQuickJumper
        showSizeChanger
        defaultCurrent={qcPageQueryReq.page}
        defaultPageSize={qcPageQueryReq.pageSize}
        total={qcPageQueryRes.total}
        onChange={(page, pageSize) => {
          setQcPageQueryReq((prev) => ({
            ...prev,
            page,
            pageSize,
          }));
        }}
      />
    </div>
  );
}
