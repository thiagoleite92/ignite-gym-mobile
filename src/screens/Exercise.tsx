import { ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
} from '@gluestack-ui/themed'
import { ArrowLeft } from 'lucide-react-native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import Repetitions from '@assets/repetitions.svg'
import { Button } from '@components/Button'

export function Exercise() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

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
            Puxada Frontal
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8">
          <Image
            source={{
              uri: 'https://cdn.awsli.com.br/2168/2168792/produto/144822121/7f7078581c.jpg',
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
                  3 séries
                </Text>
              </HStack>
              <HStack>
                <Repetitions />
                <Text color="$gray200" ml="$2">
                  12 repetições
                </Text>
              </HStack>
            </HStack>

            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
