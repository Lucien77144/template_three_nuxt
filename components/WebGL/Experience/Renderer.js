import Experience from './Experience'

import vertexShader from './Shaders/vertexShader.vert?raw'
import fragmentShader from './Shaders/fragmentShader.frag?raw'
import {
  LinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  NoToneMapping,
  PlaneGeometry,
  RGBAFormat,
  SRGBColorSpace,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'
import { TRANSITIONS } from './Utils/SceneManager'

export default class Renderer {
  /**
   * Constructor
   */
  constructor() {
    // Get elements from experience
    this.experience = new Experience()
    this.config = this.experience.config
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.sceneManager = this.experience.sceneManager
    this.stats = this.experience.stats

    // New elements
    this.instance = null
    this.rt0 = null
    this.rt1 = null
    this.renderMesh = null
    this.context = null
    this.debugFolder = null
    this.clearColor = {
      color: '#ff0000',
      alpha: 1,
    }

    // Init
    this._init()
  }

  /**
   * Set debug
   */
  _setDebug() {
    this.debugFolder = this.debug.addFolder({
      title: 'Renderer',
    })

    this.debugFolder
      .addBinding(this.clearColor, 'color', { view: 'color' })
      .on('change', () => {
        this.instance.setClearColor(this.clearColor.color, 1)
      })

    // Panels
    if (this.stats) {
      this.stats.setRenderPanel(this.context)
    }
  }

  /**
   * Set render targets and mesh
   */
  _setRenderTargets() {
    const size = this.instance.getDrawingBufferSize(new Vector2())
    // this.rt0 = new WebGLRenderTarget(this.config.width, this.config.height, {
    this.rt0 = new WebGLRenderTarget(size.width, size.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: false,
      samples: 4,
    })

    this.rt1 = this.rt0.clone()
  }

  /**
   * Set the render mesh
   */
  _setRenderMesh() {
    this.renderMesh = new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({
        uniforms: {
          uScene1: {
            value: this.rt0.texture,
          },
          uScene2: {
            value: this.rt1.texture,
          },
          uTransition: {
            value: TRANSITIONS.FADE,
          },
          uDuration: {
            value: 1,
          },
          uStart: {
            value: 0,
          },
          uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
      })
    )
  }

  /**
   * Set the renderer instance
   */
  _setInstance() {
    // Renderer
    this.instance = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    // Setters
    this.instance.setClearColor(this.clearColor.color, this.clearColor.alpha)
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // Options
    this.instance.physicallyCorrectLights = true
    this.instance.outputColorSpace = SRGBColorSpace
    this.instance.toneMapping = NoToneMapping
    this.instance.toneMappingExposure = 1

    // Context
    this.context = this.instance.getContext()

    // Debug
    if (this.debug) this._setDebug()

    // Append canvas
    this.experience.targetElement.appendChild(this.instance.domElement)
  }

  /**
   * Render the targets and the mesh
   */
  _renderTargets() {
    // Get elements from experience
    const active = this.sceneManager.active
    const next = this.sceneManager.next

    // Scene1
    this.instance.setRenderTarget(this.rt0)
    this.instance.render(active.scene, active.camera.instance)

    // Transition
    if (next) {
      this.instance.setRenderTarget(this.rt1)
      this.instance.render(next.scene, next.camera.instance)
    }

    // RenderMesh
    this.instance.setRenderTarget(null)
    this.instance.render(this.renderMesh, active.camera.instance)
  }

  /**
   * Init the renderer
   */
  _init() {
    this._setInstance()
    this._setRenderTargets()
    this._setRenderMesh()
  }

  /**
   * Update the renderer
   */
  update() {
    this.stats?.beforeRender()

    this._renderTargets()
    if (this.renderMesh?.material.uniforms.uTime) {
      this.renderMesh.material.uniforms.uTime.value = this.time.elapsed
    }

    this.stats?.afterRender()
  }

  /**
   * Resize the renderer
   */
  resize() {
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)
  }

  /**
   * Destroy the renderer
   */
  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.rt0.dispose()
    this.rt1.dispose()
  }
}
