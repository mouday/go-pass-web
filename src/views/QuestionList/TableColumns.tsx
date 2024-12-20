import React, { useState, useEffect } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Space, Switch, Popconfirm, Button, Table, Tag } from 'antd'
import {
  DeleteOutlined,
  FormOutlined,
  ContainerOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import {
  useSearchParams,
  useParams,
  useHref,
  useResolvedPath,
  resolvePath
} from 'react-router-dom'

export default [
  {
    title: '题目描述',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
    render: (_, record) => {
      return <div className="text-left">{record.title}</div>
    },
  },

  // {
  //   title: '执行器',
  //   dataIndex: 'runnerName',
  //   key: 'runnerName',
  //   align: 'center',
  //   render: (_, record) => {
  //     return <div className="text-left">{record.runnerName}</div>
  //   },
  // },
  {
    title: '类型',
    dataIndex: 'url',
    key: 'url',
    align: 'center',
    width: 80,
    render: (_, record) => {
      return <div className="text-left">{record.optionOkCount > 1 ? '多选': '单选'}</div>
    },
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 80,
    render: (_, record) => {
      return <div className="text-left">{record.score}</div>
    },
  },
  // {
  //   title: 'Cron',
  //   align: 'center',
  //   dataIndex: 'cron',
  //   key: 'cron',
  //   width: 200,
  //   render: (_, record) => {
  //     return <div className="text-left">{record.cron}</div>
  //   },
  // },
  // {
  //   title: '状态',
  //   align: 'center',
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: 100,
  //   render: (_, record) => {
  //     return (
  //       <Switch
  //         defaultChecked={record.status}
  //         onChange={(val) => {
  //           record.handleStatusChange(record, val)
  //         }}
  //       ></Switch>
  //     )
  //   },
  // },
  {
    title: '刷题',
    key: 'action',
    align: 'center',
    width: 80,
    render: (_, record) => {
      return <Button
        type="link"
        onClick={() => {
          record.handleShowLog(record)
        }}
      >
        <ContainerOutlined />
      </Button>
    },
  },

  {
    title: '操作',
    align: 'center',
    dataIndex: 'taskId',
    key: 'taskId',
    width: 160,
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="link"
          onClick={() => {
            record.handleEditRow(record)
          }}
        >
          <FormOutlined className="cursor-pointer" />
        </Button>

        <Popconfirm
          title="确认删除"
          description=""
          onConfirm={() => {
            record.handleDeleteRow(record)
          }}
        >
          <Button
            danger
            type="link"
          >
            <DeleteOutlined className="cursor-pointer" />
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
]
