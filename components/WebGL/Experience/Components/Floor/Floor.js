import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

export default class Floor {
  /**
   * Constructor
   */
  constructor() {
    // New elements
    this.geometry = null
    this.material = null
    this.item = null

    // Init
    this._init()
  }

  /**
   * Get geometry
   */
  _setGeometry() {
    this.geometry = new PlaneGeometry(10, 10)
  }

  /**
   * Get material
   */
  _setMaterial() {
    this.material = new MeshBasicMaterial({ color: 0x00ff00 })
  }

  /**
   * Get mesh
   */
  _setMesh() {
    this.item = new Mesh(this.geometry, this.material)

    this.item.rotation.x = -Math.PI / 2
    this.item.position.y = -3
  }

  /**
   * Init the floor
   */
  _init() {
    this._setGeometry()
    this._setMaterial()
    this._setMesh()
  }

  /**
   * Update the floor
   */
  update() {}

  /**
   * Dispose the floor
   */
  dispose() {
    this.item.dispose()
  }
}
