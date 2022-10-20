/* eslint-disable import/prefer-default-export */
import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://ustbhuangyi.com/music-next/' : '/'

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
    })
    .catch((e) => {
      console.log(e)
    })
}

export { get }
