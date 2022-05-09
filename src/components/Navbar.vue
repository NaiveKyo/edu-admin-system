<template>
  <div>
    <div class="header">
      <div class="main">
        <div>
          <img src="@/assets/chaoxing-logo.png" alt="logo">
        </div>
        <ul>
          <router-link to="/runtime" tag="li">运行监控</router-link>
          <router-link to="/manage" tag="li">泛雅管理</router-link>
          <router-link to="/user" tag="li">用户管理</router-link>
          <router-link to="/edu" tag="li">教务课程应用</router-link>
          <router-link to="/application" tag="li">应用管理</router-link>
          <router-link to="/config" tag="li">终端配置</router-link>
          <router-link to="/data-center" tag="li">数据中心</router-link>
        </ul>
        <div class="user-avatar">
          <div>
            <img src="@/assets/chaoke-logo.png" alt="user_avatar">
          </div>
          <div>
            <span> {{ username }} </span>
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      username: '小帅'
    }
  }
}
</script>

<style scoped>
@import "../styles/navbar.css";
</style>
