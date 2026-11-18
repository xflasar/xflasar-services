/**
 * Custom smooth scroll with immediate kick-off (easeOutQuart).
 * Starts instantaneously without delay, then glides smoothly to a stop.
 */
export function smoothScrollTo(elementId: string, duration = 480, offset = 0) {
  const target = document.getElementById(elementId)
  if (!target) return

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // easeOutQuart: Instant initial response, smooth deceleration
    const ease = 1 - Math.pow(1 - progress, 4)

    window.scrollTo(0, startPosition + distance * ease)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

