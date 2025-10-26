import { Carousel, Pagination, Tag } from "antd";
import clsx from "clsx";

import React, { useEffect, useState } from "react";

import SignInCalendar from "@/components/calendar/SignInCalendar";

import { pageQueryQuestion } from "@/api/questionApi";
import useModel from "@/hooks/useModel";

const BannerCarousel = () => {
  const { paramConfig } = useModel("paramConfigModel");
  const banners = paramConfig.homeBanners || [];
  return (
    <div className="rounded-md bg-white px-10 py-6 dark:bg-neutral-800">
      <Carousel>
        {banners?.map((item) => {
          return (
            <div key={item.configKey}>
              <img src={item.configValue} alt="404" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

const QuestionItem = ({
  questionId,
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
      onClick={() => {
        window.open(
          `/front/question/detail?questionId=${questionId}`,
          "_blank",
        );
      }}
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
  const [questionPageQueryReq, setQuestionPageQueryReq] = useState({
    page: 1,
    pageSize: 20,
    tagIds: [],
    tagIdsOpType: "AND",
    needAlreadyAnswerFlag: true,
  });
  const [questionPageQueryRes, setQuestionPageQueryRes] = useState({
    total: 0,
    data: [],
  });
  useEffect(() => {
    pageQueryQuestion(questionPageQueryReq).then((res) => {
      if (res.success) {
        setQuestionPageQueryRes({
          ...res.data,
        });
      }
    });
  }, [questionPageQueryReq]);
  return (
    <div className="flex flex-col gap-4 rounded-md bg-white px-10 py-6 dark:bg-neutral-800">
      <div className="text-2xl font-bold">热门题目</div>
      <div className="flex w-full flex-col gap-2">
        {questionPageQueryRes.data?.map((item, idx) => {
          return (
            <QuestionItem
              key={item.id}
              questionId={item.id}
              alreadyAnswer={item.alreadyAnswer}
              questionNo={item.id}
              name={item.title}
              accuracy={idx}
              level={item.questionLevel}
              rowNo={item.questionNo}
            />
          );
        })}
      </div>
      <Pagination
        showQuickJumper
        showSizeChanger
        defaultCurrent={questionPageQueryReq.page}
        defaultPageSize={questionPageQueryReq.pageSize}
        total={questionPageQueryRes.total}
        onChange={(page, pageSize) => {
          setQuestionPageQueryReq((prev) => ({
            ...prev,
            page: pageSize !== prev.pageSize ? 1 : page,
            pageSize,
          }));
        }}
      />
    </div>
  );
};

const SignInCalendarCard = () => {
  return (
    <div className="w-full self-start rounded-md bg-white p-4 dark:bg-neutral-800">
      <div className="mb-4 flex items-center justify-start text-2xl font-bold">
        打卡记录
      </div>
      <SignInCalendar />
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full gap-4 md:w-3/4 xl:w-2/3">
        <div className="flex w-full flex-col gap-2 md:w-3/4">
          <BannerCarousel />
          <QuestionListCard />
        </div>
        <div className="hidden flex-1 md:flex">
          <SignInCalendarCard />
        </div>
      </div>
    </div>
  );
}
