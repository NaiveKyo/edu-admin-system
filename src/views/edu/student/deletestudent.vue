<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryObj" ref="queryStudentForm" :inline="true">
        <el-row>
          <el-form-item label="所属学院">
            <el-select v-model="queryObj.academyCode" clearable placeholder="学院名称" @change="handleChoiceAcademy">
              <el-option
                v-for="dict in academyDictionary"
                :key="dict.academyCode"
                :value="dict.academyCode"
                :label="dict.academyName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属专业">
            <el-select v-model="queryObj.majorCode" clearable placeholder="专业名称" @change="handleChoiceMajor">
              <el-option
                v-for="dict in majorDictionary"
                :key="dict.majorCode"
                :value="dict.majorCode"
                :label="dict.majorName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级">
            <el-select v-model="queryObj.classCode" clearable placeholder="班级名称">
              <el-option
                v-for="dict in classDictionary"
                :key="dict.classCode"
                :value="dict.classCode"
                :label="dict.className"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="queryObj.gender" clearable placeholder="性别">
              <el-option
                v-for="dict in genderDictionary"
                :key="dict.code"
                :value="dict.code"
                :label="dict.gender"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="当前年级" prop="grade">
            <el-input
              v-model="queryObj.grade"
              clearable
              placeholder="输入整数，例如 2022"
              @keyup.enter.native="handleSearchStudentBtn"
            />
          </el-form-item>

          <el-form-item label="搜索" prop="studentNameOrNo">
            <el-input
              v-model="queryObj.studentNameOrNo"
              clearable
              placeholder="请输入学号或姓名"
              @keyup.enter.native="handleSearchStudentBtn"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchStudentBtn">筛选</el-button>
            <el-button type="success" @click="handleResetSearchFormBtn">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <div>
      <el-divider></el-divider>
    </div>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-button style="width: 160px" type="danger" :disabled="multiple" size="medium"
                   @click="handleBatchRecoverStudentBtn">批量恢复
        </el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-table
        v-loading="loading"
        :data="studentList"
        style="width: 100%; margin-top: 10px"
        :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}"
        border
        stripe
        max-height="1000px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"/>
        <el-table-column width="60px" label="序号" type="index" align="center" :index="showTableColumnIndex"/>
        <el-table-column label="学生学号" prop="studentNo" align="center"/>
        <el-table-column label="学生姓名" prop="studentName" align="center"/>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.studentGender">女</span>
            <span v-else>男</span>
          </template>
        </el-table-column>
        <el-table-column label="所属院系" prop="academyName" align="center"/>
        <el-table-column label="所属专业" prop="majorName" align="center"/>
        <el-table-column label="所属班级" prop="className" align="center"/>
        <el-table-column label="当前年级" prop="grade" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleRecoverStudentRecordBtn(scope.row)">恢复</el-button>
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
import academyAPI from "@/api/academy"
import studentAPI from "@/api/student"
import majorAPI from "@/api/major"
import classAPI from "@/api/class"

export default {
  name: "DeleteStudent",
  data() {
    return {
      isShow: this.$isShow,
      multipleSelectionStudentKey: [],
      multiple: true,
      loading: false,
      queryObj: {
        academyCode: '',
        majorCode: '',
        classCode: '',
        grade: undefined,
        gender: undefined,
        studentNameOrNo: ''
      },
      page: {
        total: 10,
        page: 1,
        limit: 5,
        limitArray: [5, 10, 20, 30]
      },
      academyDictionary: [],
      majorDictionary: [],
      classDictionary: [],
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
      studentList: []
    }
  },

  created() {
    this.init()
  },

  methods: {
    // 初始化数据
    init() {
      this.initDict()
      this.getStudentRecords()
    },

    initDict() {
      this.getAcademyDict()
      this.getMajorDict()
      this.getClassDict()
    },

    // 获取学院字典
    async getAcademyDict() {
      const res = await academyAPI.getConditionAcademyInfos();
      this.academyDictionary = res.data.academyConditions
    },

    // 获取专业字典
    async getMajorDict() {
      const res = await majorAPI.getMajorDictionary()
      this.majorDictionary = res.data.dict
    },

    // 获取班级字典
    async getClassDict() {
      const res = await classAPI.getClassDictionary()
      this.classDictionary = res.data.dict
    },

    // 分页查询已删除学生信息
    async getStudentRecords(page = 1) {
      this.page.page = page
      this.loading = true
      const res = await studentAPI.queryDeletedStudentRecords(this.page.page, this.page.limit)
      this.page.total = res.data.total
      this.studentList = res.data.list
      this.loading = false
    },

    // 分页条件查询已删除学生信息
    async getConditionStudentRecords(page = 1) {
      this.page.page = page
      this.loading = true
      const res = await studentAPI.queryConditionPageDeletedStudentRecords(this.page.page, this.page.limit, this.queryObj)
      this.page.total = res.data.total
      this.studentList = res.data.list
      this.loading = false
    },

    // 表格行选中事件回调
    handleSelectionChange(selection) {
      this.multipleSelectionStudentKey = selection.map(item => item.studentNo)
      this.multiple = !selection.length
    },

    showTableColumnIndex(index) {
      return (this.page.page - 1) * this.page.limit + index + 1
    },

    // 分页组件每页记录数发生变化
    handleSizeChange(size) {
      this.page.limit = size
      if (this.checkoutQueryParams()) {
        this.getConditionStudentRecords()
      } else {
        this.getStudentRecords()
      }
    },

    // 分页组件页码发生变化
    handleCurrentChange(page) {
      if (this.checkoutQueryParams()) {
        this.getConditionStudentRecords(page)
      } else {
        this.getStudentRecords(page)
      }
    },

    // 校验查询参数是否有意义
    checkoutQueryParams() {
      if (this.queryObj.academyCode == '' && this.queryObj.majorCode == '' && this.queryObj.classCode == '' &&
        this.queryObj.grade == undefined && this.queryObj.gender == undefined && this.queryObj.studentNameOrNo == '') {
        return false
      }
      return true
    },

    // 筛选按钮点击事件
    handleSearchStudentBtn() {
      this.getConditionStudentRecords()
    },

    // 重置按钮点击事件
    handleResetSearchFormBtn() {
      this.$refs.queryStudentForm.resetFields()
      this.queryObj = {
        academyCode: '',
        majorCode: '',
        classCode: '',
        grade: undefined,
        gender: undefined,
        studentNameOrNo: ''
      }
      this.getConditionStudentRecords()
      this.initDict()
    },

    // 学院下拉框变动引起专业信息变动
    async handleChoiceAcademy(academyCode) {
      if (academyCode == undefined || academyCode == '') {
        // 如果被清空就查询所有专业
        this.getMajorDict()
        return
      }
      const res = await academyAPI.queryAcademyOfMajors(academyCode)
      this.majorDictionary = res.data.majorsDict
    },

    // 专业下拉框变化引起班级信息变化
    async handleChoiceMajor(majorCode) {
      if (majorCode == undefined || majorCode == '') {
        this.getClassDict()
        return
      }
      const res = await majorAPI.getMajorOfClass(majorCode)
      this.classDictionary = res.data.classDict
    },

    // 恢复指定学生
    handleRecoverStudentRecordBtn(row) {
      this.$confirm('是否要恢复该学生信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentAPI.recoverStudentByNo(row.studentNo).then(res => {
          if (res.code === 0) {
            this.$message.success('恢复成功!')
            this.getConditionStudentRecords()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => this.$message.info('取消恢复'))
    },

    // 批量恢复学生
    handleBatchRecoverStudentBtn() {
      this.$confirm('是否要恢复选中的所有学生信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentAPI.batchRecoverStudentRecords(this.multipleSelectionStudentKey).then(res => {
          if (res.code === 0) {
            this.$message.success('恢复成功!')
            this.getConditionStudentRecords()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => this.$message.info('取消恢复'))
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-divider--horizontal {
  margin: 0 0 20px 0;
}

</style>
