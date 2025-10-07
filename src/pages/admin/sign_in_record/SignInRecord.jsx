import {
  Button,
  Form,
  Modal,
  Pagination,
  Popconfirm,
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
  createSignInRecord,
  deleteSignInRecordById,
  pageQuerySignInRecord,
  updateSignInRecordById,
} from "@/api/signInRecordApi";
import useModel from "@/hooks/useModel";
import { parseFormMeta } from "@/utils/formUtils";
import { buildPageReqVo } from "@/utils/searchFormUtils";

const ThisCtx = createContext({});
const useThisCtx = () => useContext(ThisCtx);

export default function SignInRecord() {
  const [pageQueryReq, setPageQueryReq] = useState({
    page: 1,
    pageSize: 10,
    // 主键ID
    id: null,
    // 业务类型
    bizType: null,
    // 业务ID
    bizId: null,
    // 签到标识
    yearMonth: null,
    // 扩展信息
    extendInfo: null,
    // 创建者
    createBy: null,
    // 创建时间
    createTime: null,
    // 更新者
    updateBy: null,
    // 更新时间
    updateTime: null,
  });
  const [shouldQuery, setShouldQuery] = useState(true);
  const [pageQueryResult, setPageQueryResult] = useState({
    total: 0,
    data: [],
  });
  const handlePageQuery = useCallback(async () => {
    try {
      await pageQuerySignInRecord(pageQueryReq).then((res) => {
        if (res.success) {
          setPageQueryResult({
            total: res.data.total,
            data: res.data.data,
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
        <h2 className="text-2xl font-bold">SignInRecord</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300">Manage SignInRecord</p>
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
        <span>Add New SignInRecord</span>
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
    key: "bizType",
    name: "bizType",
    label: "业务类型",
    type: "select",
    paramType: "signInRecordBizType",
    placeholder: "业务类型...",
  },
  {
    key: "bizId",
    name: "bizId",
    label: "业务ID",
    type: "input",
    placeholder: "业务ID...",
  },
  {
    key: "yearMonth",
    name: "yearMonth",
    label: "签到标识",
    type: "inputNumber",
    min: 0,
    placeholder: "签到标识...",
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
    label: "创建者",
    type: "input",
    placeholder: "创建者...",
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
    label: "更新者",
    type: "input",
    placeholder: "更新者...",
  },
  {
    key: "updateTimeTimeRange_",
    name: "updateTimeTimeRange_",
    label: "更新时间",
    type: "dateTimeRangePicker",
    placeholder: "更新时间...",
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
      name="signInRecordSearchForm"
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
    key: "bizType",
    label: "业务类型",
    dataIndex: "bizType",
    type: "tag",
    tagType: "signInRecordBizType",
  },
  {
    key: "bizId",
    label: "业务ID",
    dataIndex: "bizId",
    type: "text",
  },
  {
    key: "yearMonth",
    label: "签到标识",
    dataIndex: "yearMonth",
    type: "text",
  },
  {
    key: "extendInfo",
    label: "扩展信息",
    dataIndex: "extendInfo",
    type: "jsonStr",
  },
  {
    key: "createBy",
    label: "创建者",
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
    label: "更新者",
    dataIndex: "updateBy",
    type: "text",
  },
  {
    key: "updateTime",
    label: "更新时间",
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
  const navigate = useNavigate();
  return (
    <Space size="middle">
      <Button
        onClick={() => {
          setDetail({
            title: `SignInRecord ID = ${record.id}`,
            descMeta,
            record: JSON.parse(JSON.stringify(record)),
          });
          navigate("/admin/common/common-detail");
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

      <Popconfirm
        onConfirm={() => {
          deleteSignInRecordById(record.id).then((res) => {
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

const columns = [
  {
    key: "id",
    dataIndex: "id",
    title: "主键ID",
  },
  {
    key: "bizType",
    dataIndex: "bizType",
    title: "业务类型",
    render: (_, record) => {
      return (
        <TagCol tagType={"signInRecordBizType"} record={record} dataIndex={"bizType"} />
      );
    },
  },
  {
    key: "bizId",
    dataIndex: "bizId",
    title: "业务ID",
  },
  {
    key: "yearMonth",
    dataIndex: "yearMonth",
    title: "签到标识",
  },
  {
    key: "extendInfo",
    dataIndex: "extendInfo",
    title: "扩展信息",
  },
  {
    key: "createBy",
    dataIndex: "createBy",
    title: "创建者",
  },
  {
    key: "createTime",
    dataIndex: "createTime",
    title: "创建时间",
  },
  {
    key: "updateBy",
    dataIndex: "updateBy",
    title: "更新者",
  },
  {
    key: "updateTime",
    dataIndex: "updateTime",
    title: "更新时间",
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
  const { setPageQueryReq, pageQueryResult, setShouldQuery } = useThisCtx();
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
        current={setPageQueryReq.page}
        pageSize={setPageQueryReq.pageSize}
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
    key: "bizType",
    name: "bizType",
    label: "业务类型",
    type: "select",
    paramType: "signInRecordBizType",
    placeholder: "业务类型...",
  },
  {
    key: "bizId",
    name: "bizId",
    label: "业务ID",
    type: "input",
    placeholder: "业务ID...",
  },
  {
    key: "yearMonth",
    name: "yearMonth",
    label: "签到标识",
    type: "inputNumber",
    min: 0,
    placeholder: "签到标识...",
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
    label: "创建者",
    type: "input",
    placeholder: "创建者...",
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
    label: "更新者",
    type: "input",
    placeholder: "更新者...",
  },
  {
    key: "updateTime",
    name: "updateTime",
    label: "更新时间",
    type: "dateTimePicker",
    placeholder: "更新时间...",
  },
];

const AddOrEditModal = () => {
  const {
    addOrEditModalShow,
    setAddOrEditModalShow,
    setShouldQuery,
    addOrEditModalForm,
    isUpdate,
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
        name="signInRecordAddOrEditModalForm"
        onFinish={(formValues) => {
          const data = {
            ...formValues,
            createTime: formValues.createTime?.format('YYYY-MM-DD HH:mm:ss'),
            updateTime: formValues.updateTime?.format('YYYY-MM-DD HH:mm:ss'),
          }
          if (isUpdate) {
            updateSignInRecordById(data).then((res) => {
              if (res.success) {
                setAddOrEditModalShow(false);
                addOrEditModalForm.resetFields();
                setShouldQuery(true);
              }
            });
          } else {
            createSignInRecord(data).then((res) => {
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
