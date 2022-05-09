<template>
  <div style="background-color: white" class="app-container">
    <el-row>
      <div style="margin-top: 10px">
        <span>请下载导入模板，填写课程数据后导入，模板样式如下：</span>
        <el-link type="primary" :href="'/static/course_template.xlsx'">点击下载模板文件</el-link>
      </div>
    </el-row>

    <el-row>
      <el-table
        border
        :data="exampleData"
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}">
        <el-table-column label="课程编号" prop="courseNo" align="center"/>
        <el-table-column label="课程名称" prop="courseName" align="center"/>
        <el-table-column label="总学时" prop="coursePeriod" align="center"/>
        <el-table-column label="学分" prop="courseCredit" align="center"/>
        <el-table-column label="所属院系" prop="academyName" align="center"/>
        <el-table-column label="课程类别" prop="courseType" align="center"/>
        <el-table-column label="考试方式" prop="courseExam" align="center"/>
      </el-table>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-upload :action="BASE_API + '/course/upload'"
                 ref="upload"
                 name="course_file"
                 :limit="1"
                 accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                 :on-success="fileUploadSuccess"
                 :on-error="fileUploadError"
                 :before-upload="beforeFileUpload"
      >
        <el-button size="small" type="primary" slot="trigger">上传文件导入</el-button>
      </el-upload>
    </el-row>

    <el-row v-show="showUploading" style="margin-top:20px">
      <div v-loading="loading">
        <svg-icon icon-class="tip"></svg-icon>
        上传正常数据 {{ successCourseList.length }} 条, 异常数据 {{ errorCourseList.length }} 条。
        您可下载异常数据，调整后再将其导入。   <el-link type="primary" :href="BASE_API + '/course/download/error/' + errorToken">点击下载异常数据文件</el-link>
      </div>
      <div style="margin-top: 20px">
        <span>成功导入以下数据:</span>
      </div>
      <el-table
        border
        :data="successCourseList"
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{ background: 'rgba(241,239,239,0.63)', color: 'rgba(26,26,26,0.79)'}">
        <el-table-column label="课程编号" prop="courseNo"/>
        <el-table-column label="课程编号" prop="courseNo" align="center"/>
        <el-table-column label="课程名称" prop="courseName" align="center"/>
        <el-table-column label="总学时" sortable prop="coursePeriod" align="center"/>
        <el-table-column label="学分" sortable prop="courseCredit" align="center"/>
        <el-table-column label="所属院系" prop="academyName" align="center"/>
        <el-table-column label="课程类别" prop="courseType" align="center"/>
        <el-table-column label="考试方式" prop="courseExam" align="center"/>
      </el-table>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "ImportCourse",
  data() {
    return {
      loading: false,
      showUploading: false,
      BASE_API: 'http://localhost:8001',
      errorToken: '',
      exampleData: [
        {
          courseNo: 'kb3521',
          courseName: '《论语导读》',
          coursePeriod: '75',
          courseCredit: '8',
          academyName: '文学院',
          courseType: '必修',
          courseExam: '考试'
        }
      ],
      successCourseList: [],
      errorCourseList: []
    }
  },

  created() {
  },

  methods: {
    // 文件开始上传之前
    beforeFileUpload() {
      this.showUploading = true
      this.loading = true
    },

    // 文件上传成功后的回调
    fileUploadSuccess(response) {
      this.loading = false
      this.$message.success('上传成功')
      this.successCourseList = response.data.success
      this.errorCourseList = response.data.error ? response.data.error : []
      this.errorToken = response.data.errorToken ? response.data.errorToken : ''
      this.$refs.upload.clearFiles()
    },

    // 文件上传失败时的回调
    fileUploadError() {
      this.loading = false
      this.$message.success('上传失败!')
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-divider--horizontal {
  margin: 0 0 20px 0;
}

</style>
