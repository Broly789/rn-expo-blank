import { useReducer, useEffect, useRef, useCallback } from 'react'
import { get } from '../utils/request'

// --- Reducer Action Types ---
const ACTIONS = {
  SET_PARAMS: 'SET_PARAMS',
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  RELOAD: 'RELOAD',
}

// --- Initial State ---
const initialState = {
  posts: [],
  params: {},
  loading: false,
  error: null,
  reloadKey: 0,
}

// --- Reducer ---
function fetchReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PARAMS:
      return {
        ...state,
        params: action.payload, // 外部传入完整 params 对象
      }
    case ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null,
      }
    case ACTIONS.FETCH_ERROR:
      return {
        ...state,
        posts: [],
        loading: false,
        error: action.payload,
      }
    case ACTIONS.RELOAD:
      return {
        ...state,
        loading: true,
        error: null,
        reloadKey: state.reloadKey + 1,
      }
    default:
      return state
  }
}

// --- sleep with signal (与原始版本一致) ---
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

// --- fetchSearch (与原始版本一致) ---
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

// --- useFetchDataReducer Hook ---
const useFetchDataReducer = (initialParams = {}) => {
  const [state, dispatch] = useReducer(fetchReducer, {
    ...initialState,
    params: initialParams,
  })

  const abortControllerRef = useRef(null)

  // 稳定的 params 引用（简化：用 JSON 比较决定是否 dispatch）
  // 这里由外部调用 setParams 时 dispatch，因此无需 useMemo

  const setParams = useCallback((paramsOrUpdater) => {
    dispatch({
      type: ACTIONS.SET_PARAMS,
      payload:
        typeof paramsOrUpdater === 'function' ? paramsOrUpdater(state.params) : paramsOrUpdater,
    })
  }, [])

  const onReload = useCallback(() => {
    dispatch({ type: ACTIONS.RELOAD })
  }, [])

  // 核心请求逻辑
  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current?.abort()
    abortControllerRef.current = controller

    ;(async () => {
      try {
        dispatch({ type: ACTIONS.FETCH_START })
        await sleep(1000, controller.signal)
        if (controller.signal.aborted) return

        const data = await fetchSearch(state.params, controller.signal)
        if (!controller.signal.aborted && data !== null) {
          dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data })
        }
      } catch (fetchError) {
        if (fetchError?.name === 'AbortError') return
        if (!controller.signal.aborted) {
          dispatch({
            type: ACTIONS.FETCH_ERROR,
            payload: fetchError.message || '请求失败',
          })
        }
      }
      // finally 中不需要 setLoading(false)，已在 FETCH_SUCCESS / FETCH_ERROR 中处理
    })()

    return () => {
      controller.abort()
    }
  }, [state.params, state.reloadKey])

  return {
    posts: state.posts,
    params: state.params,
    setParams,
    loading: state.loading,
    error: state.error,
    onReload,
  }
}

export default useFetchDataReducer
