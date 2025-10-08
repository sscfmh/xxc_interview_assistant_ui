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

import { listQueryRoleByIds } from "@/api/roleApi";
import {
  createUser,
  deleteUserById,
  pageQueryUser,
  updateUserById,
} from "@/api/userApi";
import useModel from "@/hooks/useModel";
import { parseFormMeta } from "@/utils/formUtils";
import { buildPageReqVo } from "@/utils/searchFormUtils";

const ThisCtx = createContext({});
const useThisCtx = () => useContext(ThisCtx);

export default function User() {
  const [pageQueryReq, setPageQueryReq] = useState({
    page: 1,
    pageSize: 10,
    // 主键ID
    id: null,
    // 用户昵称
    nickName: null,
    // 用户邮箱
    email: null,
    // 手机号码
    phoneNumber: null,
    // 密码
    password: null,
    // 帐号状态（0停用 1正常）
    status: null,
    // 用户性别（1男 2女 其他未知）
    sex: null,
    // 头像地址
    avatar: null,
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
      await pageQueryUser(pageQueryReq).then((res) => {
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
        <h2 className="text-2xl font-bold">User</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300">Manage User</p>
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
        <span>Add New User</span>
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
    key: "nickName",
    name: "nickName",
    label: "用户昵称",
    type: "input",
    placeholder: "用户昵称...",
  },
  {
    key: "email",
    name: "email",
    label: "用户邮箱",
    type: "input",
    placeholder: "用户邮箱...",
  },
  {
    key: "phoneNumber",
    name: "phoneNumber",
    label: "手机号码",
    type: "input",
    placeholder: "手机号码...",
  },
  {
    key: "password",
    name: "password",
    label: "密码",
    type: "input",
    placeholder: "密码...",
  },
  {
    key: "status",
    name: "status",
    label: "帐号状态",
    type: "select",
    paramType: "enable",
    placeholder: "帐号状态...",
  },
  {
    key: "sex",
    name: "sex",
    label: "用户性别",
    type: "select",
    paramType: "sex",
    placeholder: "用户性别...",
  },
  {
    key: "avatar",
    name: "avatar",
    label: "头像地址",
    type: "input",
    placeholder: "头像地址...",
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
      name="userSearchForm"
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
    key: "nickName",
    label: "用户昵称",
    dataIndex: "nickName",
    type: "text",
  },
  {
    key: "email",
    label: "用户邮箱",
    dataIndex: "email",
    type: "text",
  },
  {
    key: "phoneNumber",
    label: "手机号码",
    dataIndex: "phoneNumber",
    type: "text",
  },
  {
    key: "roles",
    label: "roles",
    dataIndex: "roles",
    type: "array",
  },
  {
    key: "password",
    label: "密码",
    dataIndex: "password",
    type: "text",
  },
  {
    key: "status",
    label: "帐号状态",
    dataIndex: "status",
    type: "tag",
    tagType: "enable",
  },
  {
    key: "sex",
    label: "用户性别",
    dataIndex: "sex",
    type: "tag",
    tagType: "sex",
  },
  {
    key: "avatar",
    label: "头像地址",
    dataIndex: "avatar",
    type: "image",
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
            title: `User ID = ${record.id}`,
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
          deleteUserById(record.id).then((res) => {
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
    key: "nickName",
    dataIndex: "nickName",
    title: "用户昵称",
  },
  {
    key: "email",
    dataIndex: "email",
    title: "用户邮箱",
  },
  {
    key: "phoneNumber",
    dataIndex: "phoneNumber",
    title: "手机号码",
  },
  {
    key: "password",
    dataIndex: "password",
    title: "密码",
  },
  {
    key: "status",
    dataIndex: "status",
    title: "帐号状态",
    render: (_, record) => {
      return <TagCol tagType={"enable"} record={record} dataIndex={"status"} />;
    },
  },
  {
    key: "sex",
    dataIndex: "sex",
    title: "用户性别",
    render: (_, record) => {
      return <TagCol tagType={"sex"} record={record} dataIndex={"sex"} />;
    },
  },
  {
    key: "avatar",
    dataIndex: "avatar",
    title: "头像地址",
    render: (_, record) => {
      return (
        <img
          className="size-12"
          src={record.avatar?.trim() ? record.avatar : null}
          alt="404"
        />
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
  const { pageQueryReq, setPageQueryReq, pageQueryResult, setShouldQuery } = useThisCtx();
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
    key: "nickName",
    name: "nickName",
    label: "用户昵称",
    type: "input",
    placeholder: "用户昵称...",
  },
  {
    key: "email",
    name: "email",
    label: "用户邮箱",
    type: "input",
    placeholder: "用户邮箱...",
  },
  {
    key: "phoneNumber",
    name: "phoneNumber",
    label: "手机号码",
    type: "input",
    placeholder: "手机号码...",
  },
  {
    key: "roles",
    name: "roles",
    label: "角色",
    type: "selectMultiple",
    placeholder: "角色...",
  },
  {
    key: "password",
    name: "password",
    label: "密码",
    type: "input",
    placeholder: "密码...",
  },
  {
    key: "status",
    name: "status",
    label: "帐号状态",
    type: "select",
    paramType: "enable",
    placeholder: "帐号状态...",
  },
  {
    key: "sex",
    name: "sex",
    label: "用户性别",
    type: "select",
    paramType: "sex",
    placeholder: "用户性别...",
  },
  {
    key: "avatar",
    name: "avatar",
    label: "头像地址",
    type: "input",
    placeholder: "头像地址...",
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
  const [allRoles, setAllRoles] = useState([]);
  useEffect(() => {
    listQueryRoleByIds().then((res) => {
      if (res.success) {
        setAllRoles(
          (res.data || []).map((item) => {
            return {
              value: item.roleKey,
              label: item.roleName,
            };
          }),
        );
      }
    });
  }, []);
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
        name="userAddOrEditModalForm"
        onFinish={(formValues) => {
          const data = {
            ...formValues,
            createTime: formValues.createTime?.format("YYYY-MM-DD HH:mm:ss"),
            updateTime: formValues.updateTime?.format("YYYY-MM-DD HH:mm:ss"),
          };
          if (isUpdate) {
            updateUserById(data).then((res) => {
              if (res.success) {
                setAddOrEditModalShow(false);
                addOrEditModalForm.resetFields();
                setShouldQuery(true);
              }
            });
          } else {
            createUser(data).then((res) => {
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
                    options={allRoles}
                    allowClear
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
