import { Button, Table, Tag } from "antd";

import React, { useState } from "react";

export default function Transfer({
  columns,
  rowKey = "id",
  left = {
    pageQueryReq: null,
    setPageQueryReq: null,
    pageQueryRes: null,
  },
  right = {
    transData: [],
    setTransData: () => {},
  },
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  return (
    <div className="flex w-full gap-2">
      <Table
        columns={[
          {
            key: "__transfer",
            title: "transfer?",
            render: (_, record) => (
              <>
                {right.transData.find((x) => x.id === record.id) ? (
                  <Tag color="red">已转移</Tag>
                ) : (
                  <Tag color="green">未转移</Tag>
                )}
              </>
            ),
          },
          ...columns,
        ]}
        dataSource={left.pageQueryRes.data}
        rowKey={rowKey}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
          preserveSelectedRowKeys: true,
        }}
        pagination={{
          current: left.pageQueryReq.page,
          pageSize: left.pageQueryReq.pageSize,
          total: left.pageQueryRes.total,
          onChange: (page, pageSize) => {
            left.setPageQueryReq((prev) => ({
              ...prev,
              page: pageSize !== prev.pageSize ? 1 : page,
              pageSize,
            }));
          },
        }}
        scroll={{
          x: true,
        }}
      />
      <div className="flex flex-col justify-center gap-2">
        <Button
          onClick={() => {
            right.setTransData((prev) => {
              let delta = selectedRowKeys
                .map((id) => left.pageQueryRes.data.find((x) => x.id === id))
                .filter((x) => x != null && !prev.find((x) => x.id === x.id));
              return [...prev, ...delta];
            });
          }}
          type="primary"
          disabled={selectedRowKeys.length === 0}
        >
          {">"}
        </Button>
      </div>
      <Table
        columns={[
          {
            key: "__cancelTransfer",
            title: "取消转移",
            render: (_, record) => (
              <Button
                onClick={() => {
                  right.setTransData((prev) => [
                    ...prev.filter((x) => x.id !== record.id),
                  ]);
                }}
                danger
              >
                {"<"}
              </Button>
            ),
          },
          ...columns,
        ]}
        dataSource={right.transData}
        pagination={false}
        rowKey={rowKey}
        scroll={{
          x: true,
        }}
      />
    </div>
  );
}
