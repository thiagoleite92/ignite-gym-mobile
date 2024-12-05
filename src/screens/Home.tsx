import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { Heading, FlatList, HStack, VStack, Text } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useState } from 'react'

export function Home() {
  const [exercises, setExercises] = useState([
    'Puxada Frontal',
    'Remada curvada',
    'Remada unilateral',
    'Levantamento Terra',
    'Levantamento Terra',
    'Levantamento Terra',
    'Levantamento Terra',
    'Levantamento Terra',
    'Levantamento Terra',
    'Levantamento Terra',
  ])
  const [groups, setGroups] = useState<string[]>([
    'Costas',
    'Bíceps',
    'Tríceps',
    'Ombros',
  ])
  const [groupSelected, setGroupSelected] = useState<string>('Costas')

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  const handleOpenExerciseDetails = () => {
    navigate('exercise')
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <Group
            name={item as string}
            onPress={() => setGroupSelected(String(item))}
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
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}
