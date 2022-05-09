<template>
  <div v-if="isShow" class="app-container">
    <!--<div v-if="isShow">-->
      <!-- 查询条件 -->
      <el-row :gutter="20" style="margin: 0">
        <div>
          <el-form :model="queryObj" ref="queryCourseForm" :inline="true">
            <el-form-item label="所属学院" prop="academyCode" size="medium">
              <el-select
                v-model="queryObj.academyCode"
                clearable
                placeholder="学院名称"
              >
                <el-option
                  v-for="dict in academyDictionary"
                  :key="dict.academyCode"
                  :value="dict.academyCode"
                  :label="dict.academyName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="搜索" prop="courseNameOrNo" size="medium">
              <el-input
                v-model="queryObj.courseNameOrNO"
                clearable
                placeholder="请输入课程名称或编号"
                @keyup.enter.native="handleConditionQueryCourseBtn"
              />
            </el-form-item>
            <!--<el-form-item>-->
            <!--  <el-button size="medium" type="primary" @click="handleConditionQueryCourseBtn">筛选</el-button>-->
            <!--  <el-button size="medium" type="primary" @click="handleResetQueryFormBtn">重置</el-button>-->
            <!--</el-form-item>-->
            <!--<el-form-item style="margin-left: 50px">-->
            <!--  <el-button style="width: 140px" size="medium" type="primary" @click="handleGoDeleteCourseComponentBtn">已删除课程信息</el-button>-->
            <!--</el-form-item>-->
            <el-button size="medium" type="primary" @click="handleConditionQueryCourseBtn">筛选</el-button>
            <el-button size="medium" type="primary" @click="handleResetQueryFormBtn">重置</el-button>
            <el-button style="width: 140px" size="medium" type="primary" @click="handleGoDeleteCourseComponentBtn">已删除课程信息</el-button>
          </el-form>
        </div>
        <el-divider></el-divider>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-button style="width: 160px" type="success" size="medium" @click="handleGoImportCourseViewBtn">导入课程信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button style="width: 160px" type="danger" :disabled="multiple" size="medium" @click="handleBatchRemoveCourseBtn">批量删除</el-button>
        </el-col>
        <el-col :span="3" :offset="12">
          <el-button type="success" size="medium" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-table
          v-loading="loading"
          :data="courseList"
          style="width: 100%; margin-top: 10px"
          :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}"
          border
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center"/>
          <el-table-column width="60px" label="序号" type="index" align="center" :index="showTableColumnIndex"/>
          <el-table-column label="课程编号" prop="courseNo" align="center"/>
          <el-table-column label="课程名称" prop="courseName" align="center"/>
          <el-table-column label="总学时" sortable prop="coursePeriod" align="center"/>
          <el-table-column label="学分" sortable prop="courseCredit" align="center"/>
          <el-table-column label="所属院系" prop="academyName" align="center"/>
          <el-table-column label="课程类别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.courseType === 0">必修</span>
              <span v-else-if="scope.row.courseType === 1">公选课</span>
              <span v-else-if="scope.row.courseType === 2">限选课</span>
              <span v-else>类型错误!!!</span>
            </template>
          </el-table-column>
          <el-table-column label="考试方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.courseExam === 0">考试</span>

              <span v-else-if="scope.row.courseExam === 1">考察</span>
              <span v-else>类型错误!!!</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDeleteCourseInfoBtn(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-show="page.total > 0"
          :current-page="page.num"
          :total="page.total"
          :page-size="page.limit"
          :page-sizes="page.limitArray"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="padding: 30px 0; text-align: center;"
          background
          layout="total, sizes, prev, pager, next, jumper, -> , slot"
        />
      </el-row>
    <!--</div>-->

    <!--<div v-else="!isShow">-->
    <!--  <router-view></router-view>-->
    <!--</div>-->
  </div>
  <div class="app-container" v-else>
    <router-view></router-view>
  </div>
</template>

<script>
import courseAPI from "@/api/course"
import academyAPI from "@/api/academy"

export default {
  name: 'Course',
  data() {
    return {
      isShow: this.$isShow,
      // 加载
      loading: true,
      // 收集课程编号
      multipleSelectionCourseKey: [],
      // 选中多个才可以删除
      multiple: true,
      // 分页
      page: {
        total: 10,
        num: 1,
        limit: 20,
        limitArray: [20, 30, 40, 50]
      },
      // 查询条件
      queryObj: {
        academyCode: '',
        courseNameOrNO: ''
      },
      // 学院字典, 应该从后台获取
      academyDictionary: [],
      // 课程数据
      courseList: []
    }
  },

  created() {
    this.init()
  },

  methods: {

    // 初始化数据
    init() {
      this.queryAllCourseInfo()
      this.queryConditionAcademyInfos()
    },

    // 初始化学院查询信息
    async queryConditionAcademyInfos() {
      const res = await academyAPI.getConditionAcademyInfos()
      if (res.code === 0) {
        this.academyDictionary = res.data.academyConditions
      } else {
        this.$message.error(res.message)
      }
    },

    // 初始化表格数据(分页查询课程信息)
    async queryAllCourseInfo(page = 1) {
      this.page.num = page
      this.loading = true
      const res = await courseAPI.getAllCourseInfo(this.page.num, this.page.limit)
      if (res.code === 0) {
        this.page.total = res.data.total
        this.courseList = res.data.list
        this.loading = false
      } else {
        this.$message.error(res.message)
      }
    },

    // 分页条件查询课程信息
    async queryConditionCourseInfos(page = 1) {
      this.page.num = page
      this.loading = true
      const res = await courseAPI.getConditionCourseInfos(this.page.num, this.page.limit, this.queryObj)
      if (res.code === 0) {
        this.page.total = res.data.total
        this.courseList = res.data.list
        this.loading = false
      } else {
        this.$message.error(res.message)
      }
    },

    // 计算表格行的索引序列号
    showTableColumnIndex(index) {
      return (this.page.num - 1) * this.page.limit + index + 1
    },

    // 处理分页组件每页条数发生变化的事件
    handleSizeChange(size) {
      this.page.limit = size
      if (this.verifyQueryObjValidity()) {
        this.queryConditionCourseInfos()
      } else {
        this.queryAllCourseInfo()
      }
    },

    // 处理分页组件页码发生变化的事件
    handleCurrentChange(page) {
      if (this.verifyQueryObjValidity()) {
        this.queryConditionCourseInfos(page)
      } else {
        this.queryAllCourseInfo(page)
      }
    },

    // 校验查询参数是否合法
    verifyQueryObjValidity() {
      const { academyCode, courseNameOrNO } = this.queryObj
      if (academyCode == undefined && courseNameOrNO == undefined)
        return false
      if (academyCode == '' && courseNameOrNO == '')
        return false

      return true
    },

    // 处理表格行选中事件
    handleSelectionChange(selection) {
      this.multipleSelectionCourseKey = selection.map(item => item.courseNo)
      this.multiple = !selection.length
    },

    // 查询表单重置按钮
    handleResetQueryFormBtn() {
      this.$refs.queryCourseForm.resetFields()
      this.queryObj = {
        academyCode: '',
        courseNameOrNO: ''
      }
      this.queryAllCourseInfo()
    },

    // 跳转到查看所有已删除课程信息页面
    handleGoDeleteCourseComponentBtn() {
      this.$router.push('/edu/course/list/delete')
    },

    // 跳转到上传课程数据的页面
    handleGoImportCourseViewBtn() {
      this.$router.push('/edu/course/list/import')
    },

    // 处理筛选按钮的点击事件
    handleConditionQueryCourseBtn() {
      this.queryConditionCourseInfos()
    },

    // 处理删除指定课程的按钮点击事件
    handleDeleteCourseInfoBtn(row) {
      this.$confirm('是否要删除课程: ' + row.courseName + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseAPI.deleteSpecifyCourseByNO(row.courseNo).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.queryAllCourseInfo()
          }
          else
            this.$message.error(res.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 处理批量删除课程按钮点击事件
    handleBatchRemoveCourseBtn() {
      this.$confirm('是否要删除选中的课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseAPI.deleteBatchCourseByNO(this.multipleSelectionCourseKey).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.queryAllCourseInfo()
          }
          else
            this.$message.error(res.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 导出筛选出的课程数据到 Excel 文件
    exportExcel() {
      // 首先判断是否有条件参数
      if (!this.verifyQueryObjValidity()) { // 没有参数就导出全部
        this.$confirm('是否导出所有数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          courseAPI.exportAllCourseData().then(res => {
            // 注意这里后台已经将流处理为 Blob 类型
            // 这种情况无法获得后台规定的 filename, 所以前台自己定义一个 filename
            const aLink = document.createElement('a')
            aLink.style.display = 'none'
            aLink.href = URL.createObjectURL(res)
            aLink.setAttribute('download', '课程信息')
            document.body.appendChild(aLink)
            aLink.click()
            document.body.removeChild(aLink)
          })
        }).catch(() => {
          this.$message.info('已取消导出')
        })
      } else {
        courseAPI.exportSpecifyCourseData(this.queryObj).then(data => {
          const aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = URL.createObjectURL(data)
          aLink.setAttribute('download', '课程信息')
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink)
        })
      }
    },

    // 注意该方法暂时并未使用, 因为后台已经对数据流做了处理, 前台拿到的直接是 Blob
    // 如果后台传输的直接是字节流, 可以使用该方法将其转换为 Blob
    // mark
    // 解析后台导出接口返回的数据流, 将其转换为 Blob 对象
    resolveBolb(res, mimeType) {
      const aLink = document.createElement('a')
      aLink.style.display = 'none'
      var blob = new Blob([res.data], { type: mimeType })
      // 从 response 的 headers 中获取 fileName
      var contentDisposition = decodeURI(res.headers['content-disposition'])
      var fileName = contentDisposition.split("filename*=utf8''")[1]
      aLink.href = URL.createObjectURL(blob)
      aLink.setAttribute('download', fileName)
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    }

  }
}
</script>

<style lang="less" scoped>

/deep/ .el-divider--horizontal {
  margin: 0 0 20px 0;
}

///deep/ .el-button--medium {
//  padding: 10px 20px;
//  font-size: 14px;
//  border-radius: 4px;
//  width: 80px;
//}
//
///deep/ .el-button--primary {
//  color: #409EFF;
//  background-color: #FFF;
//  border-color: #409EFF;
//}
//
///deep/ .el-button--success {
//  color: #FFF;
//  background-color: #409EFF;
//  border-color: #409EFF;
//}
//
///deep/ .el-button--primary:hover {
//  color: #FFF;
//  background-color: #409EFF;
//  border-color: #409EFF;
//}
</style>
