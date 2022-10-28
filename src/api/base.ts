import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://47.105.41.229:9002/' : '/'

axios.defaults.baseURL = baseURL

function get(url: string, params?: Record<string, any>) {
  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      const serverData = res.data
      if (serverData.code === ERR_OK) {
        return serverData.result
      }
      return res.data
    })
    .catch((e) => {
      console.log(e)
    })
}

export { get }
