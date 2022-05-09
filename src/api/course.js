import request from "@/utils/request"

const API_PREFIX = '/course'

export default {

  // 分页查询所有课程信息
  getAllCourseInfo(page, size) {
    return request({
      url: `${API_PREFIX}/list/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询课程信息
  getConditionCourseInfos(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/list/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 根据课程编号删除指定课程
  deleteSpecifyCourseByNO(no) {
    return request({
      url: `${API_PREFIX}/${no}`,
      method: 'delete'
    })
  },

  // 根据课程编号批量删除课程数据
  deleteBatchCourseByNO(noList) {
    return request({
      url: `${API_PREFIX}/batch`,
      method: 'delete',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: noList
    })
  },

  // 分页查询所有已删除课程信息
  getAllDeletedCourseInfos(page, size) {
    return request({
      url: `${API_PREFIX}/deleted/list/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询已删除课程信息
  getConditionDeletedCourseInfos(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/deleted/list/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 根据课程编号恢复已删除课程
  recoverCourseByNO(no) {
    return request({
      url: `${API_PREFIX}/deleted/recover/${no}`,
      method: 'get'
    })
  },

  // 批量恢复已删除课程
  batchRecoverCourse(noList) {
    return request({
      url: `${API_PREFIX}/deleted/recover`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: noList
    })
  },

  // 导出所有课程数据
  exportAllCourseData() {
    return request({
      url: `${API_PREFIX}/export-all`,
      method: 'get',
      responseType: 'blob'
    })
  },

  // 根据筛选条件导出指定的课程信息
  exportSpecifyCourseData(queryObj) {
    return request({
      url: `${API_PREFIX}/export-all`,
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      method: 'post',
      data: queryObj,
      responseType: 'blob'
    })
  }
}
