import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
} from '@gluestack-ui/themed'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRouterProps } from '@routes/auth.routes'

type SignUpFormProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().email('E-mail inválido').required('Informe o e-mail'),
  password: yup
    .string()
    .min(6, 'Deve ter no mínimo 6 caracteres')
    .max(10, 'Deve ter no máximo 10 caracteres')
    .required('Informe a senha'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Senhas não conferem')
    .required('Confirme a senha'),
})

export function SignUp() {
  const { navigate } = useNavigation<AuthNavigatorRouterProps>()

  const handleGoToLogin = () => {
    navigate('sign-in')
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormProps>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirm: '',
    },
    resolver: yupResolver(signUpSchema),
  })

  const handleSignUp = ({
    email,
    name,
    password,
    password_confirm: passwordConfirm,
  }: SignUpFormProps) => {
    console.log(email, name, password, passwordConfirm)
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          position="absolute"
        />
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />
            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e seu corpo.
            </Text>
          </Center>
          <Center flex={1} gap="$2">
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors?.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirmar Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                  errorMessage={errors?.password_confirm?.message}
                />
              )}
            />

            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)}
            />
          </Center>

          <Button
            title="Voltar para o login"
            variant="outline"
            mt="$12"
            onPress={handleGoToLogin}
          />
        </VStack>
      </VStack>
    </ScrollView>
  )
}
