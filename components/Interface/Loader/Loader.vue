<template>
  <div class="loader">
    <h1 ref="counter">{{ Math.floor(loadValue) }}</h1>
    <InterfaceBtn @click="onClick"> Start </InterfaceBtn>
  </div>
</template>

<script lang="ts" setup>
// Props
const props = defineProps<{
  loadValue: number
}>()

// Emits
const $emit = defineEmits(['start'])

const onClick = () => {
  $emit('start')
}

// Watch if loadValue ends
watch(
  () => props.loadValue == 100,
  () => {
    console.log('Loaded')
  }
)
</script>

<style>
.loader {
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  h1 {
    margin: 0;
    color: white;
    font-family: 'Lato', sans-serif;
    font-size: 5rem;
  }
}
</style>
