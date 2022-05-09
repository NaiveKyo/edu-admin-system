import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/edu',
      name: 'Navbar',
      component: () => import('@/components/Navbar'),
      children: [
        {
          path: 'edu',
          redirect: 'edu/course/list',
          name: 'EduSidebar',
          component: () => import('@/components/EduSidebar'),
          children: [
            {
              path: 'course/list',
              name: 'Course',
              component: () => import('@/views/edu/course/index'),
              meta: { title: '课程信息表管理' },
              children: [
                {
                  path: 'delete',
                  name: 'DeleteCourse',
                  component: () => import('@/views/edu/course/deletecourse'),
                  meta: { title: '已删除课程信息' }
                },
                {
                  path: 'import',
                  name: 'ImportCourse',
                  component: () => import('@/views/edu/course/importcourse'),
                  meta: { title: '导入课程数据' }
                }
              ]
            },
            {
              path: 'teacher/list',
              name: 'Teacher',
              component: () => import('@/views/edu/teacher/index'),
              meta: { title: '教师信息表管理' },
              children: [
                {
                  path: 'delete',
                  name: 'DeleteTeacher',
                  component: () => import('@/views/edu/teacher/deleteteacher'),
                  meta: { title: '已删除教师信息' }
                }
              ]
            },
            {
              path: 'student/list',
              name: 'Student',
              component: () => import('@/views/edu/student/index'),
              meta: { title: '学生信息管理' },
              children: [
                {
                  path: 'delete',
                  name: 'DeleteStudent',
                  component: () => import('@/views/edu/student/deletestudent'),
                  meta: { title: '已删除学生信息' }
                }
              ]
            },
            {
              path: 'tea-course/list',
              name: 'TeacherCourse',
              component: () => import('@/views/edu/teacher/course/index'),
              meta: { title: '教师排课管理' }
            },
            {
              path: 'stu-course/list',
              name: 'StudentCourse',
              component: () => import('@/views/edu/student/course/index'),
              meta: { title: '学生选课管理' }
            }
          ]
        },
        {
          path: 'user',
          name: 'UserSidebar',
          component: () => import('@/components/UserSidebar')
        },
        {
          path: 'application',
          name: 'AppManageSidebar',
          component: () => import('@/components/AppManageSidebar')
        },
        {
          path: 'manage',
          name: 'FayaManageSidebar',
          component: () => import('@/components/FayaManageSidebar')
        },
        {
          path: 'runtime',
          name: 'RuntimeSidebar',
          component: () => import('@/components/RuntimeSidebar')
        },
        {
          path: 'config',
          name: 'ConfigSidebar',
          component: () => import('@/components/ConfigSidebar')
        },
        {
          path: 'data-center',
          name: 'DataCenterSidebar',
          component: () => import('@/components/DataCenterSidebar')
        }
      ]
    }
  ]
})


router.beforeEach((to, from, next) => {

  if (from.fullPath === '/') {
    next()
  }

  if (to.path === '/edu/course/list/delete' || to.path === '/edu/course/list/import') {
    Vue.prototype.$isShow = false
    next()
  }

  if (to.path === '/edu/teacher/list/delete') {
    Vue.prototype.$isShow = false
    next()
  }

  if (to.path === '/edu/student/list/delete') {
    Vue.prototype.$isShow = false
    next()
  }

  if (to.path === '/edu/course/list' || to.path === '/edu/teacher/list' || to.path === '/edu/student/list') {
    Vue.prototype.$isShow = true
    next()
  }

  next()
})

export default router
