import {
	ACESFilmicToneMapping,
	Color,
	PerspectiveCamera,
	ShaderMaterial,
	SRGBColorSpace,
	Uniform,
	WebGLRenderer,
} from 'three'
import Experience from '../../Experience'
import type { FolderApi } from '@tweakpane/core'
import type Debug from '~/webgl/Core/Debug'
import { EffectComposer, ShaderPass } from 'postprocessing'
import vertexShader from './shaders/vertexShader.vert?raw'
import fragmentShader from './shaders/fragmentShader.frag?raw'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

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
	public camera!: PerspectiveCamera
	public context!: WebGL2RenderingContext
	public debugFolder?: FolderApi
	public clearColor: TClearColor
	public fullScreenQuad!: FullScreenQuad
	public renderShader!: ShaderMaterial
	public shaderPass!: ShaderPass

	// Private
	#experience: Experience
	#viewport: Experience['viewport']
	#debug: Experience['debug']
	#stats?: Debug['stats']

	/**
	 * Constructor
	 * @param options Options
	 * @param options.clearColor Clear color
	 */
	constructor(
		options: {
			clearColor?: TClearColor
		} = {}
	) {
		// Public
		this.clearColor = options.clearColor ?? DEFAULT_CLEAR_COLOR

		// Private
		this.#experience = new Experience()
		this.#viewport = this.#experience.viewport
		this.#debug = this.#experience.debug
		this.#stats = this.#debug?.stats

		// Init
		this.#init()
	}

	/**
	 * Get the scene manager
	 */
	get #sceneManager() {
		return this.#experience.sceneManager
	}

	/**
	 * Get the render list
	 */
	get #renderList() {
		return this.#sceneManager.renderList
	}

	// --------------------------------
	// Workflow
	// --------------------------------

	/**
	 * Set debug
	 */
	#setDebug() {
		if (!this.#debug) return

		this.debugFolder = this.#debug.panel.addFolder({
			expanded: false,
			title: 'Renderer',
		})

		this.debugFolder
			.addBinding(this.clearColor, 'color', { view: 'color' })
			.on('change', () =>
				this.instance.setClearColor(new Color(this.clearColor.color))
			)

		this.debugFolder
			.addBinding(this.clearColor, 'alpha', {
				label: 'Alpha',
				min: 0,
				max: 1,
				step: 0.01,
			})
			.on('change', () => this.instance.setClearAlpha(this.clearColor.alpha))

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
	}

	/**
	 * Set the camera instance ONLY USED TO RENDER THE SCENE ON THE MESH
	 */
	#setCamera() {
		this.camera = new PerspectiveCamera(
			75,
			this.#viewport.width / this.#viewport.height,
			0.1,
			100
		)
	}

	/**
	 * Set the renderer instance
	 */
	#setInstance(canvas?: HTMLCanvasElement) {
		// Renderer
		this.instance = new WebGLRenderer({
			canvas,
			antialias: true,
			stencil: false,
			alpha: true,
			powerPreference: 'high-performance',
		})

		// Setters
		this.instance.setClearColor(this.clearColor.color, this.clearColor.alpha)
		this.instance.setSize(this.#viewport.width, this.#viewport.height)
		this.instance.setPixelRatio(this.#viewport.dpr)

		// Options
		this.instance.toneMapping = ACESFilmicToneMapping
		this.instance.toneMappingExposure = 1.5
		this.instance.outputColorSpace = SRGBColorSpace

		// Context
		this.context = this.instance.getContext() as WebGL2RenderingContext
	}

	/**
	 * Set the post processing
	 */
	#setPostProcessing() {
		// Set render shader
		this.renderShader = new ShaderMaterial({
			uniforms: {
				tDiffuse: new Uniform(null),
			},
			vertexShader,
			fragmentShader,
			transparent: true,
		})

		// Set shader pass
		this.shaderPass = new ShaderPass(this.renderShader)

		// Set composer
		this.composer = new EffectComposer(this.instance, {
			alpha: true,
		})
		this.composer.addPass(this.shaderPass)
	}

	/**
	 * Render the targets and the mesh
	 */
	#render() {
		// Clear the render target
		this.instance.setRenderTarget(null)
		this.instance.clear()

		// Render each scene from the render list
		this.#renderList.forEach((instance) => {
			if (instance.camera?.instance) {
				// Trigger before render
				instance.trigger('beforeRender')

				// Set the render target & render scene
				this.instance.setRenderTarget(instance.rt)
				this.instance.clear()
				this.instance.render(instance.scene, instance.camera.instance)

				// Render shader of the scene
				instance.shader?.render()

				// Render transition
				const transition = instance.transition
				if (transition?.isActive) {
					transition.render()
				}

				// Trigger after render
				instance.trigger('afterRender')
			}
		})

		// Update shader uniforms with active scene render target
		const active = this.#sceneManager.active
		if (active?.rt) {
			this.renderShader.uniforms.tDiffuse.value = active.rt.texture
		}

		// Render final composition
		this.instance.setRenderTarget(null)
		this.composer.render()
	}

	// --------------------------------
	// Lifecycle
	// --------------------------------

	/**
	 * Init the renderer
	 */
	#init() {
		this.#setCamera()
		this.#setInstance(this.#experience.canvas)

		// Set post processing
		this.#experience.resources.on('ready', () => this.#setPostProcessing())

		// Debug
		if (this.#debug) this.#setDebug()
	}

	/**
	 * Update the renderer
	 */
	public update() {
		this.#stats?.beforeRender()
		this.#render()
		this.#stats?.afterRender()
	}

	/**
	 * Resize the renderer
	 */
	public resize() {
		this.camera.aspect = this.#viewport.width / this.#viewport.height
		this.camera.updateProjectionMatrix()
		this.instance.setSize(this.#viewport.width, this.#viewport.height)
		this.instance.setPixelRatio(this.#viewport.dpr)
	}

	/**
	 * Dispose the renderer
	 */
	public dispose() {
		this.instance.renderLists.dispose()
		this.instance.dispose()
	}
}
