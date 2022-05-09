import request from "@/utils/request"

const API_PREFIX = '/student'

export default {
  // 分页查询学生信息
  queryPageStudentRecords(page, size) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询学生信息
  queryConditionPageStudentRecords(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 根据学号删除学生记录
  deleteStudentByNo(no) {
    return request({
      url: `${API_PREFIX}/${no}`,
      method: 'delete'
    })
  },

  // 批量删除学生信息
  batchDeleteStudentRecords(noList) {
    return request({
      url: `${API_PREFIX}`,
      method: 'delete',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: noList
    })
  },

  // 分页查询已删除学生信息
  queryDeletedStudentRecords(page, size) {
    return request({
      url: `${API_PREFIX}/deleted/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询已删除学生信息
  queryConditionPageDeletedStudentRecords(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/deleted/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 根据学号恢复学生信息
  recoverStudentByNo(no) {
    return request({
      url: `${API_PREFIX}/deleted/recover/${no}`,
      method: 'put'
    })
  },

  // 批量恢复学生信息
  batchRecoverStudentRecords(noList) {
    return request({
      url: `${API_PREFIX}/deleted/recover`,
      method: 'put',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: noList
    })
  }
}
