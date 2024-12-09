import { HistoryCard } from '@components/HistoryCard'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'
import { Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { useFocusEffect } from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useCallback, useState } from 'react'
import { SectionList } from 'react-native'

export function History() {
  const toast = useToast()
  const [history, setHistory] = useState<HistoryByDayDTO[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/history')

      setHistory(data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error?.message
        : 'Não foi possível carregar o seu histórico.'

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
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, [fetchHistory]),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      {isLoading && <Loading />}

      {!isLoading && history && (
        <SectionList
          sections={history}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3">
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            !history?.length && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <Text color="$gray100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'} Vamos treinar hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  )
}
