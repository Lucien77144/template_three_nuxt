import {
  Camera,
  Group,
  Object3D,
  Scene,
  Vector2,
  type Intersection,
} from 'three'
import AbstractCamera from './AbstractCamera'
import Experience from '~/webgl/Experience'
import gsap from 'gsap'
import CSS2DManager from '~/webgl/Utils/CSS2DManager'
import CSS3DManager from '~/webgl/Utils/CSS3DManager'
import type { Dictionary } from '~/models/functions/dictionary.model'
import type AbstractItem from './AbstractItem'
import type { TItemsFn } from './AbstractItem'
import type { TAudioParams } from '~/models/utils/AudioManager.model'
import { defined } from '~/utils/functions/defined'
import type {
  ICSS2DRendererStore,
  ICSS3DRendererStore,
} from '~/models/stores/cssRenderer.store.model'
import type { TDebugFolder } from '~/models/utils/Debug.model'
import BasicPerspectiveCamera from '../Camera/BasicPerspectiveCamera'

/**
 * @class BasicScene
 *
 * @description Extendable class for scenes
 *
 * @function init Protected init function, automatically called after constructor
 * @function onInitComplete After switch between scene complete and this scene is the new one
 * @function onAfterRender After the scene has been built and rendered completely one time
 * @function onDisposeStart On transition start, before the dispose
 * @function update Update function called each frame
 * @function resize Resize function called on window resize
 * @function dispose Dispose function to clean up the scene
 * @function onScroll On scroll function
 * @function onMouseDownEvt Raycast on mouse down
 * @function onMouseUpEvt Raycast on mouse up
 * @function onMouseMoveEvt Raycast on mouse move
 *
 * @param {Scene} scene Three.js scene
 * @param {AbstractCamera} camera Camera instance
 * @param {Dictionary<AbstractItem>} components Scene components
 * @param {Dictionary<AbstractItem>} allComponents Flattened components including nested ones
 * @param {Dictionary<TAudioParams>} audios Object of audios to add to the scene
 * @param {string} name Scene name
 * @param {boolean} wireframe Wireframe mode
 * @param {AbstractItem} hovered Currently hovered item
 * @param {AbstractItem} holded Currently held item
 * @param {gsap.core.Tween} holdProgress Hold progress animation
 * @param {Experience} experience Experience reference
 * @param {Experience['cursorManager']} cursorManager Cursor manager reference
 * @param {Experience['store']} store Store reference
 * @param {Experience['raycaster']} raycaster Raycaster reference
 * @param {Experience['$bus']} $bus Event bus reference
 * @param {Experience['debug']} debug Debug reference
 */
export default abstract class AbstractScene {
  // Readonly properties
  /**
   * Scene name
   */
  readonly name: string

  // Public properties
  /**
   * Three.js scene
   */
  public scene: Scene
  /**
   * BasicCamera instance
   */
  public camera: AbstractCamera
  /**
   * Scene components
   */
  public components: Dictionary<AbstractItem>
  /**
   * Flattened components including nested ones
   */
  public allComponents: Dictionary<AbstractItem>
  /**
   * Object of audios to add to the scene
   */
  public audios: Dictionary<TAudioParams>
  /**
   * Wireframe mode for the entire scene
   */
  public wireframe: boolean
  /**
   * Currently hovered item
   */
  public hovered?: AbstractItem
  /**
   * Currently held item
   */
  public holded?: AbstractItem
  /**
   * Hold progress animation
   */
  public holdProgress?: gsap.core.Tween
  /**
   * Debug folder
   */
  public debugFolder?: TDebugFolder
  /**
   * On scroll function
   * @param {number} delta - Delta of the scroll
   */
  abstract onScroll(delta: number): any
  /**
   * On transition start, before the dispose
   */
  abstract onDisposeStart(): any
  /**
   * After the scene has been built and rendered completely one time
   */
  abstract onAfterRender(): any

  // Protected properties
  /**
   * Experience reference
   */
  protected experience: Experience
  /**
   * Cursor manager reference
   */
  protected cursorManager: Experience['cursorManager']
  /**
   * Store reference
   */
  protected store: Experience['store']
  /**
   * Raycaster reference
   */
  protected raycaster: Experience['raycaster']
  /**
   * Event bus reference
   */
  protected $bus: Experience['$bus']
  /**
   * Debug reference
   */
  protected debug: Experience['debug']

  // Private properties
  private _css2dManager?: CSS2DManager
  private _css3dManager?: CSS3DManager

  // Private Handlers
  private _handleMouseDownEvt: (e: TCursorEvent) => void
  private _handleMouseUpEvt: (e: TCursorEvent) => void
  private _handleMouseMoveEvt: (e: TCursorEvent) => void
  private _handleScrollEvt: (e: TCursorEvent) => void

  /**
   * Constructor
   */
  constructor() {
    // Protected
    this.experience = new Experience()
    this.cursorManager = this.experience.cursorManager
    this.store = this.experience.store
    this.raycaster = this.experience.raycaster
    this.debug = this.experience.debug
    this.$bus = this.experience.$bus

    // Public
    this.scene = new Scene()
    this.camera = new BasicPerspectiveCamera()
    this.allComponents = {}
    this.name = this.constructor.name
    this.wireframe = false

    // Events
    this._handleMouseDownEvt = this.onMouseDownEvt.bind(this)
    this._handleMouseUpEvt = this.onMouseUpEvt.bind(this)
    this._handleMouseMoveEvt = this.onMouseMoveEvt.bind(this)
    this._handleScrollEvt = this.onScrollEvt.bind(this)

    this.components = {}
    this.audios = {}
  }

  // --------------------------------
  // Public Functions
  // --------------------------------

  /**
   * Add CSS2D to the item
   * @param {ICSS2DRendererStore} item
   */
  public addCSS2D(item: ICSS2DRendererStore) {
    this._css2dManager ??= new CSS2DManager(this.scene, this.camera.instance)

    this.store.css2DList.push({
      ...item,
      classList: (item.classList ?? '') + ' ' + this.name,
    })
  }

  /**
   * Add CSS3D to the item
   * @param {ICSS3DRendererStore} item
   */
  public addCSS3D(item: ICSS3DRendererStore) {
    this._css3dManager ??= new CSS3DManager(this.scene, this.camera.instance)

    this.store.css3DList.push({
      ...item,
      classList: (item.classList ?? '') + ' ' + this.name,
    })
  }

  /**
   * remove CSS2D element
   * @param {string} id
   */
  public removeCSS2D(id: string) {
    this.store.css2DList = this.store.css2DList.filter((el) => el.id != id)
  }

  /**
   * remove CSS3D element
   * @param {string} id
   */
  public removeCSS3D(id: string) {
    this.store.css3DList = this.store.css3DList.filter((el) => el.id != id)
  }

  /**
   * Raycast on mouse down
   * @warn super.onMouseDownEvt() is needed in the child class
   */
  public onMouseDownEvt({ centered }: TCursorEvent) {
    // Clicked item
    const clicked = this._getRaycastedItem(centered, ['onClick'])?.item
    this._triggerFn(clicked, 'onClick')

    // Holded item
    this.holded = this._getRaycastedItem(centered, ['onHold'])?.item
    this.holded && this._handleHold()
  }

  /**
   * Raycast on mouse up
   * @warn super.onMouseUpEvt() is needed in the child class
   */
  public onMouseUpEvt() {
    this.resetHolded()
  }

  /**
   * Raycast on mouse move
   * @warn super.onMouseMoveEvt() is needed in the child class
   */
  public onMouseMoveEvt({ centered }: { centered: Vector2 }) {
    // Get hovered item
    const hovered = this._getRaycastedItem(centered, [
      'onMouseEnter',
      'onMouseLeave',
    ])?.item

    // On mouse move event
    this._triggerFn(this, 'onMouseMove', centered)
    Object.values(this.allComponents).forEach((c) =>
      this._triggerFn(c, 'onMouseMove', centered)
    )

    // On mouse hover event
    const mouseHover = this._getRaycastedItem(centered, ['onMouseHover'])
    this._triggerFn(mouseHover?.item, 'onMouseHover', {
      centered,
      target: mouseHover?.target,
    })

    // If mouse leave the hovered item, refresh the hovered item
    if (this.hovered?.item?.id !== hovered?.item?.id) {
      this._triggerFn(this.hovered, 'onMouseLeave')
      this.hovered = hovered
      this._triggerFn(this.hovered, 'onMouseEnter')
    }
    // Get holded item hovered
    const holded = this._getRaycastedItem(centered, ['onHold'])?.item
    // If user leave the hold item, reset the holded item
    if (this.holded?.item?.id !== holded?.item?.id) {
      this.resetHolded()
    }
  }

  /**
   * On scroll event
   * @warn super.onScrollEvt(evt) is needed in the child class
   */
  public onScrollEvt({ delta }: TCursorEvent) {
    this._triggerFn(this, 'onScroll', delta)
    Object.values(this.allComponents).forEach((c) =>
      this._triggerFn(c, 'onScroll', delta)
    )
  }

  /**
   * Reset holded item
   */
  public resetHolded() {
    this.holdProgress?.kill()
    delete this.holded

    const progress = { value: this.store.progress }
    this.holdProgress = gsap.to(progress, {
      value: 0,
      duration: 1 * (progress.value / 100),
      ease: 'easeInOut',
      onUpdate: () => {
        this.store.progress = progress.value
      },
      onComplete: () => {
        setTimeout(() => {
          this.store.progress = 0
          this.holdProgress?.kill()
          delete this.holded
        })
      },
    })
  }

  /**
   * On switch between scene complete and this scene is the new one
   * @warn super.onInitComplete() is needed in the child class
   */
  public onInitComplete() {
    // Trigger onInitComplete on all components
    Object.values(this.allComponents).forEach((c) =>
      this._triggerFn(c, 'onInitComplete')
    )
  }

  /**
   * Update the scene
   * @warn super.update() is needed in the child class
   */
  public update() {
    Object.values(this.allComponents).forEach((c) =>
      this._triggerFn(c, 'update')
    )

    this.camera.update()
    this._css2dManager?.update()
    this._css3dManager?.update()
  }

  /**
   * Resize the scene
   * @warn super.resize() is needed in the child class
   */
  public resize() {
    this.camera.resize()
    this._css2dManager?.resize()
    this._css3dManager?.resize()
  }

  /**
   * Dispose the scene
   * @warn super.dispose() is needed in the child class
   */
  public dispose() {
    // Items
    Object.values(this.allComponents).forEach((c) => {
      this._triggerFn(c, 'dispose')
      this.scene.remove(c.item)
      this.camera.removeAudios(c.audios, true)
    })
    this.allComponents = {}
    this.components = {}
    this.audios = {}

    // Camera
    this.scene.clear()
    this.camera.dispose()
    this._css2dManager?.dispose()
    this._css3dManager?.dispose()

    // Debug
    this.debugFolder && this.debug?.panel.remove(this.debugFolder)

    // Events
    this.$bus.off('mousedown', this._handleMouseDownEvt)
    this.$bus.off('mouseup', this._handleMouseUpEvt)
    this.$bus.off('mousemove', this._handleMouseMoveEvt)
    this.$bus.off('scroll', this._handleScrollEvt)
  }

  // --------------------------------
  // Protected Functions
  // --------------------------------

  /**
   * Init the scene
   * Automatically called after the constructor
   * @warn super.init() is needed in the child class
   */
  protected init() {
    this.allComponents = this._flattenComponents()
    this._addItemsToScene()

    this.debug && this._setDebug()
    this.audios && this.camera.addAudios(this.audios, this.scene)

    this.scene.add(this.camera.instance)
    this._setEvents()

    Object.values(this.allComponents).forEach((c) => c.afterSceneInit?.())
  }

  // --------------------------------
  // Private Functions
  // --------------------------------

  /**
   * Get raycasted item
   * @param {*} centered Coordinates of the cursor
   * @param {*} fn Check available functions in the item
   * @returns Item triggered and target infos
   */
  private _getRaycastedItem(
    centered: TCursorEvent['centered'],
    fn: TItemsFn[] = []
  ): { item: AbstractItem; target: Intersection } | void {
    if (!this.raycaster) return

    this.raycaster.setFromCamera(centered, this.camera.instance as Camera)

    // Filter the components to only get the ones that have the functions in the fn array
    const list = Object.values(this.allComponents).filter((c) => {
      const funcs = fn.filter((f) => {
        return c[f] && !c.disabledFn?.includes(f)
      })
      return funcs.length > 0
    })

    // Get the target object
    const target: Intersection = this.raycaster.intersectObjects(
      list.map((c) => c.item),
      true
    )?.[0]

    // Return the triggered item
    // - If fn not set, use the first parent function available
    // - If fn is set and not ignored, return the item
    const match = list.filter((l) => {
      const ids: number[] = []
      l.item?.traverse((i) => {
        ids.push(i.id)
      })

      const isSet = fn.find((f) => !l.ignoredFn?.includes(f) && defined(l[f]))
      return ids.includes(target?.object?.id) && isSet
    })

    const item: AbstractItem = match[match.length - 1]
    return item && { item, target }
  }

  /**
   * Set debug
   */
  private _setDebug() {
    this.debugFolder = this.debug?.panel?.addFolder({
      expanded: false,
      title: this.name + ' (scene)',
    })

    this.debugFolder.addBinding(this, 'wireframe').on('change', () =>
      this.scene.traverse((c: any) => {
        if (c.isMesh) {
          c.material.wireframe = this.wireframe
        }
      })
    )
  }

  /**
   * Set events
   */
  private _setEvents() {
    this.cursorManager.on('mousedown', this._handleMouseDownEvt)
    this.cursorManager.on('mouseup', this._handleMouseUpEvt)
    this.cursorManager.on('mousemove', this._handleMouseMoveEvt)
    this.cursorManager.on('scroll', this._handleScrollEvt)
  }

  /**
   * Handle hold event
   */
  private _handleHold() {
    if (this.store.progress > 0 || !this.holded) return

    // Manage progression with store
    const progress = { value: this.store.progress }
    this.holdProgress = gsap.to(progress, {
      value: 100,
      duration: this.holded.holdDuration / 1000,
      ease: 'easeInOut',
      onUpdate: () => {
        this.store.progress = progress.value
      },
      onComplete: () => {
        this._triggerFn(this.holded, 'onHold')
        this.resetHolded()
      },
    })
  }

  /**
   * Trigger item function (if not false)
   * @param {*} item Item to trigger
   * @param {*} fn Function to trigger
   * @param {*} arg Argument to pass to the function
   */
  private _triggerFn(item: any, fn: TItemsFn, arg?: any) {
    item?.[fn] && item[fn](arg)
  }

  /**
   * Add items to the scene
   */
  private _addItemsToScene() {
    const items = this._getSceneItems(Object.values(this.components))
    if (items instanceof Object3D) {
      this.scene.add(items)
    }
  }

  /**
   * Get scene items
   * @param i - BasicItem to get the scene items
   * @returns Scene items
   */
  private _getSceneItems(i: AbstractItem | AbstractItem[]): Object3D | void {
    // If the item is an array, create a group
    if (Array.isArray(i)) {
      const res = new Group()
      i.forEach((child) => {
        const item = this._getSceneItems(child)
        item && res.add(item)
      })
      return res
    }

    // If the item has components, add them to a group
    const components = Object.values(i.components || {}) as AbstractItem[]
    if (components.length > 0) {
      const res = new Group()

      // Add the item to the group
      if (i.item) res.add(i.item)
      components.forEach((child) => {
        const item = this._getSceneItems(child)
        item && res.add(item)
      })

      // Add audios to the item if no components
      i.audios && this.camera.addAudios(i.audios, i.item)

      i.item = res
      return i.item
    } else if (i.item) {
      // Add audios to the item if no components
      i.audios && this.camera.addAudios(i.audios, i.item)
      return i.item
    } else {
      return
    }
  }

  /**
   * Flatten components
   * @param c Components to flatten
   * @param parent Parent of the components
   * @returns Flattened components
   */
  private _flattenComponents(
    c: Dictionary<AbstractItem> = this.components,
    parent?: AbstractItem
  ): Dictionary<AbstractItem> {
    let res: Dictionary<AbstractItem> = {}

    Object.keys(c).forEach((key) => {
      const value = c[key]

      if (res[key]) {
        const oldKey = key
        const count = Object.keys(res).filter((r) => r.includes(key)).length
        key = `${key}_${count}`

        const warn_msg = `Component name '${oldKey}' already exists, renamed to '${key}'`
        console.warn(warn_msg)
      }

      if (!value) {
        const warn_msg = `Component ${key} is not defined`
        return console.warn(warn_msg, c)
      }

      value.parentScene = this
      if (parent) {
        value.parentComponent = parent
      }

      value?.init?.()

      if (value?.components) {
        res = {
          ...res,
          ...this._flattenComponents(value.components, value),
        }
      }

      res[key] = value
    })

    return res
  }
}
