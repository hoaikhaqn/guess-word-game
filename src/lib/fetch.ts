export type fetchConfigs = {
  method: "GET" | "POST" | "PUT" | "DELETE"
  url: string
  payload?: object | FormData
  headers?: HeadersInit
  next?: NextFetchRequestConfig
  cache?: RequestCache
}

const fetchAPI = async <T>({ method, url, payload, headers, next, cache }: fetchConfigs) => {
  let headerDefault: HeadersInit = {}
  try {
    const res = await fetch(url, {
      method,
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      headers: { ...headerDefault, ...headers },
      next,
      cache
    })
    
    const data: T = await res.json()

    if (res.status < 200 || res.status >= 300) {
      return { data: null, error: data }
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error: true }
  }
}

export default fetchAPI
