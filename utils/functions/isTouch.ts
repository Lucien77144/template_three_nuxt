export default function isTouch(): boolean {
	if (typeof window === 'undefined') return false

	return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
