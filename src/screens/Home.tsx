import { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { Heading, HStack, VStack, Text, useToast } from '@gluestack-ui/themed'
import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { ToastMessage } from '@components/ToastMessage'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { Loading } from '@components/Loading'

export function Home() {
  const toast = useToast()
  const [exercises, setExercises] = useState<Array<ExerciseDTO>>([])
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState<string>('antebraço')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  const handleOpenExerciseDetails = (exerciseId: string) => {
    navigate('exercise', { exerciseId })
  }

  const fetchGroups = useCallback(async () => {
    try {
      const response = await api.get('/groups')

      setGroups(response?.data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error?.message
        : 'Não foi possível carregar os grupos musculares'

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
    }
  }, [toast])

  const fetchExercisesByGroup = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await api.get(
        `/exercises/bygroup/${groupSelected?.toLowerCase()}`,
      )

      setExercises(response?.data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error?.message
        : 'Não foi possível carregar os exercícios'

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
  }, [groupSelected, toast])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [fetchExercisesByGroup]),
  )

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <Group
            name={item}
            onPress={() => setGroupSelected(item)}
            isActive={
              String(item).toLowerCase() === groupSelected?.toLowerCase()
            }
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {isLoading && <Loading />}

      {!isLoading && (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" mb="$5" alignItems="center">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>
            <Text color="$gray200" fontSize="$sm" fontFamily="$body">
              {exercises?.length}
            </Text>
          </HStack>
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  )
}
