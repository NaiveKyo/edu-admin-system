<template>
  <div>
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
              placeholder="请输入课程名称、编号"
              @keyup.enter.native="handleConditionQueryCourseBtn"
            />
          </el-form-item>
          <el-form-item size="medium">
            <el-button size="medium" type="primary" @click="handleConditionQueryCourseBtn">筛选</el-button>
            <el-button size="medium" type="primary" @click="handleResetQueryFormBtn">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-divider></el-divider>
      <el-button style="width: 160px" type="success" :disabled="multiple" size="medium" @click="handleBatchRecoverCourseBtn">批量恢复</el-button>
    </el-row>

    <el-row v-loading="loading" :gutter="20">
      <el-table
        :data="courseList"
        style="width: 100%; margin-top: 10px"
        :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}"
        border
        stripe
        max-height="520px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"/>
        <el-table-column width="60px" label="编号" type="index" align="center" :index="showTableColumnIndex"/>
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
            <el-button type="text" @click="handleRecoverCourseInfoBtn(scope.row)">恢复</el-button>
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
  </div>
</template>

<script>
import courseAPI from "@/api/course"
import academyAPI from "@/api/academy"

export default {
  name: "DeleteCourse",
  data() {
    return {
      // 加载
      loading: true,
      // 收集课程编号
      multipleSelectionCourseKey: [],
      // 选中多个才可以恢复
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
      // 已删除课程数据
      courseList: []
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      this.queryConditionAcademyInfos()
      this.getAllDeletedCourseInfos()
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

    // 获取所有已删除的课程信息
    async getAllDeletedCourseInfos(page = 1) {
      this.page.num = page
      this.loading = true
      const res = await courseAPI.getAllDeletedCourseInfos(this.page.num, this.page.limit)
      if (res.code === 0) {
        this.page.total = res.data.total
        this.courseList = res.data.list
        this.loading = false
      } else
        this.$message.error(res.message)
    },

    // 条件查询所有已删除课程信息
    async getConditionDeletedCourseInfos(page = 1) {
      this.page.num = page
      this.loading = true
      const res = await courseAPI.getConditionDeletedCourseInfos(this.page.num, this.page.limit, this.queryObj)
      if (res.code === 0) {
        this.page.total = res.data.total
        this.courseList = res.data.list
        this.loading = false
      } else
        this.$message.error(res.message)
    },

    // 计算表格行的索引序列号
    showTableColumnIndex(index) {
      return (this.page.num - 1) * this.page.limit + index + 1
    },

    // 处理分页组件每页条数发生变化的事件
    handleSizeChange(size) {
      this.page.limit = size
      if (this.verifyQueryObjValidity()) {
        this.queryConditionAcademyInfos()
      } else {
        this.queryAllCourseInfo()
      }
    },

    // 处理分页组件页码发生变化的事件
    handleCurrentChange(page) {
      if (this.verifyQueryObjValidity()) {
        this.queryConditionAcademyInfos(page)
      } else {
        this.queryAllCourseInfo(page)
      }
    },

    // 校验查询参数是否合法
    verifyQueryObjValidity() {
      if ((this.queryObj.academy === '' && this.queryObj.courseNameOrNo === '') ||
        (this.queryObj.academy === undefined && this.queryObj.courseNameOrNo === undefined)) {
        return false
      } else {
        return true
      }
    },

    // 处理表格行选中事件
    handleSelectionChange(selection) {
      this.multipleSelectionCourseKey = selection.map(item => item.courseNo)
      this.multiple = !selection.length
    },

    // 查询表单重置按钮
    handleResetQueryFormBtn() {
      this.queryObj = {
        academyCode: '',
        courseNameOrNO: ''
      }
      this.$refs.queryCourseForm.resetFields()
      this.getAllDeletedCourseInfos()
    },

    // 处理筛选按钮的点击事件
    handleConditionQueryCourseBtn() {
      this.getConditionDeletedCourseInfos()
    },

    // 处理恢复按钮的点击事件
    handleRecoverCourseInfoBtn(row) {
      this.$confirm('是否要恢复课程: ' + row.courseName + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseAPI.recoverCourseByNO(row.courseNo).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.getAllDeletedCourseInfos()
          }
          else
            this.$message.error(res.message)
        })
      }).catch(() => {
        this.$message.info('已取消恢复')
      })
    },

    // 处理批量恢复按钮点击事件
    handleBatchRecoverCourseBtn() {
      this.$confirm('是否要恢复选中的课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseAPI.batchRecoverCourse(this.multipleSelectionCourseKey).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.getAllDeletedCourseInfos()
          }
          else
            this.$message.error(res.message)
        })
      }).catch(() => {
        this.$message.info('已取消恢复')
      })
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-divider--horizontal {
  margin: 0 0 20px 0;
}

</style>
