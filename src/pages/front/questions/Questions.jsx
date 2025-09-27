import { Pagination } from "antd";
import clsx from "clsx";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThisCtx = createContext({});
const useThisCtx = () => useContext(ThisCtx);

const QuestionTag = ({ tagName, count }) => {
  return (
    <div className="inline-flex cursor-pointer items-center gap-1 text-sm hover:text-primary">
      <span>{tagName}</span>
      <span className="rounded-xl bg-gray-200 px-2 py-0.5 font-extralight dark:bg-gray-600">
        {count}
      </span>
    </div>
  );
};

const QuestionCategory = ({ categaryId, categoryName, iconClassName }) => {
  const { questionPageQueryReq, setQuestionPageQueryReq } = useThisCtx();
  return (
    <div
      onClick={() => {
        if (questionPageQueryReq.categaryId === categaryId) {
          return;
        }
        setQuestionPageQueryReq((prev) => ({
          ...prev,
          categaryId,
        }));
      }}
      className={clsx(
        "inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 transition-colors hover:bg-primary/70",
        {
          "bg-primary text-gray-200":
            categaryId === questionPageQueryReq.categaryId,
        },
      )}
    >
      <i
        className={iconClassName}
        style={{
          fontSize: "1.5rem",
        }}
      />
      <span>{categoryName}</span>
    </div>
  );
};

const QuestionItem = ({
  isAnswer,
  questionNo,
  name,
  accuracy,
  level,
  rowNo,
}) => {
  return (
    <div
      className={clsx(
        "flex w-full cursor-pointer gap-3 rounded-xl px-4 py-2 transition-colors",
        {
          "bg-gray-100 dark:bg-gray-700": rowNo % 2 === 0,
          "bg-gray-50 dark:bg-gray-600": rowNo % 2 !== 0,
        },
      )}
    >
      <div className="w-4">
        {isAnswer ? <i className="fa fa-check-circle text-green-500" /> : " "}
      </div>
      <div className="flex-1 font-medium">{questionNo + ". " + name}</div>
      <div className="w-8 font-normal">{accuracy}%</div>
      <div className="w-8 font-normal">{level}</div>
    </div>
  );
};

export default function Questions() {
  const [questionPageQueryReq, setQuestionPageQueryReq] = useState({
    page: 1,
    pageSize: 20,
    categaryId: null,
  });
  const [questionPageQueryRes, setQuestionPageQueryRes] = useState({
    total: 0,
    data: [],
  });
  useEffect(() => {
    setQuestionPageQueryRes({
      total: 0,
      data: [],
    });
  }, [questionPageQueryReq]);
  return (
    <ThisCtx.Provider
      value={{
        questionPageQueryReq,
        setQuestionPageQueryReq,
      }}
    >
      <div className="flex min-h-screen flex-col items-center gap-4 my-2">
        <div className="flex flex-col gap-2 md:w-2/3">
          <div className="flex flex-wrap gap-x-8 gap-y-4 bg-white p-4 dark:bg-gray-800">
            {new Array(30).fill(null).map((_, idx) => {
              return (
                <QuestionTag
                  key={idx}
                  tagName={idx}
                  count={idx + Math.floor(Math.random() * 100)}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 bg-white p-4 dark:bg-gray-800">
            {new Array(6).fill(null).map((_, idx) => {
              return (
                <QuestionCategory
                  key={idx}
                  categaryId={idx}
                  categoryName={idx}
                  iconClassName={
                    Math.random() < 0.5 ? "fa fa-code" : "fa fa-sun-o"
                  }
                />
              );
            })}
          </div>
          <div className="flex flex-col gap-2 bg-white p-4 dark:bg-gray-800">
            {new Array(30).fill(null).map((_, idx) => {
              return (
                <QuestionItem
                  key={idx}
                  isAnswer={idx % 2 === 0}
                  questionNo={idx}
                  name={idx}
                  accuracy={idx}
                  level={"困难"}
                  rowNo={idx}
                />
              );
            })}
            <div>

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
                  page,
                  pageSize,
                }));
              }}
            />
          </div>
        </div>
      </div>
    </ThisCtx.Provider>
  );
}
