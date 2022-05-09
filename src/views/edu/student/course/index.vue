<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryObj" ref="queryScheduleForm" :inline="true">
        <el-form-item label="学期">
          <el-select v-model="queryObj.semester" clearable placeholder="学期">
            <el-option
              v-for="dict in semesterDict"
              :key="dict.value"
              :value="dict.value"
              :label="dict.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索" prop="search">
          <el-input v-model="queryObj.search"
                    style="width: 290px"
                    clearable
                    placeholder="请输入课程名称、学生名称、授课教师"
                    @keyup.enter.native="handleConditionSearchBtn"
          />
        </el-form-item>
        <el-button type="primary" @click="handleConditionSearchBtn">筛选</el-button>
        <el-button type="success" @click="handleResetQueryForm">重置</el-button>
      </el-form>
    </el-row>
    <div>
      <el-divider></el-divider>
    </div>
    <el-row>
      <el-button style="width: 160px" type="danger" :disabled="multiple" size="medium"
                 @click="handleBatchRemoveBtn">批量删除
      </el-button>
    </el-row>
    <el-row>
      <el-table
        v-loading="loading"
        :data="scheduleList"
        style="width: 100%; margin-top: 10px"
        :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}"
        border
        stripe
        max-height="1000px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"/>
        <el-table-column label="序号" type="index" align="center" :index="showTableColumnIndex"/>
        <el-table-column label="学生姓名" prop="studentName" align="center"/>
        <el-table-column label="学生学号" prop="studentNo" align="center"/>
        <el-table-column label="课程编号" prop="courseNo" align="center"/>
        <el-table-column label="课程名称" prop="courseName" align="center"/>
        <el-table-column label="教学班级Id(选课课号)" prop="classCode" align="center"/>
        <el-table-column label="教学班级名称" prop="className" align="center"/>
        <el-table-column label="学年" prop="grade" align="center"/>
        <el-table-column label="学期" prop="semester" align="center"/>
        <el-table-column label="教师工号" prop="teacherNo" align="center"/>
        <el-table-column label="教师姓名" prop="teacherName" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDeleteRecordBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="total > 0"
        :current-page="page"
        :total="total"
        :page-size="limit"
        :page-sizes="limitArray"
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
import studentCourseScheduleAPI from "@/api/studentCourseSchedule";

export default {
  name: 'StudentCourse',

  data() {
    return {
      loading: false,
      isShow: this.$isShow,
      selectionKeys: [],
      multiple: true,
      queryObj: {
        semester: undefined,
        search: ''
      },
      page: 1,
      limit: 5,
      limitArray: [5, 10, 20, 30],
      total: 0,
      scheduleList: [],
      semesterDict: [
        {
          key: '2020-2021第一学期',
          value: 1
        },
        {
          key: '2020-2021第二学期',
          value: 2
        }
      ],
    }
  },

  created() {
    this.init()
  },

  methods: {
    // 初始化数据
    init() {
      this.getStudentCourseRecords()
    },

    // 分页查询学生选课记录
    async getStudentCourseRecords(page = 1) {
      this.page = page
      this.loading = true
      const res = await studentCourseScheduleAPI.getPageStudentCourseScheduleRecords(this.page, this.limit)
      this.total = res.data.total
      this.scheduleList = res.data.list
      this.loading = false
    },

    // 分页条件查询学生选课记录
    async getConditionStudentCourseRecords(page = 1) {
      this.page = page
      this.loading = true
      const res = await studentCourseScheduleAPI.getConditionPageStudentCourseScheduleRecords(this.page, this.limit, this.queryObj)
      this.total = res.data.total
      this.scheduleList = res.data.list
      this.loading = false
    },

    // 处理表格行选中的回调
    handleSelectionChange(selection) {
      this.selectionKeys = selection.map(item => item.id)
      this.multiple = !selection.length
    },

    // 生成序号
    showTableColumnIndex(index) {
      return (this.page - 1) * this.limit + index + 1
    },

    handleSizeChange(size) {
      this.page.limit = size
      if (this.checkoutQueryParams()) {
        this.getConditionStudentCourseRecords()
      } else {
        this.getStudentCourseRecords()
      }
    },

    handleCurrentChange(page) {
      if (this.checkoutQueryParams()) {
        this.getConditionStudentCourseRecords(page)
      } else {
        this.getStudentCourseRecords(page)
      }
    },

    // 检查查询参数是否有效
    checkoutQueryParams() {
      const { semester, search } = this.queryObj
      if (semester == undefined && search == '')
        return false
      return true
    },

    // 点击筛选按钮
    handleConditionSearchBtn() {
      this.getConditionStudentCourseRecords()
    },

    // 点击了重置按钮
    handleResetQueryForm() {
      this.$refs.queryScheduleForm.resetFields()
      this.queryObj = {
        semester: undefined,
        search: ''
      }
      this.getConditionStudentCourseRecords()
    },

    // 删除指定选课信息
    handleDeleteRecordBtn(row) {
      this.$confirm('是否删除选中的选课数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentCourseScheduleAPI.removeStudentCourseScheduleRecord(row.id).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！')
            this.getConditionStudentCourseRecords()
          } else {
            this.$message.error('删除失败!')
          }
        })
      }).catch(() => this.$message.info('已取消删除'))
    },

    // 批量删除
    handleBatchRemoveBtn() {
      this.$confirm('是否删除选中的选课数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentCourseScheduleAPI.batchRemoveStudentCourseScheduleRecord(this.selectionKeys).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！')
            this.getConditionStudentCourseRecords()
          } else {
            this.$message.error('删除失败!')
          }
        })
      }).catch(() => this.$message.info('已取消删除'))
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-divider--horizontal {
  margin: 0 0 20px 0;
}

</style>
