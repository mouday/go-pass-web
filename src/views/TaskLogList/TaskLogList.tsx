import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import api from "@/request/api";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "开始时间",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "结束时间",
    dataIndex: "updateTime",
    key: "updateTime",
  },
  // {
  //   title: "Tags",
  //   key: "tags",
  //   dataIndex: "tags",
  //   render: (_, { tags }) => (
  //     <>
  //       {tags.map((tag) => {
  //         let color = tag.length > 5 ? "geekblue" : "green";
  //         if (tag === "loser") {
  //           color = "volcano";
  //         }
  //         return (
  //           <Tag color={color} key={tag}>
  //             {tag.toUpperCase()}
  //           </Tag>
  //         );
  //       })}
  //     </>
  //   ),
  // },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const App: React.FC = () => {
  const [list, setList] = useState([]);

  const getData = async () => {
    const res = await api.getTaskLogList({});
    if (res.ok) {
      setList(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={list}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default App;