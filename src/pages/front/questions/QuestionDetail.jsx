import { Collapse, Tag } from "antd";
import { useSearchParams } from "react-router";
import { create } from "zustand";

import React, { useEffect } from "react";

import Editor from "@/components/md/Editor";
import Viewer from "@/components/md/Viewer";

import { queryQuestionById } from "@/api/questionApi";
import useModel from "@/hooks/useModel";

const useThisStore = create((set) => ({
  questionDetail: {},
  fetchQuestionDetail: (questionId) => {
    queryQuestionById(questionId).then((res) => {
      if (res.success) {
        set({ questionDetail: res.data });
      }
    });
  },

  answer: {
    content: "",
  },
  setAnswerContent: (content) => {
    set((state) => ({
      answer: {
        ...state.answer,
        content,
      },
    }));
  },
}));

const QuestionPreview = () => {
  const questionDetail = useThisStore((state) => state.questionDetail);
  const { getTagInfo } = useModel("paramConfigModel");
  const { color: lvlColor, label: lvlLabel } = getTagInfo(
    "questionLevel",
    questionDetail.questionLevel,
  );
  const { allTag } = useModel("tagInfoModel");
  return (
    <>
      <div className="w-1/3">
        <div className="flex max-h-[calc(100vh-140px)] w-full flex-col gap-2 overflow-y-auto rounded-md bg-white px-6 py-4 dark:bg-neutral-800">
          <h1 className="text-2xl font-bold">
            {questionDetail.questionNo}.{questionDetail.title}
          </h1>
          <div className="flex gap-2">
            <Tag color={lvlColor}>{lvlLabel}</Tag>
          </div>
          <div>
            <Viewer value={questionDetail.content || ""} />
          </div>
          <div>
            <Collapse
              items={[
                {
                  key: "questionTags",
                  label: "标签",
                  children: (
                    <>
                      {questionDetail?.tags?.split(",").map((tagId) => {
                        const tagInfo = allTag.find((x) => x.id === tagId);
                        return (
                          <Tag key={tagId} color={tagInfo?.color}>
                            {tagInfo?.tagName || tagId}
                          </Tag>
                        );
                      })}
                    </>
                  ),
                },
                {
                  key: "hint",
                  label: "提示",
                  children: <p>{questionDetail.hint}</p>,
                },
                {
                  key: "refAnswer",
                  label: "参考答案",
                  children: <Viewer value={questionDetail.refAnswer || ""} />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const AnswerEditor = () => {
  const setAnswerContent = useThisStore((state) => state.setAnswerContent);
  const answer = useThisStore((state) => state.answer);
  return (
    <div className="max-h-[calc(100vh-132px)] w-1/3 overflow-y-auto py-2">
      <Editor value={answer.content} onChange={setAnswerContent} />
    </div>
  );
};

const AnswerViewer = () => {
  const answer = useThisStore((state) => state.answer);
  return (
    <div className="max-h-[calc(100vh-132px)] w-1/3 overflow-y-auto py-2">
      <Viewer value={answer.content} className="h-full" />
    </div>
  );
};

export default function QuestionDetail() {
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId");
  const fetchQuestionDetail = useThisStore(
    (state) => state.fetchQuestionDetail,
  );
  useEffect(() => {
    if (questionId) {
      fetchQuestionDetail(questionId);
    }
  }, [questionId, fetchQuestionDetail]);
  return (
    <div className="flex min-h-[calc(100vh-132px)] w-full gap-2 px-2 py-1">
      <QuestionPreview />
      <AnswerEditor />
      <AnswerViewer />
    </div>
  );
}
