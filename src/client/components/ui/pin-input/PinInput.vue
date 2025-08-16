<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: String, default: '' },
  length: { type: Number, default: 6 },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const values = ref<string[]>([])
const inputs = ref<(HTMLInputElement | null)[]>([])

watch(
  () => props.modelValue,
  (val) => {
    if (val && val.length === props.length) {
      values.value = val.split('').slice(0, props.length)
    }
  },
  { immediate: true }
)

function onInput(e: Event, idx: number) {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/[^0-9a-zA-Z]/g, '')
  if (props.type === 'number') val = val.replace(/\D/g, '')
  if (val.length > 1) val = val.slice(-1)
  values.value[idx] = val
  emit('update:modelValue', values.value.join(''))
  if (val && idx < props.length - 1) {
    nextTick(() => inputs.value[idx + 1]?.focus())
  }
}

function onKeydown(e: KeyboardEvent, idx: number) {
  if (e.key === 'Backspace' && !values.value[idx] && idx > 0) {
    nextTick(() => inputs.value[idx - 1]?.focus())
  }
}

defineExpose({ focus: () => inputs.value[0]?.focus() })
</script>
<template>
  <div class="flex gap-2">
    <input
      v-for="i in props.length"
      :key="i"
      ref="el => inputs.value[i-1] = el"
      :type="props.type"
      :maxlength="1"
      :disabled="props.disabled"
      class="w-10 h-12 text-2xl text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
      v-model="values[i-1]"
      @input="e => onInput(e, i-1)"
      @keydown="e => onKeydown(e, i-1)"
      autocomplete="one-time-code"
      inputmode="numeric"
    />
  </div>
</template> 