import { useState, useEffect, useRef, useMemo } from 'react'
import { get } from '../utils/request'

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const e = new Error('Aborted')
      e.name = 'AbortError'
      return reject(e)
    }
    const id = setTimeout(() => {
      if (signal?.removeEventListener) signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    function onAbort() {
      clearTimeout(id)
      const e = new Error('Aborted')
      e.name = 'AbortError'
      reject(e)
    }
    if (signal?.addEventListener) signal.addEventListener('abort', onAbort)
    else if (signal) signal.onabort = onAbort
  })

const fetchSearch = async (params, signal) => {
  try {
    const json = await get('/search', params, { signal })
    return json.data || []
  } catch (error) {
    if (error.name === 'AbortError') {
      return null
    }
    throw error
  }
}

const useFetchData = (initialParams = {}) => {
  const [posts, setPosts] = useState([])
  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const abortControllerRef = useRef(null)

  // 稳定 params 引用，避免无限循环
  const stableParams = useMemo(() => params, [params.q, params.page, params.limit])

  const onReload = async () => {
    setError(null)
    setLoading(true)
    setReloadKey((k) => k + 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current?.abort()
    abortControllerRef.current = controller
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        await sleep(1000, controller.signal)
        if (controller.signal.aborted) return

        const data = await fetchSearch(stableParams, controller.signal)
        if (!controller.signal.aborted && data !== null) {
          setPosts(data)
        }
      } catch (fetchError) {
        if (fetchError && fetchError.name === 'AbortError') {
          return
        }
        if (!controller.signal.aborted) {
          setError(fetchError.message || '请求失败')
          setPosts([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      controller.abort()
    }
  }, [stableParams, reloadKey])

  return {
    posts,
    params,
    setParams,
    loading,
    error,
    onReload,
  }
}

export default useFetchData
