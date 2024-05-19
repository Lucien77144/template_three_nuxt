<template>
  <!-- WebGL Front interface to insert component -->
  <div id="webgl-front-interface">
    <Interface />
  </div>
</template>

<script setup lang="ts">
import type Experience from '~/webgl/Experience'

// Props
const { exp } = defineProps<{
  exp: Experience | null
}>()
</script>

<style src="./style.scss" lang="scss" scoped></style>
