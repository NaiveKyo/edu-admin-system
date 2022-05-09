import request from "@/utils/request";

const API_PREFIX = '/teacher'

export default {
  // 分页查询教师信息
  queryPageTeacherRecords(page, size) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询教师信息
  queryConditionPageTeacherRecords(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 删除指定教师信息
  deleteSpecifyTeacherByNo(no) {
    return request({
      url: `${API_PREFIX}/${no}`,
      method: 'delete'
    })
  },

  // 根据编号集合批量删除教师
  batchDeleteTeacher(noList) {
    return request({
      url: `${API_PREFIX}`,
      method: 'delete',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: noList
    })
  },

  // 分页查询已删除教师信息
  queryDeletedTeacherRecords(page, size) {
    return request({
      url: `${API_PREFIX}/delete/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询已删除教师信息
  queryConditionDeletedTeacherRecords(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/delete/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 恢复指定教师信息
  recoverTeacherByNo(no) {
    return request({
      url: `${API_PREFIX}/recover/${no}`,
      method: 'put'
    })
  },

  // 批量恢复教师信息
  batchRecoverTeacher(noList) {
    return request({
      url: `${API_PREFIX}/recover/`,
      method: 'put',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: noList
    })
  }
}
