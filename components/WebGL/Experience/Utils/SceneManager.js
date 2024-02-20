import World from '../Scenes/World'
import World2 from '../Scenes/World2'
import Experience from '../Experience'

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
      default: World,
      world2: World2,
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
      const duration = this.renderMesh.material.uniforms.uDuration.value
      const start = this.renderMesh.material.uniforms.uStart.value

      if (start + duration < this.time.elapsed) {
        this.active = this.next
        this.next = null
      }
    }

    this.active?.update()
    this.next?.update()
  }

  /**
   * Destroy
   */
  destroy() {
    this.active?.destroy()
    this.next?.destroy()
  }
}
