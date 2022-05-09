<template>
  <div class="box">
    <div class="sidebar">
      <ul>
        <router-link to="#" tag="li">
          <svg-icon icon-class="table"/>
          TODO
        </router-link>
        <router-link to="#" tag="li">
          <svg-icon icon-class="table"/>
          TODO
        </router-link>
        <router-link to="#" tag="li">
          <svg-icon icon-class="table"/>
          TODO
        </router-link>
        <router-link to="#" tag="li">
          <svg-icon icon-class="table"/>
          TODO
        </router-link>
        <router-link to="#" tag="li">
          <svg-icon icon-class="table"/>
          TODO
        </router-link>
      </ul>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserSidebar",
}
</script>

<style scoped>
@import "../styles/sidebar.css";
</style>
