import type AbstractScene from '~/webgl/Modules/Abstract/AbstractScene'
import type { TExperienceStore } from '../stores/experience.store.model'

/**
 * Represents scene information.
 */
export type TSceneInfos = {
  id?: number
  isDefault?: boolean
  name?: string
  Scene: { new (): AbstractScene }
  nav?: {
    scale: number
    start?: number
    end?: number
  }
  transition?: {
    duration: number
  }
}

/**
 * Represents a collection of scenes.
 */
export type TScenes = {
  default: TSceneInfos
  list: Array<TSceneInfos>
  nav: {
    list: Array<TSceneInfos>
    total: number
  }
}

/**
 * Represents scene navigation information.
 */
export type TSceneNavigation = {
  scroll?: number
  navigation?: TExperienceStore['navigation']
}
