import { createContext, useCallback, useEffect, useState } from 'react'
import { UserDTO } from '../dtos/UserDTO'
import { api } from '@services/api'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser'
import { useToast } from '@gluestack-ui/themed'
import { ToastMessage } from '@components/ToastMessage'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

type AuthContextProviderProps = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const toast = useToast()
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(false)

  const userAndTokenUpdate = async ({
    user: userData,
    token,
  }: {
    user: UserDTO
    token: string
  }) => {
    api.defaults.headers.common.Authorization = 'Bearer ' + token
    setUser(userData)
  }

  const storageUserAndTokenSave = async ({
    user: userData,
    token,
    refreshToken,
  }: {
    user: UserDTO
    token: string
    refreshToken: string
  }) => {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      await storageAuthTokenSave({ token, refreshToken })
    } catch (error) {
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data?.user && data?.token && data?.refresh_token) {
        setIsLoadingUserStorageData(true)

        userAndTokenUpdate(data)
        storageUserAndTokenSave({
          token: data.token,
          refreshToken: data.refresh_token,
          user: data.user,
        })
      }
    } catch (error) {
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
    } finally {
      setIsLoadingUserStorageData(false)
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Sessão encerrada"
            onClose={() => toast.close(id)}
            action="success"
          />
        ),
      })
    }
  }, [toast])

  const loadUserData = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      if (userLogged && token) {
        userAndTokenUpdate({ user: userLogged, token })
      }
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  const updateUserProfile = async (userUpdated: UserDTO) => {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (e) {}
  }

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  const value = {
    user,
    signIn,
    isLoadingUserStorageData,
    signOut,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
