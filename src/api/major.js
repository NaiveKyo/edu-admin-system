import request from "@/utils/request";

const API_PREFIX = '/major'

export default {
  // 查询专业字典数据
  getMajorDictionary() {
    return request({
      url: `${API_PREFIX}/dict`,
      method: 'get'
    })
  },

  // 查询某专业下的所有班级
  getMajorOfClass(code) {
    return request({
      url: `${API_PREFIX}/class/${code}`,
      method: 'get'
    })
  }
}
