<template>
  <div class="button">
    <button :type="type" @click="onClick">
      <slot />
    </button>
  </div>
</template>

<script lang="ts" setup>
// Emits
const $emit = defineEmits(['click'])

const onClick = () => {
  $emit('click', $props.value)
}

// Props
const $props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
})
</script>
