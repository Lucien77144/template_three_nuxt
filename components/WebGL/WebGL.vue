<template>
  <div ref="loaderRef" class="t-25">
    <InterfaceLoader :loadValue="loadValue" @start="startExperience" />
  </div>
  <div ref="expTargetRef" class="exp t-25" style="opacity: 0"></div>
</template>

<script setup lang="ts">
import Experience from './Experience/Experience.js'
import gsap from 'gsap'

// Refs
const loadValue = ref<number>(0)
const expTargetRef = ref<HTMLElement | null>(null)
const loaderRef = ref<HTMLElement | null>(null)

/**
 * Start the experience
 */
const startExperience = () => {
  expTargetRef.value?.style.setProperty('opacity', '1')
  loaderRef.value?.style.setProperty('opacity', '0')
  exp?.start()

  // Remove the ref after transition (.25s)
  setTimeout(() => {
    loaderRef.value?.remove()
  }, 250)
}

// On component mounted, create the experience
let exp: Experience
onMounted(() => {
  // Create the experience
  exp = new Experience({
    targetElement: expTargetRef.value,
  })

  // On resources progress, update loadValue
  const resources: any = exp.resources
  resources.on('progress', () => {
    gsap.timeline().to(loadValue, {
      value: (resources.loaded / resources.toLoad) * 100,
      duration: 1,
      ease: 'power2.inOut',
    })
  })

  // On component unmounted, dispose the experience
  onUnmounted(() => {
    exp?.dispose()
  })
})
</script>

<style>
.t-25 {
  transition: 0.25s ease-in-out;
}

.exp > canvas {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh !important;
  width: 100vw !important;
}
</style>
