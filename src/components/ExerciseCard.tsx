import {
  Text,
  Image,
  HStack,
  VStack,
  Heading,
  Icon,
} from '@gluestack-ui/themed'
import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

type ExerciseCardProps = TouchableOpacityProps
export function ExerciseCard({ ...props }: ExerciseCardProps) {
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
            uri: 'https://cdn.awsli.com.br/2168/2168792/produto/144822121/7f7078581c.jpg',
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
            Barra Fixa
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}
