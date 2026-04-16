import { BACKEND_URL } from './constants'

export function waitForServer(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      fetch(BACKEND_URL)
        .then(() => resolve())
        .catch(() => setTimeout(check, 200))
    }
    check()
  })
}
