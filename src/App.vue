<template>
  <div id="app">
    <router-view :key="key" v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reloadAll: this.reloadAll
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  methods: {
    reloadAll() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
