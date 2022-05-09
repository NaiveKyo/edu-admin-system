import request from "@/utils/request";

const API_PREFIX = '/student-course-schedule'

export default {
  // 分页查询学生选课记录
  getPageStudentCourseScheduleRecords(page, size) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'get'
    })
  },

  // 分页条件查询学生选课记录
  getConditionPageStudentCourseScheduleRecords(page, size, queryObj) {
    return request({
      url: `${API_PREFIX}/${page}/${size}`,
      method: 'post',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: queryObj
    })
  },

  // 根据 ID 删除选课数据
  removeStudentCourseScheduleRecord(id) {
    return request({
      url: `${API_PREFIX}/${id}`,
      method: 'delete'
    })
  },

  // 批量删除选课数据
  batchRemoveStudentCourseScheduleRecord(idList) {
    return request({
      url: `${API_PREFIX}`,
      method: 'delete',
      headers: { 'content-type' : 'application/json;charset=utf-8' },
      data: idList
    })
  }
}


