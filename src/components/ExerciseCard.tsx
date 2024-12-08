import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import {
  Text,
  Image,
  HStack,
  VStack,
  Heading,
  Icon,
} from '@gluestack-ui/themed'
import { ChevronRight } from 'lucide-react-native'

import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { api } from '@services/api'

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDTO
}
export function ExerciseCard({ data, ...props }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...props}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Imagem Exercício"
          w="$16"
          h="$16"
          mr="$4"
          rounded="$md"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {data?.name}
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}
