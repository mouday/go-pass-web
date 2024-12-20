import React, { useState, useEffect } from 'react'
import {
  Button,
  Space,
  Modal,
  Checkbox,
  message,
  Form,
  Input,
  Row,
  Col,
} from 'antd'
import { Switch, Popconfirm } from 'antd'
import { Select } from 'antd'
import api from '@/request/api'
import { isValidCron } from 'cron-validator'
import { isValidCronExpression, getCrontabSchedule } from '@/utils/cron-util'
import {
  DeleteOutlined,
  FormOutlined,
  ContainerOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { getUUID } from '@/utils/uuid-util'

export default function TaskEditForm({ currentRow, onSuccess, onCancel }) {
  const [list, setList] = useState([])
  const [options, setOptions] = useState([
    {
      status: false,
      label: '',
      uuid: getUUID() 
    },
  ])
  const [runnerList, setRunnerList] = useState([])
  const [cronNextList, setCronNextList] = useState([])

  const initialValues = {
    status: true,
    runnerId: null,
  }

  // const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm()

  const getData = async () => {
    const res = await api.getQuestion({
      id: currentRow.id,
    })

    if (res.ok) {
      form.setFieldsValue(res.data)
      setOptions(res.data.options.map(item=>{
        item.uuid = getUUID() 
        return item
      }))
    }
  }

  const getRunnerList = async () => {
    const res = await api.getRunnerList({})
    if (res.ok) {
      setRunnerList(res.data.list)
    }
  }

  const parseCrontab = (cron) => {
    const cronNextList = getCrontabSchedule(cron)
    setCronNextList(cronNextList)
  }

  useEffect(() => {
    if (currentRow && currentRow.id) {
      getData()
    }
  }, [])

  const onFinish = async (values) => {
    values = { ...values, options }

    console.log('Success:', values)

    let res = null
    if (currentRow && currentRow.id) {
      res = await api.updateQuestion({
        ...values,
        id: currentRow.id,
      })
    } else {
      res = await api.addQuestion(values)
    }

    if (res.ok) {
      message.success({
        content: '操作成功',
      })
      onSuccess()
    } else {
      message.error({
        content: res.msg,
      })
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues, allValues) => {
    console.log('allValues:', allValues)
    parseCrontab(allValues.cron)
  }

  const handleAddOption = () => {
    setOptions((pre) => {
      return [...pre, { label: '', status: false, uuid: getUUID() }]
    })
  }
  const handleRemoveOpiton = (index) => {
    setOptions((pre) => {
      return pre.filter((item, i) => {
        console.log(item, i, index)
        return i !== index
      })
    })
  }

  const handleOptionStatusChange = (e, index) => {
    console.log(e, index)

    setOptions((pre) => {
      return pre.map((item, i) => {
        if (index == i) {
          console.log(e.target.checked);
          
          item.status = e.target.checked
          // item.uuid = getUUID()
        }

        return item
      })
    })
  }

  const handleOptionLabelChange = (e, index) => {
    setOptions((pre) => {
      return pre.map((item, i) => {
        if (index == i) {
          item.label = e.target.value
          // item.uuid = getUUID()
        }

        return item
      })
    })
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 4,
      }}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      autoComplete="off"
    >
      <Form.Item
        label="题目描述"
        name="title"
        rules={[
          {
            required: true,
            message: '请输入题目描述',
          },
        ]}
      >
        <Input placeholder="任务描述" />
      </Form.Item>

      <Form.Item
        label="选项"
        rules={[
          {
            required: true,
            message: '请输入题目描述',
          },
        ]}
      >
        <Button onClick={handleAddOption}>添加</Button>

        {options.map((item, index) => {
          return (
            <Row
              align="middle"
              key={item.uuid}
              className="mt-4"
            >
              <Col span={2}>
                <Checkbox
                  checked={item.status}
                  onChange={(e) => {
                    handleOptionStatusChange(e, index)
                  }}
                ></Checkbox>
              </Col>
              <Col span={20}>
                <Input
                  placeholder=""
                  value={item.label}
                  onChange={(e) => {
                    handleOptionLabelChange(e, index)
                  }}
                />
              </Col>
              <Col span={2}>
                <Popconfirm
                  title="确认删除"
                  description=""
                  onConfirm={() => {
                    handleRemoveOpiton(index)
                  }}
                >
                  <Button
                    danger
                    type="link"
                  >
                    <DeleteOutlined className="cursor-pointer" />
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          )
        })}
      </Form.Item>

      <Form.Item
        label="启用"
        name="status"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Space>
          <Button onClick={onCancel}>取消</Button>

          <Button
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
