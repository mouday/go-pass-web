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
  Alert,
  Radio,
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
import { useSearchParams, useParams } from 'react-router-dom'
import './QuestionDetail.less'
import { getUUID } from '@/utils/uuid-util'

import { useNavigate } from 'react-router-dom'

export default function QuestionDetail({ currentRow, onSuccess, onCancel }) {
  const navigate = useNavigate()

  const [data, setData] = useState({
    title: '',
    options: [],
  })

  const [detail, setDetail] = useState({
    errerCount: 0,
    nextId: 0,
    successCount: 0,
    total: 0,
  })

  const { id } = useParams()

  const [selected, setSelected] = useState([])
  const [successResult, setSuccessResult] = useState([])
  const [result, setResult] = useState(null)
  const [singleValue, setSingleValue] = useState(null)
  const [cronNextList, setCronNextList] = useState([])

  const getData = async () => {
    const res = await api.getQuestionDetail({
      id: parseInt(id),
    })

    if (res.ok) {
      setDetail(res.data)

      // 随机乱序
      let options = res.data.data.options.sort(() => Math.random() - 0.5)

      // 序号
      options = options.map((item, index) => {
        item.checked = false
        item.order = String.fromCharCode(65 + index)
        return item
      })

      setSuccessResult(
        options
          .filter((item) => {
            return item.status
          })
          .map((item) => item.order)
      )

      setData({
        ...res.data.data,
        options,
      })
    }
  }

  const getRunnerList = async () => {
    const res = await api.getRunnerList({})
    if (res.ok) {
      setRunnerList(res.data.list)
    }
  }

  const handleOptionStatusChange = (e, index) => {
    console.log(e, index)

    setData((pre) => {
      let options = pre.options.map((item, i) => {
        if (index == i) {
          console.log(e.target.checked)

          item.checked = e.target.checked
          // item.uuid = getUUID()
        }

        return item
      })

      return { ...pre, options }
    })
  }

  const handleSingleOptionChange = (e) => {
    setSingleValue(e.target.value)
  }

  const updateQuestionAnswerResult = async (value) => {
    const res = await api.updateQuestionAnswerResult({
      id: data.id,
      result: value,
    })

    if (value) {
      setTimeout(() => {
        handleNextQuestion()
      }, 500)
    }
  }

  const handleSubmit = () => {
    let success = null
    if (data.optionOkCount > 1) {
      if (
        data.options.filter((item) => {
          return item.checked
        }).length == 0
      ) {
        return
      }

      success =
        data.options.filter((item) => {
          return item.status != item.checked
        }).length == 0
    } else {
      console.log(singleValue)

      if (!singleValue) {
        return
      }

      success =
        data.options.filter((item) => {
          return item.status && item.order === singleValue
        }).length == 1
    }

    if (success) {
      setResult(true)
      setData((pre) => {
        return { ...pre, answerCount: pre.answerCount + 1 }
      })
    } else {
      setData((pre) => {
        return { ...pre, answerCount: pre.answerCount - 1 }
      })
      setResult(false)
    }

    updateQuestionAnswerResult(success)
  }

  const handleNextQuestion = () => {
    // window.open(`/#/question-detail/${detail.nextId}`, '_self')
    // window.location.href = `/#/question-detail/${detail.nextId}`
    // let uuid = getUUID()
    navigate(`/question-detail/${detail.nextId}`)
  }

  useEffect(() => {
    if (id) {
      getData()
    }
  }, [])

  return (
    <div className="QuestionDetail">
      <div className="QuestionDetail__title">{data.title}</div>
      <div className="QuestionDetail__options">
        {data.optionOkCount > 1 ? (
          data.options.map((item, index) => {
            return (
              <div
                key={index}
                className="QuestionDetail__option"
              >
                <Checkbox
                  checked={item.checked}
                  onChange={(e) => {
                    handleOptionStatusChange(e, index)
                  }}
                >
                  <span className="mr-2">{item.order}、</span>
                  <span>{item.label}</span>
                </Checkbox>
              </div>
            )
          })
        ) : (
          <Radio.Group
            onChange={handleSingleOptionChange}
            value={singleValue}
          >
            {data.options.map((item, index) => {
              return (
                <div
                  key={index}
                  className="QuestionDetail__option"
                >
                  <Radio value={item.order}>
                    <span className="mr-2">{item.order}、</span>
                    <span>{item.label}</span>
                  </Radio>
                </div>
              )
            })}
          </Radio.Group>
        )}
      </div>
      <div className="QuestionDetail__button">
        <Button
          onClick={handleSubmit}
          type="primary"
        >
          提交
        </Button>
        <Button
          onClick={handleNextQuestion}
          className="ml-8"
        >
          下一题
        </Button>
      </div>

      <div className="QuestionDetail__result">
        <div className="QuestionDetail__result__success">
          {result === true ? (
            <Alert
              message="正确"
              type="success"
              showIcon
            />
          ) : (
            ''
          )}
        </div>
        <div className="QuestionDetail__result__error">
          {result === false ? (
            <Alert
              message="错误"
              type="error"
              showIcon
            />
          ) : (
            ''
          )}
        </div>
      </div>

      {result !== null ? (
        <div className="QuestionDetail__successResult">
          <div>正确答案：{successResult.join('、')}</div>
          <div>正确次数：{data.answerCount}</div>
        </div>
      ) : (
        <></>
      )}

      <div>
        题目总数：{detail.total} / 已作答：
        {detail.errerCount + detail.successCount} / 正确数：
        {detail.successCount}
      </div>
    </div>
  )
}
