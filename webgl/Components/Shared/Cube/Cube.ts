import type { ScrollManager } from '#imports'
import { BoxGeometry, MathUtils, Mesh, MeshNormalMaterial } from 'three'
import AbstractItem from '~/webgl/Modules/Abstract/AbstractItem'
import { UIBtn } from '#components'

export default abstract class Cube extends AbstractItem {
  private _scrollManager: ScrollManager
  private _geometry?: BoxGeometry
  private _material?: MeshNormalMaterial
  private _mesh?: Mesh

  /**
   * Constructor
   */
  constructor() {
    super()

    // Get elements from experience
    this._scrollManager = this.experience.scrollManager

    // New elements
    this.holdDuration = 2000
    // this.components = {
    //   cube2: new Cube2({
    //     position: { x: 0, y: 0.5, z: 0 },
    //   }),
    // }
  }

  /**
   * Set geometry
   */
  public setGeometry() {
    this._geometry = new BoxGeometry(4, 4, 4)
  }

  /**
   * Set material
   */
  public setMaterial() {
    this._material = new MeshNormalMaterial()
  }

  /**
   * Set mesh
   */
  public setMesh() {
    this._mesh = new Mesh(this._geometry, this._material)
  }

  /**
   * Set item
   */
  public setItem() {
    this.item = this._mesh as Mesh
  }

  /**
   * On hold item
   */
  public onHold() {
    console.log('holded after:', this.holdDuration, 'ms')
  }

  /**
   * On click item
   */
  public onClick() {
    console.log('clicked')
  }

  /**
   * Update the cube
   */
  public update() {
    this.item.rotation.y = MathUtils.lerp(
      this.item.rotation.y,
      this._scrollManager.current * 0.1,
      0.1
    )
  }

  /**
   * Init
   */
  public init(): void {
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setItem()

    this.addCSS3D({
      id: 'test',
      template: UIBtn,
      parent: this.item,
      position: this.item.position,
      data: {
        text: 'Click me',
        onClick: () => this.onClick(),
      },
    })
  }
}
