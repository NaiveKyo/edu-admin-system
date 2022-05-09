<template>
  <div class="box">
    <div class="sidebar">
      <ul>
        <router-link to="/edu/course/list" tag="li">
          <svg-icon icon-class="course"/>
          课程信息表管理
        </router-link>
        <router-link to="/edu/teacher/list" tag="li">
          <svg-icon icon-class="teacher"/>
          教师信息表管理
        </router-link>
        <router-link to="/edu/student/list" tag="li">
          <svg-icon icon-class="student"/>
          学生信息表管理
        </router-link>
        <router-link to="/edu/tea-course/list" tag="li">
          <svg-icon icon-class="course_schedule"/>
          教师排课表管理
        </router-link>
        <router-link to="/edu/stu-course/list" tag="li">
          <svg-icon icon-class="student_schedule"/>
          学生选排课表管理
        </router-link>
      </ul>
    </div>
    <div class="container">
      <breadcrumb class="breadcrumb-container" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "./Breadcrumb";
export default {
  name: "EduSidebar",
  components: {
    Breadcrumb
  }
}
</script>

<style scoped>
@import "../styles/sidebar.css";

.breadcrumb-container {
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  font-weight: bold;
  font-size: 20px;
  background-color: white;
}
</style>
