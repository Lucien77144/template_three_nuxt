import { BufferGeometry, Group, InstancedMesh, Material, Object3D } from 'three'
import Experience from '~/webgl/Experience'
import type AbstractScene from './AbstractScene'
import type { Dictionary } from '~/models/functions/dictionary.model'
import type { TAudioParams } from '~/models/utils/AudioManager.model'
import type { ICSS2DRendererStore } from '~/models/stores/cssRenderer.store.model'
import type { TDebugFolder } from '~/models/utils/Debug.model'

/**
 * Item functions type
 */
export type TItemsFn =
  | 'onHold'
  | 'onClick'
  | 'onMouseMove'
  | 'onMouseHover'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onScroll'
  | 'onInitComplete'
  | 'update'
  | 'dispose'

/**
 * @class BasicItem
 *
 * @description Extandable class for items
 *
 * @function init Init function
 * @function onInitComplete After transition init function
 * @function afterSceneInit After the parent scene has been built
 * @function update If set, this function will be called on each tick to update
 * @function onClick If set, this function will be called on click item
 * @function onMouseMove If set, this function will be called on mouse down item
 * @function onMouseHover If set, this function will be called on mouse hover item
 * @function onMouseEnter If set, this function will be called on mouse enter item
 * @function onMouseLeave If set, this function will be called on mouse leave item
 * @function onHold If set, this function will be called on hold item
 * @function onScroll On scroll function
 *
 * @param { AbstractScene } parentScene Parent scene of the item
 * @param { AbstractItem } parentComponent Parent component of the item
 * @param { Group | InstancedMesh | Object3D } item Item that will be added to the three scene
 * @param { Dictionary<AbstractItem> } components Child components of the item
 * @param { Dictionary<TAudioParams> } audios Object of audios to add to the item (positionnal audio)
 * @param { TDebugFolder } debugFolder Debug folder
 * @param { number } holdDuration Duration after hold event is triggered
 * @param { TItemsFn[] } disabledFn Disable any functions of the item
 * @param { Experience } experience Experience reference
 * @param { Experience['debug'] } debug Tweakpane debug reference
 */
export default abstract class AbstractItem {
  // --------------------------------
  // Abstract functions
  // --------------------------------
  /**
   * Init function
   * Automatically called after the constructor
   */
  abstract init(): any
  /**
   * After transition init function
   * Automatically called after the scene has been switched
   */
  abstract onInitComplete(): any
  /**
   * After the parent scene has been built
   */
  abstract afterSceneInit(): any
  /**
   * If set, this function will be called on each tick to update
   * If false, the event will be ignored, even if parent is triggering it
   */
  abstract update(): any
  /**
   * If set, this function will be called on click item
   * If false, the event will be ignored, even if parent is triggering it
   */
  abstract onClick(): any
  /**
   * If set, this function will be called on mouse down item
   * If false, the event will be ignored, even if parent is triggering it
   * @return {Object} - Object with the centered coordinates and the target values
   */
  abstract onMouseMove(): any
  /**
   * If set, this function will be called on mouse hover item
   * If false, the event will be ignored, even if parent is triggering it
   */
  abstract onMouseHover(): any
  /**
   * If set, this function will be called on mouse enter item
   * If false, the event will be ignored, even if parent is triggering it
   */
  abstract onMouseEnter(): any
  /**
   * If set, this function will be called on mouse leave item
   * If false, the event will be ignored, even if parent is triggering it
   */
  abstract onMouseLeave(): any
  /**
   * If set, this function will be called on hold item
   * If false, the event will be ignored, even if parent is triggering it
   */
  abstract onHold(): any
  /**
   * On scroll function
   * If false, the event will be ignored, even if parent is triggering it
   * @param {number} delta - Delta of the scroll
   */
  abstract onScroll(delta: number): any

  // --------------------------------
  // Public properties
  // --------------------------------
  /**
   * Parent scene of the item
   * @description Null in the constructor
   */
  public parentScene?: AbstractScene
  /**
   * Parent component of the item
   * @description Null in the constructor
   */
  public parentComponent?: AbstractItem
  /**
   * Item that will be added to the three scene
   */
  public item: Object3D
  /**
   * Child components of the item
   * @description Will replace item by a group (including item) and add components to it
   */
  public components: Dictionary<AbstractItem>
  /**
   * Object of audios to add to the item (positionnal audio)
   */
  public audios?: Dictionary<TAudioParams>
  /**
   * Debug folder
   */
  public debugFolder?: TDebugFolder
  /**
   * Duration after hold event is triggered
   */
  public holdDuration: number
  /**
   * Disable any functions of the item
   * @description Array of functions to disable
   */
  public disabledFn: TItemsFn[]
  /**
   * Ignore any functions of the item
   * @description Array of functions to disable, instead of disabledFn, this will not disable the function for child components.
   */
  public ignoredFn: TItemsFn[]

  // --------------------------------
  // Protected properties
  // --------------------------------
  /**
   * Experience reference
   */
  protected experience: Experience
  /**
   * Tweakpane debug reference
   */
  protected debug: Experience['debug']

  // --------------------------------
  // Public methods
  // --------------------------------
  /**
   * Constructor
   */
  constructor() {
    // Protected
    this.experience = new Experience()
    this.debug = this.experience.debug

    // Public
    this.item = new Group()
    this.components = {}
    this.holdDuration = 1000
    this.disabledFn = []
    this.ignoredFn = []
  }

  /**
   * Add CSS2D to the item
   * @param {ICSS2DRendererStore} item
   */
  public addCSS2D(item: ICSS2DRendererStore) {
    this.parentScene?.addCSS2D(item)
  }

  /**
   * Add CSS3D to the item
   * @param {ICSS2DRendererStore} item
   */
  public addCSS3D(item: ICSS2DRendererStore) {
    this.parentScene?.addCSS3D(item)
  }

  /**
   * Remove CSS2D element
   * @param {string} id
   */
  public removeCSS2D(id: string) {
    this.parentScene?.removeCSS2D(id)
  }

  /**
   * Remove CSS3D element
   * @param {string} id
   */
  public removeCSS3D(id: string) {
    this.parentScene?.removeCSS3D(id)
  }

  /**
   * Build instanced mesh
   * @param {BufferGeometry} geometry Geometry of the item
   * @param {TMaterial} material Material of the item
   * @param {any} list List of items to instance, with position and rotation
   * @returns {InstancedMesh} Instanced mesh
   */
  public buildInstancedMesh(
    geometry: BufferGeometry,
    material: Material,
    list: any[]
  ): InstancedMesh {
    const item = new InstancedMesh(geometry, material, list.length)

    const obj = new Object3D()
    list.forEach((el, i) => {
      if (el.position) {
        obj.position.set(el.position.x, el.position.y, el.position.z)
      }

      if (el.rotation) {
        obj.rotation.set(el.rotation.x, el.rotation.y, el.rotation.z)
      }

      if (el.scale) {
        obj.scale.set(el.scale.x, el.scale.y, el.scale.z)
      }

      obj.updateMatrix()
      item.setMatrixAt(i, obj.matrix)
    })

    item.instanceMatrix.needsUpdate = true

    return item
  }

  /**
   * Dispose function to remove the item
   * @warn super.dispose() is needed in the child class
   */
  public dispose() {
    // Debug
    this.debugFolder && this.debug?.panel?.remove?.(this.debugFolder)
  }
}
