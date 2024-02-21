import Experience from '../Experience'
import Scene1 from '../Scenes/Scene1'
import Scene2 from '../Scenes/Scene2'

export const TRANSITIONS = {
  FADE: 0,
}

export default class SceneManager {
  /**
   * Constructor
   */
  constructor() {
    // Get elements from experience
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.time = this.experience.time

    // New elements
    this.sceneList = {
      default: Scene1,
      world2: Scene2,
    }
    this.renderMesh = null
    this.active = null
    this.next = null
  }

  /**
   * Switch scene
   * @param {string} destination Destination scene
   * @param {number} transition Transition type
   * @param {number} duration Transition duration
   */
  switch(
    destination = 'default',
    transition = TRANSITIONS.FADE,
    duration = 2000
  ) {
    if (this.next) return
    this.renderMesh ??= this.experience.renderer.renderMesh

    this.next = new this.sceneList[destination]()
    this.renderMesh.material.uniforms.uTransition.value = transition
    this.renderMesh.material.uniforms.uDuration.value = duration
    this.renderMesh.material.uniforms.uStart.value = this.time.elapsed
  }

  /**
   * Init scene
   * @param {string} _sceneName Scene name
   */
  init(_sceneName = 'default') {
    this.active = new this.sceneList[_sceneName]()
  }

  /**
   * Update
   */
  update() {
    if (this.next) {
      const uniforms = this.renderMesh.material.uniforms
      const duration = uniforms.uDuration.value
      const start = uniforms.uStart.value

      if (start + duration < (this.time.elapsed + 1)) {
        this.active = this.next
        this.next = null
      }
    }

    this.active?.update()
    this.next?.update()
  }

  /**
   * Resize
   */
  resize() {
    this.active?.resize()
    this.next?.resize()
  }

  /**
   * Dispose
   */
  dispose() {
    this.active?.dispose()
    this.next?.dispose()
  }
}
