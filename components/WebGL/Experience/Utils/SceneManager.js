import World from '../Scenes/World'
import World2 from '../Scenes/World2'
import Experience from '../Experience'

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
    this.transitionList = {
      default: World,
    }
    this.active = null
    this.next = null
  }

  /**
   * Switch scene
   */
  switch(destination = 'default', transition = 'default', duration = 1000) {
    if (this.next) return
    this.next = new this.sceneList[destination]()
    this.transition = {
      shaders: this.transitionList[transition],
      duration,
      startTime: this.time.elapsed,
    }

    // {
    //   duration,
    //   startTime: this.time.elapsed,
    // }

    console.log(this.next)
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
    this.active?.update()
  }

  /**
   * Destroy
   */
  destroy() {
    this.active?.destroy()
  }
}
