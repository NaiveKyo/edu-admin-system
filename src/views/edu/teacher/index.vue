<template>
  <div v-if="isShow" class="app-container">
    <div>
      <el-row>
        <el-form :model="queryObj" ref="queryTeacherForm" :inline="true">
          <el-form-item label="所属学院" prop="academyCode" size="small">
            <el-select v-model="queryObj.academyCode" clearable placeholder="学院名称">
              <el-option
                v-for="dict in academyDictionary"
                :key="dict.academyCode"
                :value="dict.academyCode"
                :label="dict.academyName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="gender" size="small">
            <el-select v-model="queryObj.gender" clearable placeholder="性别">
              <el-option
                v-for="dict in genderDictionary"
                :key="dict.code"
                :value="dict.code"
                :label="dict.gender"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索" prop="courseNameOrNo" size="small">
            <el-input
              v-model="queryObj.teacherNoOrName"
              clearable
              placeholder="请输入教师工号或姓名"
              @keyup.enter.native="handleConditionQueryTeacherBtn"
            />
          </el-form-item>
          <el-button type="primary" size="small" plain @click="handleConditionQueryTeacherBtn">筛选</el-button>
          <el-button size="small" type="primary" plain @click="handleResetQueryFormBtn">重置</el-button>
          <el-button style="width: 140px" plain size="small" type="primary" @click="handleGoDeleteTeacherComponentBtn">
            已删除教师信息
          </el-button>
        </el-form>
      </el-row>
      <div>
        <el-divider></el-divider>
      </div>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-button style="width: 160px" type="success" size="medium" @click="handleGoImportTeacherViewBtn">导入教师信息
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button style="width: 160px" type="danger" :disabled="multiple" size="medium" @click="handleBatchRemoveTeacherBtn">批量删除
          </el-button>
        </el-col>
        <el-col :span="3" :offset="12">
          <el-button type="success" size="medium" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-table
          v-loading="loading"
          :data="teacherList"
          style="width: 100%; margin-top: 10px"
          :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}"
          border
          stripe
          max-height="1000px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center"/>
          <el-table-column width="60px" label="序号" type="index" align="center" :index="showTableColumnIndex"/>
          <el-table-column label="教师工号" prop="teacherNo" align="center"/>
          <el-table-column label="教师姓名" prop="teacherName" align="center"/>
          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.teacherGender">女</span>
              <span v-else>男</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" prop="teacherAge" align="center"/>
          <el-table-column label="所属院系" prop="academyName" align="center"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDeleteTeacherRecordBtn(scope.row)">删除</el-button>
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
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script>
import academyAPI from "@/api/academy"
import teacherAPI from '@/api/teacher'

export default {
  name: 'Teacher',
  data() {
    return {
      isShow: this.$isShow,
      multipleSelectionTeacherKey: [],
      multiple: true,
      loading: false,
      queryObj: {
        academyCode: '',
        gender: undefined,
        teacherNoOrName: ''
      },
      page: {
        total: 10,
        page: 1,
        limit: 20,
        limitArray: [20, 30, 40, 50]
      },
      academyDictionary: [],
      genderDictionary: [
        {
          gender: '男',
          code: 0
        },
        {
          gender: '女',
          code: 1
        }
      ],
      teacherList: []
    }
  },

  created() {
    this.init()
  },

  methods: {

    // 处理表格行选中事件
    handleSelectionChange(selection) {
      this.multipleSelectionTeacherKey = selection.map(item => item.teacherNo)
      this.multiple = !selection.length
    },

    // 处理分页组件每页条数发生变化的事件
    handleSizeChange(size) {
      this.page.limit = size
      if (this.checkoutQueryParam()) {
        this.queryConditionPageTeacherList()
      } else {
        this.queryPageTeacherList()
      }
    },

    // 处理分页组件页码发生变化的事件
    handleCurrentChange(page) {
      if (this.checkoutQueryParam()) {
        this.queryConditionPageTeacherList(page)
      } else {
        this.queryPageTeacherList(page)
      }
    },

    // 校验查询参数是否有意义
    checkoutQueryParam() {
      const { academyCode, gender, teacherNoOrName } = this.queryObj
      if (academyCode == '' && gender == undefined && teacherNoOrName == '')
        return false

      return true
    },

    // 计算表格行的索引序列号
    showTableColumnIndex(index) {
      return (this.page.page - 1) * this.page.limit + index + 1
    },

    // 初始化数据
    init() {
      this.queryAcademyConditions()
      this.queryPageTeacherList()
    },

    // 获取查询条件: 学院信息
    async queryAcademyConditions() {
      const res = await academyAPI.getConditionAcademyInfos()
      if (res.code === 0) {
        this.academyDictionary = res.data.academyConditions
      } else {
        this.$message.error(res.message)
      }
    },

    // 分页查询教师信息
    async queryPageTeacherList(page = 1) {
      this.page.page = page
      this.loading = true
      const res = await teacherAPI.queryPageTeacherRecords(this.page.page, this.page.limit)
      if (res.code === 0) {
        this.page.total = res.data.total
        this.teacherList = res.data.list
        this.loading = false
      } else {
        this.$message.error(res.message)
      }
    },

    // 分页条件查询教师信息
    async queryConditionPageTeacherList(page = 1) {
      this.page.page = page
      this.loading = true
      const res = await teacherAPI.queryConditionPageTeacherRecords(this.page.page, this.page.limit, this.queryObj)
      if (res.code === 0) {
        this.page.total = res.data.total
        this.teacherList = res.data.list
        this.loading = false
      } else {
        this.$message.error(res.message)
      }
    },

    // 处理点击筛选按钮的回调
    handleConditionQueryTeacherBtn(page = 1) {
      this.queryConditionPageTeacherList()
    },

    // 点击重置按钮
    handleResetQueryFormBtn() {
      this.$refs.queryTeacherForm.resetFields()
      this.queryObj = {
        academyCode: '',
        gender: undefined,
        teacherNoOrName: ''
      }
      this.queryPageTeacherList()
    },

    // 跳转到已删除教师页面
    handleGoDeleteTeacherComponentBtn() {
      this.$router.push('/edu/teacher/list/delete')
    },

    // 跳转到导入教师信息页面
    handleGoImportTeacherViewBtn() {
      // TODO
    },

    // 删除一条教师数据
    handleDeleteTeacherRecordBtn(row) {
      this.$confirm('是否删除选中的教师?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherAPI.deleteSpecifyTeacherByNo(row.teacherNo).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功!')
            this.queryConditionPageTeacherList()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => this.$message.info('已取消删除'))
    },

    // 批量删除
    handleBatchRemoveTeacherBtn() {
      this.$confirm('是否删除选中的所有教师?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherAPI.batchDeleteTeacher(this.multipleSelectionTeacherKey).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功!')
            this.queryConditionPageTeacherList()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => this.$message.info('已取消删除'))
    },

    // 导出 Excel
    exportExcel() {
      // TODO
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-divider--horizontal {
  margin: 0 0 20px 0;
}
</style>
