<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import VersionAvatar from './VersionAvatar.vue'

// 定义props
const props = defineProps({
  sticky: {
    type: Boolean,
    default: false
  }
})

// 获取当前路由
const route = useRoute()

// 判断是否是首页
const isHomePage = computed(() => route.path === '/' || route.path === '/home')

// 是否应该固定在底部
const shouldStick = computed(() => props.sticky || isHomePage.value)

// 获取当前年份
const currentYear = computed(() => new Date().getFullYear())

// 版权信息
const copyright = computed(() => `© ${currentYear.value} Lingke Network.`)

// 版本信息
const version = import.meta.env.VITE_VERSON_ABOUT || '无法加载版本信息'

// 服务器模式
const serverMode = import.meta.env.VITE_ABOUTSERVER || 'none'
</script>

<template>
  <footer class="app-footer" :class="{ 'sticky-footer': shouldStick, 'home-footer': isHomePage }">
    <div class="footer-container">
      <div class="footer-content">
        <div class="copyright">
          {{ copyright }}
        </div>
        <div class="links ">
          <router-link to="/privacy-policy" class="footer-link">隐私</router-link>
          <router-link to="/terms-of-service" class="footer-link">条款</router-link>
          <router-link to="/about-version" class="footer-link">版本</router-link>
          <router-link to="/about-us" class="footer-link">关于</router-link>
        </div>
        <div class="version">
          <router-link to="/about-version">
            <div class="flex items-center">
              <VersionAvatar :mode="serverMode" size="small" />
              <span>V.{{ version }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  padding: 1rem 0;
  background-color: var(--background);
  border-top: 0px solid var(--border, rgba(0, 0, 0, 0.1));
  margin-top: auto;
  position: relative;
}

/* 固定在底部的样式 */
.sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  /*box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);*/
}

/* 首页底栏样式 */
.home-footer {
  background-color: transparent;
}

/* 暗色模式适配 */
:root.dark .home-footer {
  background-color: transparent;
}

/* 首页底栏文字颜色增强 */
.home-footer .footer-content {
  color: rgba(0, 0, 0, 0.7);
}

/* 深色模式下首页底栏文字颜色增强 */
:root.dark .home-footer .footer-content {
  color: rgba(255, 255, 255, 0.8);
}

/* 为固定页脚添加页面底部间距 */
:global(.home-page) {
  padding-bottom: 60px; /* 确保内容不被页脚遮挡 */
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  font-size: 0.875rem;
  color: var(--muted-foreground);
  width: 100%;
}

.copyright {
  text-align: left;
  justify-self: start;
}

.links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.version {
  text-align: right;
  justify-self: end;
}

.footer-link {
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

:root.dark .footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--foreground);
  text-decoration: underline;
}

.version {
  font-size: 0.75rem;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.75rem;
    text-align: center;
  }
  
  .copyright {
    justify-self: center;
    order: 2;
  }
  
  .links {
    justify-self: center;
    order: 1;
    gap: 1rem;
  }
  
  .version {
    justify-self: center;
    order: 3;
  }
}
</style>