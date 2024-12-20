// @ts-nocheck
import request from './request'

const api = {
  /**
   * 登录
   */
  login: (params) => request.post('/login', params),

  getQuestionList: (params) => request.post('/getQuestionList', params),
  addQuestion: (params) => request.post('/addQuestion', params),
  updateQuestion: (params) => request.post('/updateQuestion', params),
  removeQuestion: (params) => request.post('/removeQuestion', params),
  getQuestion: (params) => request.post('/getQuestion', params),
  getQuestionDetail: (params) => request.post('/getQuestionDetail', params),
  updateQuestionAnswerResult: (params) => request.post('/updateQuestionAnswerResult', params),
}

export default api
