export class ExtendableItemEvents {
  /**
   * Init function of the item
   * Automatically called
   */
  OnInit?(): void

  /**
   * After the parent scene has been fully built
   */
  OnSceneInitComplete?(): void

  /**
   * If set, this function will be called on each tick to update
   * If false, the event will be ignored, even if parent is triggering it
   */
  OnUpdate?(): void

  /**
   * After transition init function
   * Automatically called after the scene has been switched
   */
  OnDispose?(): void

  /**
   * If set, this function will be called on mouse down item
   * If false, the event will be ignored, even if parent is triggering it
   * @return {Object} - Object with the centered coordinates and the target values
   */
  OnMouseMove?(): void

  /**
   * If set, this function will be called on mouse enter item
   * If false, the event will be ignored, even if parent is triggering it
   */
  OnMouseEnter?(): void

  /**
   * If set, this function will be called on mouse hover item
   * If false, the event will be ignored, even if parent is triggering it
   */
  OnMouseHover?(): void

  /**
   * If set, this function will be called on mouse leave item
   * If false, the event will be ignored, even if parent is triggering it
   */
  OnMouseLeave?(): void

  /**
   * On scroll function
   * If false, the event will be ignored, even if parent is triggering it
   * @param {number} delta - Delta of the scroll
   */
  OnScroll?(delta: number): any

  /**
   * If set, this function will be called on click item
   * If false, the event will be ignored, even if parent is triggering it
   */
  OnClick?(): void

  /**
   * If set, this function will be called on hold item
   * If false, the event will be ignored, even if parent is triggering it
   * @param {boolean} success - If the hold was successful
   */
  OnHold?(success: boolean): void
}
