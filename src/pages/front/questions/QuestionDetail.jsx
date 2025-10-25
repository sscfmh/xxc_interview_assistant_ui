import { Button, Collapse, Pagination, Tag } from "antd";
import { useSearchParams } from "react-router";
import { create } from "zustand";

import React, { useEffect, useState } from "react";

import SimpleCommentItem from "@/components/comment/SimpleCommentItem";
import Editor from "@/components/md/Editor";
import Viewer from "@/components/md/Viewer";

import {
  queryUserCommitAnswer,
  userCommitQuestionAnswer,
} from "@/api/answerApi";
import { queryQuestionById } from "@/api/questionApi";
import {
  createQuestionComment,
  pageQueryQuestionComment,
} from "@/api/questionCommentApi";
import useModel from "@/hooks/useModel";

const useThisStore = create((set, get) => ({
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
  setAnswer: (answer = {}) => {
    set({
      answer,
    });
  },

  pageQueryCommentReq: {
    page: 1,
    pageSize: 5,
    questionId: null,
    needUserInfo: true,
  },
  pageQueryCommentRes: {
    total: 0,
    data: [],
  },
  fetchComment: () => {
    const { pageQueryCommentReq, questionDetail } = get();
    if (!questionDetail?.id) {
      return;
    }
    pageQueryQuestionComment({
      ...pageQueryCommentReq,
      questionId: questionDetail?.id,
    }).then((res) => {
      if (res.success) {
        set({
          pageQueryCommentRes: res.data || {},
        });
      }
    });
  },
}));

const AddComment = () => {
  const [comment, setComment] = useState("");
  const { userLoginInfo } = useModel("userInfoModel");
  const questionDetail = useThisStore((state) => state.questionDetail);
  const fetchComment = useThisStore((state) => state.fetchComment);
  const handleSubmit = () => {
    if (!comment.trim() || !questionDetail?.id) {
      return;
    }
    createQuestionComment({
      questionId: questionDetail.id,
      content: comment.trim(),
      userId: userLoginInfo.userId,
    }).then((res) => {
      if (res.success) {
        setComment("");
        fetchComment();
      }
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Editor value={comment} onChange={setComment}></Editor>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} type="primary">
          Submit
        </Button>
      </div>
    </div>
  );
};

const QuestionCommentList = () => {
  const pageQueryCommentReq = useThisStore(
    (state) => state.pageQueryCommentReq,
  );
  const pageQueryCommentRes = useThisStore(
    (state) => state.pageQueryCommentRes,
  );
  const fetchComment = useThisStore((state) => state.fetchComment);
  useEffect(() => {
    fetchComment();
  }, [fetchComment, pageQueryCommentReq]);
  return (
    <>
      {pageQueryCommentRes.data?.map((item) => {
        return (
          <SimpleCommentItem
            key={item.id}
            avatar={item.avatar}
            nickName={item.nickName}
            time={item.createTime}
            content={item.content}
            heartCnt={item.heartCnt}
            handleClickHeart={() => {}}
          />
        );
      })}
      <Pagination
        showQuickJumper
        showSizeChanger
        defaultCurrent={pageQueryCommentReq.page}
        defaultPageSize={pageQueryCommentReq.pageSize}
        total={pageQueryCommentRes.total}
        onChange={(page, pageSize) => {
          useThisStore.setState((prev) => ({
            pageQueryCommentReq: {
              ...prev.pageQueryCommentReq,
              page: pageSize === prev.pageQueryCommentReq.pageSize ? page : 1,
              pageSize,
            },
          }));
        }}
      />
    </>
  );
};

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
                {
                  key: "questionComment",
                  label: "题目评论",
                  children: (
                    <>
                      <AddComment />
                      <QuestionCommentList />
                    </>
                  ),
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
    <div className="max-h-[calc(100vh-132px)] w-1/2 overflow-y-auto py-2">
      <Editor value={answer.content || ""} onChange={setAnswerContent} />
    </div>
  );
};

const AnswerViewer = () => {
  const answer = useThisStore((state) => state.answer);
  return (
    <div className="max-h-[calc(100vh-132px)] w-1/2 overflow-y-auto py-2">
      <Viewer value={answer.content || ""} className="h-full" />
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

  const answer = useThisStore((state) => state.answer);
  const setAnswer = useThisStore((state) => state.setAnswer);
  useEffect(() => {
    queryUserCommitAnswer({
      questionId,
    }).then((res) => {
      if (res.success && res.data) {
        setAnswer(res.data);
      }
    });
  }, [questionId, setAnswer]);

  return (
    <div className="flex min-h-[calc(100vh-128px)] w-full gap-2 px-2 py-1">
      <QuestionPreview />
      <div className="flex h-[calc(100vh-138px)] flex-1 flex-col">
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              userCommitQuestionAnswer({
                questionId,
                content: answer.content,
              });
            }}
          >
            提交答案
          </Button>
        </div>
        <div className="flex flex-1 gap-2">
          <AnswerEditor />
          <AnswerViewer />
        </div>
      </div>
    </div>
  );
}
