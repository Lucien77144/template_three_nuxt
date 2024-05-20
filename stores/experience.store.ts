import type { TSceneInfos } from '~/const/scenes.const'

type TExpStore = {
  active: boolean
  landing: boolean
  scroll: number
  navigation: {
    scene?: TSceneInfos
    start: number // Position of the current scene in %
    scale: number // Scale of the current scene
  }
}

export const useExperienceStore = defineStore('experience', {
  state: (): TExpStore => ({
    active: false,
    landing: true,
    scroll: 0, // 0-100,
    navigation: {
      scene: undefined,
      start: 0,
      scale: 0,
    },
  }),
  getters: {
    getActive(): TExpStore['active'] {
      return this.active
    },
    getLanding(): TExpStore['landing'] {
      return this.landing
    },
    getScroll(): TExpStore['scroll'] {
      return this.scroll
    },
    getNavigation(): TExpStore['navigation'] {
      return this.navigation
    },
  },
  actions: {
    setActive(val: TExpStore['active']) {
      this.active = val
    },
    setLanding(val: TExpStore['landing']) {
      this.landing = val
    },
    setScroll(val: TExpStore['scroll']) {
      this.scroll = val
    },
    setNavigation(val: TExpStore['navigation']) {
      this.navigation = { ...this.navigation, ...val }
    },
  },
})
