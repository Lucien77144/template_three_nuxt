<template>
  <div class="loader">
    <div ref="counter" class="panel">
      <h1>{{ Math.floor(loadValue) }}</h1>
    </div>
    <div ref="panel" class="panel disabled t-25">
      <InterfaceBtn @click="$emit('start')"> Start </InterfaceBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Props
const props = defineProps<{
  loadValue: number
}>()

// Emits
const $emit = defineEmits(['start'])

// Refs
const counter = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)

// Watch if loadValue ends
watch(
  () => props.loadValue == 100,
  () => {
    // hide counter
    counter.value?.classList.add('disabled')
    setTimeout(() => {
      counter.value?.remove()
      panel.value?.classList.remove('disabled')
    }, 500)
  }
)
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
  color: $white;
  font-size: 5rem;
}
.panel {
  z-index: 1000;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100vh;
  transition: 0.5s ease-in-out;

  &.disabled {
    opacity: 0;
  }
}
</style>
