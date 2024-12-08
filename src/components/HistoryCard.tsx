import { HistoryDTO } from '@dtos/HistoryDTO'
import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'

type HistoryCardProps = {
  data: HistoryDTO
}

export function HistoryCard({ data }: HistoryCardProps) {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mb="$3"
      bg="$gray600"
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr="$5" flex={1}>
        <Heading
          color="white"
          fontSize="$md"
          textTransform="capitalize"
          fontFamily="$heading"
          numberOfLines={1}
        >
          {data?.group}
        </Heading>
        <Text color="$gray100" fontSize="$lg" numberOfLines={1}>
          {data?.name}
        </Text>
      </VStack>
      <VStack>
        <Text color="$gray300" fontSize="$md">
          {new Date(data?.created_at).toLocaleDateString('pt-BR', {
            formatMatcher: 'best fit',
          })}
        </Text>
        <Text color="$gray300" fontSize="$md">
          {new Date(data?.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </VStack>
    </HStack>
  )
}
