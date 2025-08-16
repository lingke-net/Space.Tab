<script setup lang="ts">
import { ref, computed, watch, nextTick, PropType } from 'vue'
const props = defineProps({
  modelValue: String,
  options: {
    type: Array as PropType<{ value: string, label: string }[]>,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择...'
  },
  by: {
    type: String as PropType<'value' | 'label'>,
    default: 'value'
  }
})
const emit = defineEmits(['update:modelValue'])
const open = ref(false)
const search = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const filteredOptions = computed(() => {
  if (!search.value) return props.options
  return props.options.filter((opt) =>
    opt.label.toLowerCase().includes(search.value.toLowerCase()) ||
    opt.value.toLowerCase().includes(search.value.toLowerCase())
  )
})
const select = (val: string) => {
  emit('update:modelValue', val)
  open.value = false
}
watch(open, (val) => {
  if (val) nextTick(() => inputRef.value?.focus())
})
</script>
<template>
  <div class="relative w-full">
    <div @click="open = !open" class="w-full cursor-pointer">
      <slot name="trigger">
        <div class="border rounded px-3 py-2 flex items-center justify-between bg-white dark:bg-black">
          <span>{{ options.find(opt => opt.value === modelValue)?.label ?? placeholder }}</span>
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </slot>
    </div>
    <div v-if="open" class="absolute z-10 w-full bg-white dark:bg-black border rounded mt-1 shadow-lg">
      <div class="flex items-center px-2 py-1">
        <input ref="inputRef" v-model="search" class="w-full border-0 outline-none bg-transparent py-1" :placeholder="placeholder" />
      </div>
      <ul class="max-h-48 overflow-auto">
        <li v-for="opt in filteredOptions" :key="opt.value" @click="select(opt.value)" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center">
          <slot name="item" :option="opt">
            <span>{{ opt.label }}</span>
            <span v-if="opt.value === modelValue" class="ml-auto text-green-500">✔</span>
          </slot>
        </li>
        <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-400">暂无选项</li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
input::-webkit-input-placeholder { color: #aaa; }
input:-moz-placeholder { color: #aaa; }
input::-moz-placeholder { color: #aaa; }
input:-ms-input-placeholder { color: #aaa; }
</style> 