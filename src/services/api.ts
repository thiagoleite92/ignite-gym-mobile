import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import axios, { AxiosInstance, AxiosError } from 'axios'

type SignOut = () => void

type PromiseType = {
  onSucess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

type APInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.1.4:3333',
}) as APInstanceProps

let failedQueue: Array<PromiseType> = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError?.response?.data?.message === 'token.expired' ||
          requestError?.response?.data?.message === 'token.invalid'
        ) {
          const { refreshToken } = await storageAuthTokenGet()

          if (!refreshToken) {
            console.log('depois de não encontrar o refresh token')
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequestConfig = requestError.config
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSucess: (token) => {
                  originalRequestConfig.headers.Authorization = `Bearer ${token}`
                  resolve(api(originalRequestConfig))
                },
                onFailure: (error: AxiosError) => reject(error),
              })
            })
          }

          isRefreshing = true

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {
                refresh_token: refreshToken,
              })

              await storageAuthTokenSave({
                token: data?.token,
                refreshToken: data?.refresh_token,
              })

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data,
                )
              }

              originalRequestConfig.headers.Authorization = `Bearer ${data.token}`
              api.defaults.headers.common.Authorization = `Bearer ${data.token}`

              failedQueue.forEach((request) => {
                request.onFailure(data.token)
              })

              resolve(api(originalRequestConfig))
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error)
              })

              reject(error)
            } finally {
              isRefreshing = false
              failedQueue = []
            }
          })
        }

        signOut()
      }

      if (requestError?.response && requestError?.response?.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      } else {
        return Promise.reject(requestError)
      }
    },
  )

  return () => api.interceptors.response.eject(interceptTokenManager)
}

export { api }
