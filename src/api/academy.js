import request from "@/utils/request"

const API_PREFIX = '/academy'

export default {

  // 查询学院信息用于筛选课程
  getConditionAcademyInfos() {
    return request({
      url: `${API_PREFIX}/condition/list`,
      method: 'get'
    })
  },

  // 查询某学院下面的所有专业
  queryAcademyOfMajors(code) {
    return request({
      url: `${API_PREFIX}/major/${code}`,
      method: 'get'
    })
  }
}
