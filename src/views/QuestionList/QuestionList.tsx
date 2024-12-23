// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Space, Switch, Table, Tag } from "antd";

import TaskEditForm from "./TaskEditForm";
import TableColumns from "./TableColumns";
import { Button, Modal, message, Checkbox, Form, Input } from "antd";
import {
  useSearchParams,
  useParams,
  useHref,
  useResolvedPath,
} from 'react-router-dom'
import api from "@/request/api";

const App: React.FC = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRow, setCurrentRow] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [pagination, setPagination] = useState({
    position: ["bottomCenter"],
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const resetData = async () => {
    setPagination((pre) => {
      let value = { ...pre, current: 1 };
      getData(value);
      return value;
    });
  };

  const handleStatusChange = async (record, value) => {
    const res = await api.updateTaskStatus({
      taskId: record.taskId,
      status: value,
    });

    if (res.ok) {
      message.success({
        content: "操作成功",
      });
    } else {
      message.error({
        content: res.msg,
      });
    }
  };

  const handleEditRow = async (record) => {
    setCurrentRow(record);
    setIsModalOpen(true);
  };

  const handleDeleteRow = async (record) => {
    const res = await api.removeQuestion({
      id: record.id,
    });

    if (res.ok) {
      message.success({
        content: "操作成功",
      });
      resetData();
    } else {
      message.error({
        content: res.msg,
      });
    }
  };


  const handleRunRow = async (record) => {
    const res = await api.runTask({
      taskId: record.taskId,
    });

    if (res.ok) {
      message.success({
        content: "操作成功",
      });
    } else {
      message.error({
        content: res.msg,
      });
    }
  }

  const handleShowLog = (record) => {
    // navigate(`/task-log/${record.taskLogId}`);
    // console.log(useResolvedPath({
    //   to: `./question-detail?id=${record.id}`
    // }));
    
    window.open(`/#/question-detail/${record.id}`, "_blank");
  };

  const getData = async (value) => {
    setLoading(true);
    const res = await api.getQuestionList({
      page: value.current,
      size: value.pageSize,
    });

    if (res.ok) {
      setList(
        res.data.list.map((item) => {
          item.handleStatusChange = handleStatusChange;
          item.handleEditRow = handleEditRow;
          item.handleDeleteRow = handleDeleteRow;
          item.handleShowLog = handleShowLog;
          item.handleRunRow = handleRunRow;
          return item;
        })
      );

      setPagination((pre) => {
        return {
          ...pre,
          total: res.data.total,
        };
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    getData(pagination);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setCurrentRow(null);
    setIsModalOpen(true);
  };

  const handleTaskEditFormSuccess = () => {
    setIsModalOpen(false);
    resetData();
  };

  const handleTaskEditFormCancel = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (value) => {
    console.log(value);

    setPagination((pre) => {
      let newValue = {
        ...pre,
        ...value,
      };

      getData(newValue);

      return newValue;
    });
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        添加题目
      </Button>

      <Table className="mt-4"
        bordered
        rowKey="id"
        loading={loading}
        columns={TableColumns}
        dataSource={list}
        pagination={pagination}
        onChange={handlePageChange}
      />

      {/* 编辑框 */}
      <Modal
        title={<div className="text-center">编辑题目</div>}
        footer={null}
        style={{ top: 20 }}
        width={800}
        open={isModalOpen}
        destroyOnClose={true}
        onCancel={handleTaskEditFormCancel}
      >
        <TaskEditForm
          currentRow={currentRow}
          onCancel={handleTaskEditFormCancel}
          onSuccess={handleTaskEditFormSuccess}
        ></TaskEditForm>
      </Modal>
    </>
  );
};

export default App;
