import { useRef, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Text, Center, VStack, Heading, useToast } from '@gluestack-ui/themed'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { ToastMessage } from '@components/ToastMessage'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { useAuth } from '@hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import defaultUserPhoto from '@assets/userPhotoDefault.png'

type FormProfileProps = {
  name: string
  email: string
  new_password?: string
  old_password?: string
  confirm_new_password?: string
}

const formProfileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  new_password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  confirm_new_password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .when('new_password', {
      is: (field: unknown) => {
        return !!field
      },
      then: (schema) =>
        schema
          .required('Confirme a senha')
          .oneOf(
            [yup.ref('new_password'), ''],
            'A confirmação de senha não confere',
          )
          .transform((value) => value || null),
      otherwise: (schema) =>
        schema
          .notRequired()
          .oneOf(
            [yup.ref('new_password'), ''],
            'A confirmação de senha não confere',
          )
          .transform((value) => value || null),
    }),
})

export function Profile() {
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const oldPasswordRef = useRef<TextInput>(null)
  const newPasswordRef = useRef<TextInput>(null)
  const confirmNewPasswordRef = useRef<TextInput>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProfileProps>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
    resolver: yupResolver(formProfileSchema),
  })

  const handleUserPhotoSelect = async () => {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected?.assets[0]?.uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Imagem muito grande"
                description="O tamanho máximo da imagem é de 5MB"
                onClose={() => toast.close(id)}
                action="error"
              />
            ),
          })
        }
      }

      const fileExtension = photoURI?.split('.').pop()

      const photoFile = {
        name: `${user?.name}.${fileExtension}`?.toLowerCase(),
        uri: photoURI,
        type: `${photoSelected?.assets[0]?.type}/${fileExtension}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any

      const userPhotoUploadForm = new FormData()

      userPhotoUploadForm.append('avatar', photoFile)

      const avatarUpdatedResponse = await api.patch(
        '/users/avatar',
        userPhotoUploadForm,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      toast.show({
        render: ({ id }) => (
          <ToastMessage
            title="Foto atualizada"
            id={id}
            onClose={() => toast.close(id)}
            action="success"
          />
        ),
        placement: 'top',
      })

      const userUpdated = user

      userUpdated.avatar = avatarUpdatedResponse?.data?.avatar
      updateUserProfile(userUpdated)

      setUserPhoto(photoURI)
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdateProfile = async (data: FormProfileProps) => {
    setIsUpdating(true)
    try {
      const { name, new_password: password, old_password: oldPassword } = data

      const userUpdated = user

      await api.put('/users', { name, password, old_password: oldPassword })

      userUpdated.name = name
      await updateUserProfile(userUpdated)

      oldPasswordRef.current?.clear()
      newPasswordRef.current?.clear()
      confirmNewPasswordRef.current?.clear()

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil Atualizado"
            description="Seus dados foram atualizados com sucesso."
            onClose={() => toast.close(id)}
            action="success"
          />
        ),
      })
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error?.message
        : 'Não foi possível atualizar o seu perfil. Tente novamente mais tarde'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            onClose={() => toast.close(id)}
            action="error"
          />
        ),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user?.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaultUserPhoto
            }
            alt="Imagem do Usuário"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  value={value}
                  onChangeText={onChange}
                  textTransform="capitalize"
                  errorMessage={errors?.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  isReadOnly
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors?.email?.message}
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar Senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              name="old_password"
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors?.old_password?.message}
                  inputRef={oldPasswordRef}
                />
              )}
            />

            <Controller
              name="new_password"
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova Senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors?.new_password?.message}
                  inputRef={newPasswordRef}
                />
              )}
            />

            <Controller
              name="confirm_new_password"
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirmar Nova Senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors?.confirm_new_password?.message}
                  inputRef={confirmNewPasswordRef}
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleUpdateProfile)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
