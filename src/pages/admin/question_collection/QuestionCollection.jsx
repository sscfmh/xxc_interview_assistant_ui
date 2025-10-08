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
import dayjs from "dayjs";
import { useNavigate } from "react-router";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createQuestionCollection,
  deleteQuestionCollectionById,
  pageQueryQuestionCollection,
  updateQuestionCollectionById,
} from "@/api/questionCollectionApi";
import { listQueryTagByIds } from "@/api/tagApi";
import useModel from "@/hooks/useModel";
import { parseFormMeta } from "@/utils/formUtils";
import { buildPageReqVo } from "@/utils/searchFormUtils";

const ThisCtx = createContext({});
const useThisCtx = () => useContext(ThisCtx);

export default function QuestionCollection() {
  const [pageQueryReq, setPageQueryReq] = useState({
    page: 1,
    pageSize: 10,
    // 主键ID
    id: null,
    // 标题
    title: null,
    // 摘要
    outline: null,
    // 用户ID
    userId: null,
    // 封面图片
    imgUrl: null,
    // 收藏量
    favCnt: null,
    // 创建来源
    createSource: null,
    // 标签
    tags: null,
    // 扩展信息
    extendInfo: null,
    // 创建人
    createBy: null,
    // 创建时间
    createTime: null,
    // 修改人
    updateBy: null,
    // 修改时间
    updateTime: null,
  });
  const [shouldQuery, setShouldQuery] = useState(true);
  const [pageQueryResult, setPageQueryResult] = useState({
    total: 0,
    data: [],
  });
  const handlePageQuery = useCallback(async () => {
    try {
      await pageQueryQuestionCollection(pageQueryReq).then((res) => {
        if (res.success) {
          setPageQueryResult({
            total: res.data.total,
            data: res.data.data?.map((item) => {
              return {
                ...item,
                tags: item.tags ? item.tags.split(",") : null,
              };
            }),
          });
        }
      });
    } finally {
      setShouldQuery(false);
    }
  }, [pageQueryReq]);
  useEffect(() => {
    if (!shouldQuery) {
      return;
    }
    handlePageQuery();
  }, [handlePageQuery, shouldQuery]);
  // modal
  const [addOrEditModalShow, setAddOrEditModalShow] = useState(false);
  const [addOrEditModalForm] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);

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
        pageQueryReq,
        setPageQueryReq,
        pageQueryResult,
        setPageQueryResult,
        handlePageQuery,
        setShouldQuery,
        addOrEditModalShow,
        setAddOrEditModalShow,
        addOrEditModalForm,
        isUpdate,
        setIsUpdate,
        allTags,
      }}
    >
      <div className="space-y-6">
        <Header />
        <SearchForm />
        <br />
        <br />
        <DataView />
      </div>
      <AddOrEditModal />
    </ThisCtx.Provider>
  );
}

const Header = () => {
  const { setAddOrEditModalShow, addOrEditModalForm, setIsUpdate } =
    useThisCtx();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold">QuestionCollection</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Manage QuestionCollection
        </p>
      </div>
      <Button
        type="primary"
        icon={<i className="fa fa-plus mr-2"></i>}
        onClick={() => {
          setIsUpdate(false);
          addOrEditModalForm.resetFields();
          setAddOrEditModalShow(true);
        }}
      >
        <span>Add New QuestionCollection</span>
      </Button>
    </div>
  );
};

const searchFormMeta = [
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
    type: "input",
    placeholder: "标签...",
  },
  {
    key: "extendInfo",
    name: "extendInfo",
    label: "扩展信息",
    type: "input",
    placeholder: "扩展信息...",
  },
  {
    key: "createBy",
    name: "createBy",
    label: "创建人",
    type: "input",
    placeholder: "创建人...",
  },
  {
    key: "createTimeTimeRange_",
    name: "createTimeTimeRange_",
    label: "创建时间",
    type: "dateTimeRangePicker",
    placeholder: "创建时间...",
  },
  {
    key: "updateBy",
    name: "updateBy",
    label: "修改人",
    type: "input",
    placeholder: "修改人...",
  },
  {
    key: "updateTimeTimeRange_",
    name: "updateTimeTimeRange_",
    label: "修改时间",
    type: "dateTimeRangePicker",
    placeholder: "修改时间...",
  },
];

// 查询表单
const SearchForm = () => {
  const [searchForm] = Form.useForm();
  const { setPageQueryReq, setShouldQuery } = useThisCtx();
  const { paramConfigForSelect } = useModel("paramConfigModel");
  return (
    <Form
      form={searchForm}
      name="questionCollectionSearchForm"
      onFinish={(formValues) => {
        setPageQueryReq((prev) => {
          return buildPageReqVo(formValues, prev);
        });
        setShouldQuery(true);
      }}
    >
      <div className="flex flex-wrap gap-8">
        {searchFormMeta.map((item) => {
          return (
            <div key={item.key}>
              {parseFormMeta(item, paramConfigForSelect)}
            </div>
          );
        })}
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button
          onClick={() => {
            searchForm.resetFields();
          }}
        >
          重置
        </Button>
      </div>
    </Form>
  );
};

const descMeta = [
  {
    key: "id",
    label: "主键ID",
    dataIndex: "id",
    type: "text",
  },
  {
    key: "title",
    label: "标题",
    dataIndex: "title",
    type: "text",
  },
  {
    key: "outline",
    label: "摘要",
    dataIndex: "outline",
    type: "text",
  },
  {
    key: "userId",
    label: "用户ID",
    dataIndex: "userId",
    type: "text",
  },
  {
    key: "imgUrl",
    label: "封面图片",
    dataIndex: "imgUrl",
    type: "image",
  },
  {
    key: "favCnt",
    label: "收藏量",
    dataIndex: "favCnt",
    type: "text",
  },
  {
    key: "createSource",
    label: "创建来源",
    dataIndex: "createSource",
    type: "tag",
    tagType: "createSource",
  },
  {
    key: "tags",
    label: "标签",
    dataIndex: "tags",
    type: "array",
  },
  {
    key: "extendInfo",
    label: "扩展信息",
    dataIndex: "extendInfo",
    type: "jsonStr",
  },
  {
    key: "createBy",
    label: "创建人",
    dataIndex: "createBy",
    type: "text",
  },
  {
    key: "createTime",
    label: "创建时间",
    dataIndex: "createTime",
    type: "text",
  },
  {
    key: "updateBy",
    label: "修改人",
    dataIndex: "updateBy",
    type: "text",
  },
  {
    key: "updateTime",
    label: "修改时间",
    dataIndex: "updateTime",
    type: "text",
  },
];

const ActionCol = ({ record }) => {
  const {
    setShouldQuery,
    setAddOrEditModalShow,
    addOrEditModalForm,
    setIsUpdate,
  } = useThisCtx();
  const { setDetail } = useModel("commonDetailModel");
  // const navigate = useNavigate();
  return (
    <Space size="middle">
      <Button
        onClick={() => {
          setDetail({
            title: `QuestionCollection ID = ${record.id}`,
            descMeta,
            record: JSON.parse(JSON.stringify(record)),
          });
          // navigate("/admin/common/common-detail");
          // 跳转新页面
          window.open("/admin/common/common-detail", "_blank");
        }}
        style={{
          color: "var(--ant-color-success)",
        }}
        type="link"
        size="small"
      >
        详情
      </Button>

      <Button
        onClick={() => {
          setIsUpdate(true);
          addOrEditModalForm.setFieldsValue({
            ...record,
            createTime: record.createTime ? dayjs(record.createTime) : null,
            updateTime: record.updateTime ? dayjs(record.updateTime) : null,
          });
          setAddOrEditModalShow(true);
        }}
        style={{
          color: "var(--ant-color-warning)",
        }}
        type="link"
        size="small"
      >
        编辑
      </Button>
      <Button
        onClick={() => {
          window.open(
            `/admin/question-collection/edit?qcId=${record.id}`,
            "_blank",
          );
        }}
        style={{
          color: "var(--ant-orange)",
        }}
        type="link"
        size="small"
      >
        更新题目
      </Button>
      <Popconfirm
        onConfirm={() => {
          deleteQuestionCollectionById(record.id).then((res) => {
            if (res.success) {
              setShouldQuery(true);
            }
          });
        }}
        description="确定删除吗?"
        okText="是"
        cancelText="否"
      >
        <Button
          style={{
            color: "var(--ant-color-error)",
          }}
          type="link"
          size="small"
        >
          删除
        </Button>
      </Popconfirm>
    </Space>
  );
};

const TagCol = ({ tagType, record, dataIndex }) => {
  const { getTagInfo } = useModel("paramConfigModel");
  const { color, label } = getTagInfo(tagType, record[dataIndex]);
  return <Tag color={color}>{label}</Tag>;
};

const Tag0 = ({ tagId }) => {
  const { allTags } = useThisCtx();
  return <Tag>{allTags.find((x) => x.id === tagId)?.tagName || tagId}</Tag>;
};

const columns = [
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
    key: "outline",
    dataIndex: "outline",
    title: "摘要",
  },
  {
    key: "userId",
    dataIndex: "userId",
    title: "用户ID",
  },
  {
    key: "imgUrl",
    dataIndex: "imgUrl",
    title: "封面图片",
    render: (_, record) => {
      return (
        <img
          className="size-12"
          src={record.imgUrl?.trim() ? record.imgUrl : null}
          alt="404"
        />
      );
    },
  },
  {
    key: "favCnt",
    dataIndex: "favCnt",
    title: "收藏量",
  },
  {
    key: "createSource",
    dataIndex: "createSource",
    title: "创建来源",
    render: (_, record) => {
      return (
        <TagCol
          tagType={"createSource"}
          record={record}
          dataIndex={"createSource"}
        />
      );
    },
  },
  {
    key: "tags",
    dataIndex: "tags",
    title: "标签",
    render: (_, record) => {
      return (
        <>
          {record.tags?.map((item) => {
            return <Tag0 key={item} tagId={item} />;
          })}
        </>
      );
    },
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
  {
    title: "操作",
    key: "action",
    fixed: "right",
    render: (_, record) => {
      return <ActionCol record={record} />;
    },
  },
];

const DataView = () => {
  const { pageQueryReq, setPageQueryReq, pageQueryResult, setShouldQuery } =
    useThisCtx();
  return (
    <>
      <Table
        columns={columns}
        dataSource={pageQueryResult.data}
        pagination={false}
        scroll={{
          x: true,
        }}
        rowKey="id"
      />
      <br />
      <Pagination
        current={pageQueryReq.page}
        pageSize={pageQueryReq.pageSize}
        total={pageQueryResult.total}
        onChange={(page, pageSize) => {
          setPageQueryReq((prev) => ({
            ...prev,
            page: pageSize !== prev.pageSize ? 1 : page,
            pageSize,
          }));
          setShouldQuery(true);
        }}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => "Total: " + total}
      />
    </>
  );
};

const addOrEditModalFormMeta = [
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
  {
    key: "createBy",
    name: "createBy",
    label: "创建人",
    type: "input",
    placeholder: "创建人...",
  },
  {
    key: "createTime",
    name: "createTime",
    label: "创建时间",
    type: "dateTimePicker",
    placeholder: "创建时间...",
  },
  {
    key: "updateBy",
    name: "updateBy",
    label: "修改人",
    type: "input",
    placeholder: "修改人...",
  },
  {
    key: "updateTime",
    name: "updateTime",
    label: "修改时间",
    type: "dateTimePicker",
    placeholder: "修改时间...",
  },
];

const AddOrEditModal = () => {
  const {
    addOrEditModalShow,
    setAddOrEditModalShow,
    setShouldQuery,
    addOrEditModalForm,
    isUpdate,
    allTags,
  } = useThisCtx();
  const { paramConfigForSelect } = useModel("paramConfigModel");
  return (
    <Modal
      title={isUpdate ? "修改" : "新增"}
      open={addOrEditModalShow}
      onCancel={() => {
        setAddOrEditModalShow(false);
      }}
      footer={null}
      width="50%"
    >
      <Form
        form={addOrEditModalForm}
        name="questionCollectionAddOrEditModalForm"
        onFinish={(formValues) => {
          const data = {
            ...formValues,
            createTime: formValues.createTime?.format("YYYY-MM-DD HH:mm:ss"),
            updateTime: formValues.updateTime?.format("YYYY-MM-DD HH:mm:ss"),
            tags: formValues.tags ? formValues.tags.join(",") : null,
          };
          if (isUpdate) {
            updateQuestionCollectionById(data).then((res) => {
              if (res.success) {
                setAddOrEditModalShow(false);
                addOrEditModalForm.resetFields();
                setShouldQuery(true);
              }
            });
          } else {
            createQuestionCollection(data).then((res) => {
              if (res.success) {
                setAddOrEditModalShow(false);
                addOrEditModalForm.resetFields();
                setShouldQuery(true);
              }
            });
          }
        }}
        layout="horizontal"
        labelCol={{ span: 4 }}
      >
        {addOrEditModalFormMeta.map((item) => {
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
            <div key={item.key}>
              {parseFormMeta(item, paramConfigForSelect)}
            </div>
          );
        })}
        <div className="flex justify-end gap-2">
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button
            onClick={() => {
              addOrEditModalForm.resetFields();
              setAddOrEditModalShow(false);
            }}
          >
            取消
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
