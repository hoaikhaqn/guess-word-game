import fetchAPI, { fetchConfigs } from "@/lib/fetch"
import { useEffect, useState } from "react"

const useFetch = <T>(configs: fetchConfigs) => {
    const [data, setData] = useState<T>()
    const [error, setError] = useState<boolean>()
    const [loading, setLoading] = useState(false)
  
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await fetchAPI<T>(configs)
      if (error) {
        setError(true)
      }
      if (data) {
        setData(data)
      }
      setLoading(false)
    }
  
    useEffect(() => {
      !data && fetchData()
    }, [configs.url])
  
    const refetch = () => {
      fetchData()
    }
  
    return { data, error, loading, refetch }
  }
  
  export default useFetch