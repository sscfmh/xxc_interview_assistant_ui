import {
  Button,
  Form,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useSearchParams } from "react-router";

import React, { createContext, useContext, useEffect, useState } from "react";

import Transfer from "@/components/transfer/Transfer";

import {
  queryQuestionCollectionById,
  updateQuestionCollectionById,
} from "@/api/questionCollectionApi";
import { pageQueryQuestionQcRel } from "@/api/questionQcRelApi";
import {pageQueryQuestion} from "@/api/questionApi";
import { listQueryTagByIds } from "@/api/tagApi";
import useModel from "@/hooks/useModel";
import { parseFormMeta } from "@/utils/formUtils";

const ThisCtx = createContext();
const useThisCtx = () => useContext(ThisCtx);

export default function EditQc() {
  const [searchParams] = useSearchParams();
  const qcId = searchParams.get("qcId");
  const [qcEditForm] = Form.useForm();
  const [deleteQcRelData, setDeleteQcRelData] = useState([]);
  const [addQuestionData, setAddQuestionData] = useState([]);

  const [allTags, setAllTags] = useState([]);
  useEffect(() => {
    listQueryTagByIds().then((res) => {
      if (res.success) {
        setAllTags(res.data);
      }
    });
  }, []);

  return (
    <ThisCtx.Provider
      value={{
        qcId,
        qcEditForm,
        allTags,
        deleteQcRelData,
        setDeleteQcRelData,
        addQuestionData,
        setAddQuestionData,
      }}
    >
      <Form
        form={qcEditForm}
        name="qcEditForm"
        onFinish={(formValues) => {
          const data = {
            ...formValues,
            tags: formValues.tags ? formValues.tags.join(",") : null,
            deleteQuestionIds: deleteQcRelData.map((item) => item.questionId),
            addQuestionIds: addQuestionData?.map((item) => item.id),
          };
          updateQuestionCollectionById(data).then((res) => {
            if (res.success) {
              window.location.reload();
            }
          });
        }}
        layout="horizontal"
        labelCol={{ span: 2 }}
      >
        <EditMetaField />
        <br />
        <DeleteTransfer />
        <br />
        <AddTransfer />

        <div className="flex justify-end gap-2">
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => {}}>取消</Button>
        </div>
      </Form>
    </ThisCtx.Provider>
  );
}

const qcFieldMeta = [
  {
    key: "id",
    name: "id",
    label: "主键ID",
    type: "input",
    placeholder: "主键ID...",
  },
  {
    key: "title",
    name: "title",
    label: "标题",
    type: "input",
    placeholder: "标题...",
  },
  {
    key: "outline",
    name: "outline",
    label: "摘要",
    type: "input",
    placeholder: "摘要...",
  },
  {
    key: "userId",
    name: "userId",
    label: "用户ID",
    type: "input",
    placeholder: "用户ID...",
  },
  {
    key: "imgUrl",
    name: "imgUrl",
    label: "封面图片",
    type: "input",
    placeholder: "封面图片...",
  },
  {
    key: "favCnt",
    name: "favCnt",
    label: "收藏量",
    type: "inputNumber",
    min: 0,
    placeholder: "收藏量...",
  },
  {
    key: "createSource",
    name: "createSource",
    label: "创建来源",
    type: "select",
    paramType: "createSource",
    placeholder: "创建来源...",
  },
  {
    key: "tags",
    name: "tags",
    label: "标签",
    type: "selectMultiple",
    placeholder: "标签...",
  },
  {
    key: "extendInfo",
    name: "extendInfo",
    label: "扩展信息",
    type: "textArea",
    placeholder: "扩展信息...",
  },
];

const EditMetaField = () => {
  const { qcId, qcEditForm, allTags } = useThisCtx();
  const { paramConfigForSelect } = useModel("paramConfigModel");

  useEffect(() => {
    if (!qcId) {
      return;
    }
    queryQuestionCollectionById(qcId).then((res) => {
      if (res.success) {
        qcEditForm.setFieldsValue({
          ...res.data,
          tags: res.data.tags ? res.data.tags.split(",") : null,
        });
      }
    });
  }, [qcId, qcEditForm]);
  return (
    <>
      <div className="text-xl text-primary">基本信息</div>
      <br />
      {qcFieldMeta.map((item) => {
        if (item.type === "selectMultiple") {
          return (
            <div key={item.key}>
              <Form.Item name={item.name} label={item.label}>
                <Select
                  size="large"
                  mode="multiple"
                  placeholder={item.placeholder}
                  options={allTags.map((item) => ({
                    value: item.id,
                    label: item.tagName,
                  }))}
                />
              </Form.Item>
            </div>
          );
        }
        return (
          <div key={item.key}>{parseFormMeta(item, paramConfigForSelect)}</div>
        );
      })}
    </>
  );
};

const columns = [
  {
    key: "id",
    dataIndex: "id",
    title: "主键ID",
  },
  {
    key: "questionId",
    dataIndex: "questionId",
    title: "题目ID",
  },
  {
    key: "title",
    dataIndex: "title",
    title: "标题",
  },
  {
    key: "content",
    dataIndex: "content",
    title: "内容",
  },
  {
    key: "qcId",
    dataIndex: "qcId",
    title: "题集ID",
  },
  {
    key: "extendInfo",
    dataIndex: "extendInfo",
    title: "扩展信息",
  },
  {
    key: "createBy",
    dataIndex: "createBy",
    title: "创建人",
  },
  {
    key: "createTime",
    dataIndex: "createTime",
    title: "创建时间",
  },
  {
    key: "updateBy",
    dataIndex: "updateBy",
    title: "修改人",
  },
  {
    key: "updateTime",
    dataIndex: "updateTime",
    title: "修改时间",
  },
];

const DeleteTransfer = () => {
  const { qcId, deleteQcRelData, setDeleteQcRelData } = useThisCtx();
  const [questionQcRelPageReq, setQuestionQcRelPageReq] = useState({
    page: 1,
    pageSize: 20,
    qcId: qcId ? qcId : "0",
  });
  const [questionQcRelPageRes, setQuestionQcRelPageRes] = useState({
    total: 0,
    data: [],
  });
  useEffect(() => {
    pageQueryQuestionQcRel(questionQcRelPageReq).then((res) => {
      if (res.success) {
        setQuestionQcRelPageRes({
          ...res.data,
        });
      }
    });
  }, [questionQcRelPageReq]);
  return (
    <>
      <div className="text-xl text-primary">删除题目</div>
      <br />
      <Transfer
        columns={columns}
        rowKey="id"
        left={{
          pageQueryReq: questionQcRelPageReq,
          setPageQueryReq: setQuestionQcRelPageReq,
          pageQueryRes: questionQcRelPageRes,
        }}
        right={{
          transData: deleteQcRelData,
          setTransData: setDeleteQcRelData,
        }}
      />
    </>
  );
};

const questionColumns = [
  {
    key: "id",
    dataIndex: "id",
    title: "主键ID",
  },
  {
    key: "title",
    dataIndex: "title",
    title: "标题",
  },
  {
    key: "content",
    dataIndex: "content",
    title: "内容",
  },
  {
    key: "refAnswer",
    dataIndex: "refAnswer",
    title: "参考答案",
  },
];
const AddTransfer = () => {
  const { addQuestionData, setAddQuestionData } = useThisCtx();
  const [questionPageReq, setQuestionPageReq] = useState({
    page: 1,
    pageSize: 20,
  });
  const [questionPageRes, setQuestionPageRes] = useState({
    total: 0,
    data: [],
  });
  useEffect(() => {
    pageQueryQuestion(questionPageReq).then((res) => {
      if (res.success) {
        setQuestionPageRes({
          ...res.data,
        });
      }
    });
  }, [questionPageReq]);
  return (
    <>
      <div className="text-xl text-primary">新增题目</div>
      <br />
      <Transfer
        columns={questionColumns}
        rowKey="id"
        left={{
          pageQueryReq: questionPageReq,
          setPageQueryReq: setQuestionPageReq,
          pageQueryRes: questionPageRes,
        }}
        right={{
          transData: addQuestionData,
          setTransData: setAddQuestionData,
        }}
      />
    </>
  );
};
