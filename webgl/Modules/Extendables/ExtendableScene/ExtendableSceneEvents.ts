import type { TCursorEvent } from '~/utils/class/CursorManager'

export class ExtendableSceneEvents {
  /**
   * Init function
   */
  public OnInit?(): any

  /**
   * On switch between scene complete and this scene is the new one
   */
  public OnInitComplete?(): any

  /**
   * Update function called each frame
   */
  public OnUpdate?(): any

  /**
   * On transition start, before the dispose
   */
  public OnDisposeStart?(): any

  /**
   * Dispose function to clean up the scene
   */
  public OnDispose?(): any

  /**
   * Resize function called on window resize
   */
  public OnResize?(): any

  /**
   * On scroll function
   * @param {TCursorEvent} evt - Event of the scroll
   */
  public OnScroll?(evt: TCursorEvent): any

  /**
   * On mouse down
   * @param {TCursorEvent} evt - Event of the mouse down
   */
  public OnMouseDown?(evt: TCursorEvent): any

  /**
   * On mouse up
   * @param {TCursorEvent} evt - Event of the mouse up
   */
  public OnMouseUpEvt?(evt: TCursorEvent): any

  /**
   * On mouse move over the scene
   * @param {TCursorEvent} evt - Event of the mouse move
   */
  public OnMouseMove?(evt: TCursorEvent): any
}
