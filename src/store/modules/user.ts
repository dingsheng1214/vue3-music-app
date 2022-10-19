import { defineStore } from 'pinia'

export interface UserInfo {
  userId: string | number
  username: string
  realName: string
  avatar: string
  desc?: string
  homePath?: string
}

export interface UserState {
  userInfo: UserInfo
  token?: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: {
      userId: '',
      username: '',
      realName: '',
      avatar: '',
    },
    token: '',
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo
    },
    getToken(): string {
      return this.token || ''
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token // for null or undefined value
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info
    },
  },
})
