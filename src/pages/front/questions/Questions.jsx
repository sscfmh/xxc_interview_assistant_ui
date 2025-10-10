import { Pagination, Tag } from "antd";
import clsx from "clsx";

import React, { createContext, useContext, useEffect, useState } from "react";

import { pageQueryQuestion } from "@/api/questionApi";
import { listQueryTagByIds } from "@/api/tagApi";
import useModel from "@/hooks/useModel";

const ThisCtx = createContext({});
const useThisCtx = () => useContext(ThisCtx);

const QuestionTag = ({ tagName, count, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "inline-flex cursor-pointer items-center gap-1 text-sm hover:text-primary",
        {
          "text-primary": isActive,
        },
      )}
    >
      <span>{tagName}</span>
      <span className="rounded-xl bg-gray-200 px-2 py-0.5 font-extralight dark:bg-gray-600">
        {count}
      </span>
    </div>
  );
};

// const QuestionCategory = ({ categaryId, categoryName, iconClassName }) => {
//   const { questionPageQueryReq, setQuestionPageQueryReq } = useThisCtx();
//   return (
//     <div
//       onClick={() => {
//         if (questionPageQueryReq.categaryId === categaryId) {
//           return;
//         }
//         setQuestionPageQueryReq((prev) => ({
//           ...prev,
//           categaryId,
//         }));
//       }}
//       className={clsx(
//         "inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 transition-colors hover:bg-primary/70",
//         {
//           "bg-primary text-gray-200":
//             categaryId === questionPageQueryReq.categaryId,
//         },
//       )}
//     >
//       <i
//         className={iconClassName}
//         style={{
//           fontSize: "1.5rem",
//         }}
//       />
//       <span>{categoryName}</span>
//     </div>
//   );
// };

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

const TagCard = () => {
  const [allTags, setAllTags] = useState([]);
  useEffect(() => {
    listQueryTagByIds().then((res) => {
      if (res.success) {
        setAllTags(res.data);
      }
    });
  }, []);
  const { questionPageQueryReq, setQuestionPageQueryReq } = useThisCtx();
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 bg-white p-4 dark:bg-neutral-800">
      {allTags.map((item, idx) => {
        return (
          <QuestionTag
            key={item.id}
            tagName={item.tagName}
            count={idx}
            isActive={questionPageQueryReq.tagIds?.includes(item.id)}
            onClick={() => {
              setQuestionPageQueryReq((prev) => {
                const tagIds = [...prev.tagIds];
                if (tagIds.includes(item.id)) {
                  return {
                    ...prev,
                    tagIds: tagIds.filter((tag) => tag !== item.id),
                  };
                }
                return {
                  ...prev,
                  tagIds: [...tagIds, item.id],
                };
              });
            }}
          />
        );
      })}
    </div>
  );
};

const QuestuinCard = () => {
  const {
    questionPageQueryReq,
    setQuestionPageQueryReq,
    questionPageQueryRes,
  } = useThisCtx();
  return (
    <div className="flex flex-col gap-2 bg-white p-4 dark:bg-neutral-800">
      {questionPageQueryRes.data?.map((item, idx) => {
        return (
          <QuestionItem
            key={item.id}
            alreadyAnswer={item.alreadyAnswer}
            questionNo={item.id}
            name={item.title}
            accuracy={idx}
            level={item.questionLevel}
            rowNo={item.questionNo}
          />
        );
      })}
      <div></div>
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

export default function Questions() {
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
    <ThisCtx.Provider
      value={{
        questionPageQueryReq,
        setQuestionPageQueryReq,
        questionPageQueryRes,
      }}
    >
      <div className="my-2 flex min-h-screen flex-col items-center gap-4">
        <div className="flex flex-col gap-2 md:w-2/3">
          <TagCard />
          {/* <div className="flex flex-wrap gap-4 bg-white p-4 dark:bg-neutral-800">
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
          </div> */}
          <QuestuinCard />
        </div>
      </div>
    </ThisCtx.Provider>
  );
}
