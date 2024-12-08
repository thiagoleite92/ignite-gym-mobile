import { ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Box,
  useToast,
  Image,
} from '@gluestack-ui/themed'
import { ArrowLeft } from 'lucide-react-native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import Repetitions from '@assets/repetitions.svg'
import { Button } from '@components/Button'
import { useCallback, useEffect, useState } from 'react'
import { ToastMessage } from '@components/ToastMessage'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const toast = useToast()
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const [sendingExerciseRegister, setSendingExerciseRegister] = useState(false)

  const { exerciseId } = route?.params as RouteParamsProps

  const fetchExerciseDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/exercises/${exerciseId}`)

      setExercise(response?.data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error?.message
        : 'Não foi possível carregar os detalhes do exercício. Tente novamente mais tarde'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }, [exerciseId, toast])

  const handleExerciseHistoryRegister = async () => {
    try {
      setSendingExerciseRegister(true)
      await api.post(`/history`, { exercise_id: exerciseId })

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Exercício finalizado com sucesso."
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      })

      navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error?.message
        : 'Não foi possível finalizar o exercício corretamente. Tente novamente mais tarde'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setSendingExerciseRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [fetchExerciseDetails])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={() => navigate('home')}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise?.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="uppercase">
              {exercise?.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {isLoading && <Loading />}

        {!isLoading && (
          <VStack p="$8">
            <Image
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
              }}
              alt="Exercício"
              mb="$3"
              resizeMode="cover"
              rounded="$lg"
              w="$full"
              h="$80"
            />

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack
                alignItems="center"
                justifyContent="space-between"
                mb="$6"
                mt="$5"
              >
                <HStack>
                  <SeriesSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise?.series}séries
                  </Text>
                </HStack>
                <HStack>
                  <Repetitions />
                  <Text color="$gray200" ml="$2">
                    {exercise?.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={sendingExerciseRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  )
}
