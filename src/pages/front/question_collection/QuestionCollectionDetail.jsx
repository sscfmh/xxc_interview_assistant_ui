import { Button, Pagination,Tag  } from "antd";
import clsx from "clsx";
import { useSearchParams } from "react-router";
import { create } from "zustand";

import React, { useEffect } from "react";

import { queryQuestionCollectionById } from "@/api/questionCollectionApi";
import { pageQueryQuestionQcRel } from "@/api/questionQcRelApi";
import useModel from "@/hooks/useModel";

const useThisStore = create((set, get) => ({
  qcDetail: {
    id: null,
    title: null,
    outline: null,
    userId: null,
    imgUrl: null,
    favCnt: 0,
    createSource: null,
    tags: null,
    updateTime: null,
  },
  fetchQcDetail: async (qcId) => {
    const { data } = await queryQuestionCollectionById(qcId);
    set({ qcDetail: data || {} });
  },

  qcQuestionPageReq: {
    page: 1,
    pageSize: 20,
  },
  setQuestionPageQueryReq: ({ page, pageSize }) => {
    set((state) => ({
      qcQuestionPageReq: {
        ...state.qcQuestionPageReq,
        page: pageSize === state.qcQuestionPageReq.pageSize ? page : 1,
        pageSize,
      },
    }));
  },
  qcQuestionPageResult: {
    total: 0,
    data: [],
  },
  fetchQcQuestionPage: async (qcId) => {
    const { data } = await pageQueryQuestionQcRel({
      ...get().qcQuestionPageReq,
      qcId,
    });
    set({
      qcQuestionPageResult: data || {
        total: 0,
        data: [],
      },
    });
  },
}));

const QcCard = () => {
  const qcDetail = useThisStore((state) => state.qcDetail);
  return (
    <div className="flex w-1/3 flex-col gap-2 rounded-2xl bg-white p-6 dark:bg-neutral-800">
      <img src={qcDetail.imgUrl} className="size-20 rounded-md" alt="404" />
      <h1 className="text-2xl font-bold">{qcDetail.title}</h1>
      <div className="flex gap-2">
        <Button shape="round">
          <i className="fa fa-star" />
        </Button>
        <Button shape="round">
          <i className="fa fa-share" />
        </Button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {qcDetail.outline}
      </p>
      <div className="text-sm">更新时间：{qcDetail.updateTime}</div>
    </div>
  );
};

const QuestionItem = ({
  alreadyAnswer,
  questionNo,
  name,
  accuracy,
  level,
  rowNo,
}) => {
  const { getTagInfo } = useModel("paramConfigModel");
  const { color, label } = getTagInfo("questionLevel", level);
  return (
    <div
      className={clsx(
        "flex w-full cursor-pointer gap-3 rounded-xl px-4 py-2 transition-colors",
        {
          "bg-gray-100 dark:bg-neutral-700": rowNo % 2 === 0,
          "bg-gray-50 dark:bg-neutral-600": rowNo % 2 !== 0,
        },
      )}
    >
      <div className="w-4">
        {alreadyAnswer ? (
          <i className="fa fa-check-circle text-green-500" />
        ) : (
          " "
        )}
      </div>
      <div className="flex-1 font-medium">{questionNo + ". " + name}</div>
      <div className="w-8 font-normal">{accuracy}%</div>
      <div className="w-8 font-normal">
        <Tag color={color}>{label}</Tag>
      </div>
    </div>
  );
};

const QuestionListCard = () => {
  const [searchParams] = useSearchParams();
  const qcId = searchParams.get("qcId");
  const qcQuestionPageReq = useThisStore((state) => state.qcQuestionPageReq);
  const setQuestionPageQueryReq = useThisStore(
    (state) => state.setQuestionPageQueryReq,
  );
  const qcQuestionPageRes = useThisStore((state) => state.qcQuestionPageResult);
  const fetchQcQuestionPage = useThisStore(
    (state) => state.fetchQcQuestionPage,
  );

  useEffect(() => {
    if (qcId) {
      fetchQcQuestionPage(qcId);
    }
  }, [qcId, fetchQcQuestionPage]);

  return (
    <div className="flex w-2/3 flex-col gap-2 bg-white p-6 dark:bg-neutral-800">
      {qcQuestionPageRes.data?.map((item, idx) => {
        return (
          <QuestionItem
            key={item.id}
            alreadyAnswer={item.alreadyAnswer}
            questionNo={item.id}
            name={item.title}
            accuracy={idx}
            level={item.questionLevel}
            rowNo={idx}
          />
        );
      })}
      <div></div>
      <Pagination
        showQuickJumper
        showSizeChanger
        defaultCurrent={qcQuestionPageReq.page}
        defaultPageSize={qcQuestionPageReq.pageSize}
        total={qcQuestionPageRes.total}
        onChange={(page, pageSize) => {
          if (!qcId) {
            return;
          }
          setQuestionPageQueryReq({
            page,
            pageSize,
          });
          fetchQcQuestionPage(qcId);
        }}
      />
    </div>
  );
};

export default function QuestionCollectionDetail() {
  const [searchParams] = useSearchParams();
  const fetchQcDetail = useThisStore((state) => state.fetchQcDetail);
  React.useEffect(() => {
    if (searchParams.get("qcId")) {
      fetchQcDetail(searchParams.get("qcId"));
    }
  }, [searchParams, fetchQcDetail]);
  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="xl:1/2 flex w-full items-start gap-6 py-8 md:w-3/4">
        <QcCard />
        <QuestionListCard />
      </div>
    </div>
  );
}
