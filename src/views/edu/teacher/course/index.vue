<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryObj" ref="queryCourseScheduleForm" :inline="true">
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
        <el-form-item label="教学周">
          <el-select v-model="queryObj.weekNum" clearable placeholder="全部">
            <el-option
              v-for="dict in weekNumDict"
              :key="dict.value"
              :value="dict.value"
              :label="dict.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="周几">
          <el-select v-model="queryObj.week" clearable placeholder="全部">
            <el-option
              v-for="dict in weekDict"
              :key="dict.value"
              :value="dict.value"
              :label="dict.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节次">
          <el-select v-model="queryObj.section" clearable placeholder="全部">
            <el-option
              v-for="dict in sectionDict"
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
                    placeholder="请输入课程名称、授课教师、上课地点"
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
        <el-table-column label="课程名称" prop="courseName" align="center"/>
        <el-table-column label="课程编号" prop="courseNo" align="center"/>
        <el-table-column label="教学班级ID" prop="classCode" align="center"/>
        <el-table-column label="教学班级名称" prop="className" align="center"/>
        <el-table-column label="学年" prop="grade" align="center"/>
        <el-table-column label="学期" sortable prop="semester" align="center"/>
        <el-table-column label="第几周" sortable prop="weekNum" align="center"/>
        <el-table-column label="周几" sortable prop="week" align="center"/>
        <el-table-column label="节次" prop="section" align="center"/>
        <el-table-column label="教师工号" prop="teacherNo" align="center"/>
        <el-table-column label="姓名" prop="teacherName" align="center"/>
        <el-table-column label="上课地点" prop="address" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDeleteCourseScheduleRecordBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="page.total > 0"
        :current-page="page.page"
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
import courseScheduleAPI from "@/api/courseSchedule";

export default {
  name: 'TeacherCourse',
  data() {
    return {
      isShow: this.$isShow,
      selectionCourseScheduleKey: [],
      multiple: true,
      loading: false,
      queryObj: {
        semester: undefined,
        weekNum: undefined,
        week: undefined,
        section: '',
        search: ''
      },
      page: {
        total: 10,
        page: 1,
        limit: 5,
        limitArray: [5, 10, 20, 30]
      },
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
      weekNumDict: [
        { key: '第一周', value: 1 },
        { key: '第二周', value: 2 },
        { key: '第三周', value: 3 },
        { key: '第四周', value: 4 },
        { key: '第五周', value: 5 },
        { key: '第六周', value: 6 },
        { key: '第七周', value: 7 },
        { key: '第八周', value: 8 },
        { key: '第九周', value: 9 }
      ],
      weekDict: [
        { key: '星期一', value: 1 },
        { key: '星期二', value: 2 },
        { key: '星期三', value: 3 },
        { key: '星期四', value: 4 },
        { key: '星期五', value: 5 },
        { key: '星期六', value: 6 },
        { key: '星期日', value: 7 },
      ],
      sectionDict: [
        { key: '上午 1-2 节', value: '1-2' },
        { key: '上午 3-4 节', value: '3-4' },
        { key: '下午 5-6 节', value: '5-6' },
        { key: '上午 7-8 节', value: '7-8' }
      ]
    }
  },

  created() {
    this.init()
  },

  methods: {
    // 获取初始数据
    init() {
      this.getCourseScheduleList()
    },

    // 分页获取所有排课数据
    async getCourseScheduleList(page = 1) {
      this.page.page = page
      this.loading = true
      const res = await courseScheduleAPI.getPageCourseScheduleRecords(this.page.page, this.page.limit)
      this.page.total = res.data.total
      this.scheduleList = res.data.list
      this.loading = false
    },

    // 分页条件查询排课数据
    async getConditionCourseScheduleRecords(page = 1) {
      this.page.page = page
      this.loading = true
      const res = await courseScheduleAPI.getConditionPageCourseScheduleRecords(this.page.page, this.page.limit, this.queryObj)
      this.page.total = res.data.total
      this.scheduleList = res.data.list
      this.loading = false
    },

    handleSizeChange(size) {
      this.page.limit = size
      if (this.checkoutQueryParams()) {
        this.getConditionCourseScheduleRecords()
      } else {
        this.getCourseScheduleList()
      }
    },

    handleCurrentChange(page) {
      if (this.checkoutQueryParams()) {
        this.getConditionCourseScheduleRecords(page)
      } else {
        this.getCourseScheduleList(page)
      }
    },

    // 检查查询参数是否有效
    checkoutQueryParams() {
      const { semester, weekNum, week, section, search } = this.queryObj
      if (semester == undefined && weekNum == undefined && week == undefined && section == '' && search == '')
        return false
      return true
    },

    // 处理表格行选中的回调
    handleSelectionChange(selection) {
      this.selectionCourseScheduleKey = selection.map(item => item.id)
      this.multiple = !selection.length
    },

    // 生成序号
    showTableColumnIndex(index) {
      return (this.page.page - 1) * this.page.limit + index + 1
    },

    // 点击筛选按钮
    handleConditionSearchBtn() {
      this.getConditionCourseScheduleRecords()
    },

    // 点击了重置按钮
    handleResetQueryForm() {
      this.$refs.queryCourseScheduleForm.resetFields()
      this.queryObj = {
        semester: undefined,
        weekNum: undefined,
        week: undefined,
        section: '',
        search: ''
      }
      this.getConditionCourseScheduleRecords()
    },

    // 删除指定排课记录
    handleDeleteCourseScheduleRecordBtn(row) {
      this.$confirm('是否删除选中的排课数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseScheduleAPI.deleteCourseScheduleRecordById(row.id).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！')
            this.getConditionCourseScheduleRecords()
          } else {
            this.$message.error('删除失败!')
          }
        })
      }).catch(() => this.$message.info('已取消删除'))
    },

    // 批量删除
    handleBatchRemoveBtn() {
      this.$confirm('是否删除选中的排课数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseScheduleAPI.batchDeleteCourseScheduleRecordById(this.selectionCourseScheduleKey).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！')
            this.getConditionCourseScheduleRecords()
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
