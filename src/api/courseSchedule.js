import request from "@/utils/request";

const API_PREFIX = '/course-schedule'

export default {
  // 分页查询排课信息
  getPageCourseScheduleRecords(page, size) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询排课信息
  getConditionPageCourseScheduleRecords(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 根据 id 删除排课数据
  deleteCourseScheduleRecordById(id) {
    return request({
      url: `${API_PREFIX}/${id}`,
      method: 'delete'
    })
  },

  // 批量删除排课数据
  batchDeleteCourseScheduleRecordById(idList) {
    return request({
      url: `${API_PREFIX}`,
      method: 'delete',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: idList
    })
  }
}
