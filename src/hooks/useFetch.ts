import fetchAPI, { fetchConfigs } from "@/lib/fetch"
import { useEffect, useState } from "react"

const useFetch = <T>(configs: fetchConfigs) => {
    const [data, setData] = useState<T>()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
  
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await fetchAPI(configs)
      if (error) {
        setError(error)
      }
      if (data) {
        setData(data)
      }
      setLoading(false)
    }
  
    useEffect(() => {
      !data && fetchData()
    }, [])
  
    const refetch = () => {
      fetchData()
    }
  
    return { data, error, loading, refetch }
  }
  
  export default useFetch