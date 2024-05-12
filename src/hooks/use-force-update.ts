'use client'

import { useCallback, useState } from 'react'

/**
 * Forces a re-render, similar to `forceUpdate` in class components.
 */
export function useForceUpdate() {
  const [, dispatch] = useState(Object.create(null))
  return useCallback(() => {
    dispatch(Object.create(null))
  }, [])
}
