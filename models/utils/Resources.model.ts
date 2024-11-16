import type { CanvasTexture, Texture } from 'three'
import type { Group } from 'three'
import type { BufferGeometry } from 'three'
import type { DataTexture } from 'three'
import type { Dictionary } from '../functions/dictionary.model'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import type { Font } from 'three/examples/jsm/loaders/FontLoader'

/**
 * Type for the file extensions
 */
export type TExtension =
  | 'jpg'
  | 'png'
  | 'svg'
  | 'json'
  | 'webp'
  | 'exr'
  | 'drc'
  | 'glb'
  | 'gltf'
  | 'fbx'
  | 'hdr'
  | 'mp4'
  | 'm4a'
  | 'mp3'
  | 'ogg'
  | 'wav'
  | 'lottie'
  | 'font'

export type TResourceData =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLAudioElement
  | DataTexture
  | Texture
  | BufferGeometry
  | GLTF
  | Group
  | CanvasTexture
  | Font

/**
 * Type for the resource item
 */
export type TResourceItem = {
  source: string
  name: string
  type: string
  id: string
  subtitles?: Dictionary<string>
  data?: any
}

/**
 * Type for the resource loader
 */
export type TLoader = {
  extensions: Array<TExtension>
  action: (resource: TResourceItem) => void
}

/**
 * Type for the resource group
 */
export type TResourceGroup = {
  name: string
  items: Array<TResourceItem>
  loaded?: number
  total?: number
  data?: any
  toLoad?: Array<TResourceItem>
}

/**
 * Type for the resource file
 */
export type TResourceFile = {
  resource: TResourceItem
  data: TResourceData
}
