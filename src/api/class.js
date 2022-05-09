import request from "@/utils/request";

const API_PREFIX = 'class'

export default {
  // 获取班级字典数据
  getClassDictionary() {
    return request({
      url: `${API_PREFIX}/dict`,
      method: 'get'
    })
  }
}
