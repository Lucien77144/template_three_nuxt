import {
  ACESFilmicToneMapping,
  Color,
  HalfFloatType,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RGBAFormat,
  SRGBColorSpace,
  ShaderMaterial,
  Uniform,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'
import Experience from '../../Experience'
import vertexShader from './shaders/vertexShader.vert?raw'
import fragmentShader from './shaders/fragmentShader.frag?raw'
import type Debug from '~/webgl/Utils/Debug'
import type { TDebugFolder } from '~/models/utils/Debug.model'
import type { TCursorProps } from '~/utils/class/CursorManager'
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  ShaderPass,
} from 'postprocessing'
import type ExtendableScene from '../Extendables/ExtendableScene'

type TClearColor = {
  color: string
  alpha: number
}

const DEFAULT_CLEAR_COLOR: TClearColor = {
  color: '#C7C6C8',
  alpha: 0,
}

export default class Renderer {
  // Public
  public instance!: WebGLRenderer
  public composer!: EffectComposer
  public passes: {
    active?: RenderPass
    next?: RenderPass
    shader?: ShaderPass
  }
  public camera!: PerspectiveCamera
  public rt0!: WebGLRenderTarget
  public rt1!: WebGLRenderTarget
  public renderShader!: ShaderMaterial
  public context!: WebGL2RenderingContext
  public debugFolder: TDebugFolder
  public clearColor: TClearColor

  // Private
  private _experience: Experience
  private _viewport: Experience['viewport']
  private _debug: Experience['debug']
  private _time: Experience['time']
  private _stats: Debug['stats']
  private $bus: Experience['$bus']
  private _handleMouseMoveEvt: (evt: TCursorProps) => void

  /**
   * Constructor
   */
  constructor(
    _options: {
      clearColor?: TClearColor
    } = {}
  ) {
    // Public
    this.passes = {}
    this.clearColor = _options.clearColor ?? DEFAULT_CLEAR_COLOR

    // Private
    this._experience = new Experience()
    this._viewport = this._experience.viewport
    this._debug = this._experience.debug
    this._time = this._experience.time
    this._stats = this._debug?.stats
    this.$bus = this._experience.$bus

    // Events
    this._handleMouseMoveEvt = this._onMouseMoveEvt.bind(this)

    // Init
    this._init()
  }

  // --------------------------------
  // Workflow
  // --------------------------------

  /**
   * Set debug
   */
  private _setDebug() {
    this.debugFolder = this._debug?.panel.addFolder({
      expanded: false,
      title: 'Renderer',
    })

    this.debugFolder
      .addBinding(this.clearColor, 'color', { view: 'color' })
      .on('change', () => {
        this.instance.setClearColor(
          new Color(this.clearColor.color),
          this.clearColor.alpha
        )
      })

    this.debugFolder.addBinding(this.instance, 'toneMappingExposure', {
      label: 'Tone Mapping Exposure',
      min: 0,
      max: 10,
      step: 0.01,
    })

    this.debugFolder.addBinding(this.instance, 'toneMapping', {
      label: 'Tone Mapping',
      options: {
        None: 0,
        Linear: 1,
        Reinhard: 2,
        Cineon: 3,
        ACESFilmic: 4,
      },
    })

    // Panels
    if (this._stats) {
      this._stats.setRenderPanel(this.context)
    }
  }

  /**
   * Set the camera instance ONLY USED TO RENDER THE SCENE ON THE MESH
   */
  private _setCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this._viewport.width / this._viewport.height,
      0.1,
      100
    )
  }

  /**
   * Raycast on mouse move
   */
  private _onMouseMoveEvt({ centered }: { centered: Vector2 }) {
    this.renderShader.uniforms.uCursor.value = new Vector2(
      centered.x / 2,
      centered.y / 2
    )
  }

  /**
   * Set the render shader
   */
  private _setRenderShader() {
    this.renderShader = new ShaderMaterial({
      uniforms: {
        // Scene gesture
        uScene0: new Uniform(this.rt0?.texture),
        uScene1: new Uniform(this.rt1?.texture),
        uTransition: new Uniform(0),
        uDirection: new Uniform(1),

        // Config
        uTime: new Uniform(0),
        uRatio: new Uniform(this._getVec2Ratio()),
        uResolution: new Uniform(
          new Vector2(this._viewport.width, this._viewport.height)
        ),
        uCursor: new Uniform(new Vector2(0.5)),
      },
      vertexShader,
      fragmentShader,
    })
  }

  /**
   * Set the renderer instance
   */
  private _setInstance(canvas?: HTMLCanvasElement) {
    // Renderer
    this.instance = new WebGLRenderer({
      canvas,
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      alpha: false,
    })

    // Setters
    this.instance.setClearColor(this.clearColor.color, this.clearColor.alpha)
    this.instance.setSize(this._viewport.width, this._viewport.height)
    this.instance.setPixelRatio(this._viewport.dpr)

    // Options
    this.instance.toneMapping = ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.1
    this.instance.outputColorSpace = SRGBColorSpace

    // Context
    this.context = this.instance.getContext() as WebGL2RenderingContext
  }

  /**
   * Set composer
   */
  private _setComposer() {
    this.composer = new EffectComposer(this.instance, {
      frameBufferType: HalfFloatType,
    })

    setTimeout(() => {
      this._experience.sceneManager.on(
        'update:scene',
        (evt: { active: ExtendableScene; next: ExtendableScene }) => {
          console.log(evt)
          this._setComposerPasses(evt.active, evt.next)
        }
      )
    })
  }

  /**
   * Set composer passes
   * @param active Active scene
   * @param next Next scene
   */
  private _setComposerPasses(active: ExtendableScene, next: ExtendableScene) {
    this.composer.removeAllPasses()

    if (active?.scene) {
      this.passes.active = new RenderPass(active.scene, active.camera.instance)
      this.passes.active.renderToScreen = false
      this.composer.addPass(this.passes.active)
    }

    if (next?.scene) {
      this.passes.next = new RenderPass(next.scene, next.camera.instance)
      this.passes.next.renderToScreen = false
      this.composer.addPass(this.passes.next)
    }

    this.passes.shader = new ShaderPass(this.renderShader, 'uScene0')
    this.composer.addPass(this.passes.shader)
  }

  /**
   * Set render targets and mesh
   */
  private _setRenderTargets() {
    const size = this.instance.getDrawingBufferSize(new Vector2())
    this.rt0 = new WebGLRenderTarget(size.width, size.height, {
      generateMipmaps: false,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      samples: 1,
    })
    this.rt1 = this.rt0.clone()
  }

  /**
   * Get the vec2 ratio
   */
  private _getVec2Ratio() {
    const x = this._viewport.width / this._viewport.height
    const y = this._viewport.height / this._viewport.width

    const isH = x > y
    return new Vector2(!isH ? 1 : x, isH ? 1 : y)
  }

  private _renderTargets() {
    this.composer.render(this._time.delta)
  }

  // --------------------------------
  // Lifecycle
  // --------------------------------

  /**
   * Init the renderer
   */
  private _init() {
    this._setCamera()
    this._setInstance(this._experience.canvas)
    this._setRenderShader()
    this._setComposer()
    this._setRenderTargets()
    this.$bus.on('mousemove', this._handleMouseMoveEvt)

    // Debug
    if (this._debug) this._setDebug()
  }

  /**
   * Update the renderer
   */
  public update() {
    this._stats?.beforeRender()

    this.renderShader.uniforms.uTime.value = this._time.elapsed
    this._renderTargets()

    this._stats?.afterRender()
  }

  /**
   * Resize the renderer
   */
  public resize() {
    this.camera.aspect = this._viewport.width / this._viewport.height
    this.camera.updateProjectionMatrix()

    this.instance.setSize(this._viewport.width, this._viewport.height)
    this.instance.setPixelRatio(this._viewport.dpr)

    const size = this.instance.getDrawingBufferSize(new Vector2())
    this.rt0.setSize(size.width, size.height)
    this.rt1.setSize(size.width, size.height)

    this.renderShader.uniforms.uResolution.value = new Vector2(
      this._viewport.width,
      this._viewport.height
    )
    this.renderShader.uniforms.uRatio.value = this._getVec2Ratio()
  }

  /**
   * Dispose the renderer
   */
  public dispose() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.rt0.dispose()
    this.rt1.dispose()
    this.$bus.off('mousemove', this._handleMouseMoveEvt)
  }
}
