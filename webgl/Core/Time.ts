import EventEmitter from '~/utils/EventEmitter'
import Experience from '../Experience'

export type TTimeEvents = {
	tick: VoidFunction
}

/**
 * Time class
 */
export default class Time extends EventEmitter<TTimeEvents> {
	// Public
	public current: number
	public elapsed: number
	public delta: number
	public playing: boolean
	public enableBus: boolean

	// Private
	#experience: Experience
	private $bus: Experience['$bus']
	#ticker?: number

	/**
	 * Constructor
	 * @param options Options
	 * @param options.enableBus Enable bus to emit (default: false)
	 */
	constructor(options: { enableBus?: boolean } = {}) {
		super()

		// Public
		this.current = Date.now()
		this.elapsed = 0
		this.delta = 16
		this.playing = true
		this.enableBus = !!options.enableBus

		// Private
		this.#experience = new Experience()
		this.$bus = this.#experience.$bus

		// Init
		this.#setTicker()
	}

	/**
	 * Start time
	 */
	public start() {
		this.playing = true
		this.#setTicker()
	}

	/**
	 * Pause time
	 */
	public pause() {
		this.playing = false
		this.#ticker && window.cancelAnimationFrame(this.#ticker)
	}

	/**
	 * Dispose the time
	 */
	public dispose() {
		// Dispose events
		this.disposeEvents()

		// Pause time
		this.pause()
	}

	/**
	 * Set ticker
	 */
	#setTicker(): void {
		this.#ticker = window.requestAnimationFrame(() => this.#tick())
	}

	/**
	 * Update time values
	 */
	#tick() {
		if (!this.playing) return
		this.#setTicker()

		const current = Date.now()

		this.delta = current - this.current
		this.elapsed += this.playing ? this.delta : 0
		this.current = current

		if (this.delta > 60) {
			this.delta = 60
		}

		if (this.playing) {
			this.enableBus && this.$bus?.emit('tick')
			this.trigger('tick')
		}
	}
}
