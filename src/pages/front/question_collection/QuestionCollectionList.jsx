import { Pagination, Tabs } from "antd";
import { useNavigate } from "react-router";

import React, { useEffect, useState } from "react";

import { pageQueryQuestionCollection } from "@/api/questionCollectionApi";
import { listQueryTagByIds } from "@/api/tagApi";

const QcCard = ({ title, imgUrl, desc, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center rounded-xl bg-white p-4 transition-all hover:scale-105 dark:bg-neutral-800"
    >
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
  const navigate = useNavigate();
  const [allTags, setAllTags] = useState([]);
  useEffect(() => {
    listQueryTagByIds().then((res) => {
      if (res.success) {
        setAllTags(res.data);
      }
    });
  }, []);
  const [qcPageQueryReq, setQcPageQueryReq] = useState({
    tagIds: [],
    tagIdsOpType: "AND",
    page: 1,
    pageSize: 20,
  });
  const [qcPageQueryRes, setQcPageQueryRes] = useState({
    total: 0,
    data: [],
  });
  useEffect(() => {
    pageQueryQuestionCollection(qcPageQueryReq).then((res) => {
      if (res.success) {
        setQcPageQueryRes({
          ...res.data,
        });
      }
    });
  }, [qcPageQueryReq]);
  return (
    <div className="flex min-h-screen flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Question Collection</h1>
      <Tabs
        items={[
          {
            key: "__ALL",
            label: "ALL",
          },
          ...allTags.map((item) => {
            return {
              label: item.tagName,
              key: item.id,
            };
          }),
        ]}
        size="large"
        onChange={(key) => {
          if (key === "__ALL") {
            setQcPageQueryReq((prev) => ({
              ...prev,
              tagIds: [],
            }));
          } else {
            setQcPageQueryReq((prev) => ({
              ...prev,
              tagIds: [key],
            }));
          }
        }}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {qcPageQueryRes.data?.map((item) => {
          return (
            <QcCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              imgUrl={item.imgUrl}
              onClick={() => {
                navigate(`/front/question-collection/detail?qcId=${item.id}`);
              }}
            />
          );
        })}
      </div>
      <Pagination
        align="center"
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
