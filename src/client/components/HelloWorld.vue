<script setup lang="ts">
import { ref } from "vue"
import { Button } from '@/components/ui/button'

defineProps<{ msg: string }>()

const count = ref(0);
</script>

<template>
  <h1 class="text-5xl font-bold">{{ msg }}</h1>

  <div class="flex flex-col items-center justify-center p-4 bg-gray-100">
    <Button @click="count++" variant="default">count is {{ count }}</Button>
    <p>
      Edit <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
