import {
  ButtonSpinner,
  Button as GluestackButton,
  Text,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type ButtonProps = {
  title: string
  isLoading?: boolean
  variant?: 'solid' | 'outline'
} & ComponentProps<typeof GluestackButton>

export function Button({
  title,
  isLoading = false,
  variant = 'solid',
  ...rest
}: ButtonProps) {
  const isOutlineVariant = variant === 'outline'

  return (
    <GluestackButton
      bg={isOutlineVariant ? '$transparent' : '$green700'}
      rounded="$md"
      w="$full"
      h="$14"
      borderWidth={isOutlineVariant ? '$1' : '$0'}
      borderColor="$green500"
      $active-backgroundColor={isOutlineVariant ? '$gray500' : '$green500'}
      disabled={isLoading}
      {...rest}
    >
      {isLoading && <ButtonSpinner color="$white" />}
      {!isLoading && (
        <Text
          color={isOutlineVariant ? '$green500' : '$white'}
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}
