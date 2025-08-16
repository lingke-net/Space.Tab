import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: { title: 'Aoteam | Lunova Studio' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm,
    meta: { title: '注册' }
  },
  {
    path: '/banned',
    name: 'Banned',
    component: () => import('./views/BannedPage.vue'),
    meta: { title: '账户被封禁' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
    meta: { title: '设置' }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('./views/PrivacyPolicy.vue'),
    meta: { title: '隐私政策' }
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: () => import('./views/TermsOfService.vue'),
    meta: { title: '使用条款' }
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: () => import('./views/AboutUs.vue'),
    meta: { title: '关于我们' }
  },
  {
    path: '/about-version',
    name: 'AboutVersion',
    component: () => import('./views/AboutVersion.vue'),
    meta: { title: '版本信息' }
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('./views/Setup.vue'),
    meta: { title: '欢迎' }
  },
  {
    path: '/quality-content',
    name: 'QualityContent',
    component: () => import('./views/QualityContent.vue'),
    meta: { title: 'Today' }
  },
  {
    path: '/quality-content/:id',
    name: 'SiteDetail',
    component: () => import('./views/SiteDetail.vue'),
    meta: { title: '网站详情' }
  },
  {
    path: '/bilibili-hot',
    name: 'BilibiliHot',
    component: () => import('./views/BilibiliHot.vue'),
    meta: { title: 'B站热门榜' }
  },
  {
    path: '/github-hot',
    name: 'GithubHot',
    component: () => import('./views/GithubHot.vue'),
    meta: { title: 'GitHub热门榜' }
  },
  {
    path: '/hot',
    name: 'Hot',
    component: () => import('./views/Hot.vue'),
    meta: { title: '热门榜单' }
  },
  {
    path: '/dashboard',
    component: () => import('./views/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('./views/Dashboard.vue'),
        meta: { title: '管理仪表盘' }
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import('./views/Settings.vue'),
        meta: { title: '设置'}
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('./views/UserProfile.vue'),
        meta: { title: '用户设置' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('./views/UserManagement.vue'),
        meta: { title: '用户管理' , requiresAdmin: true }
      },
      {
        path: 'permissions',
        name: 'PermissionManagement',
        component: () => import('./views/PermissionManagement.vue'),
        meta: { title: '权限管理' , requiresAdmin: true }
      },
      {
        path: 'audit',
        name: 'AuditManagement',
        component: () => import('./views/AuditManagement.vue'),
        meta: { title: '审核管理' , requiresAdmin: true }
      },
      {
        path: 'about',
        name: 'AboutIndex',
        component: () => import('./views/About-d.vue'),
        meta: { title: '关于' }
      }
    ]
  },
  // 添加一个通配符路由，将所有未匹配的路径重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]