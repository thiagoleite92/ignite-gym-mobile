import {
  Input as GlueStackInput,
  InputField,
  FormControl,
  FormControlErrorText,
  FormControlError,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'
import { TextInput } from 'react-native'

type InputProps = ComponentProps<typeof InputField> & {
  isReadOnly?: boolean
  errorMessage?: string | null
  isInvalid?: boolean
  inputRef?: React.RefObject<TextInput> | null
}

export function Input({
  inputRef,
  errorMessage = null,
  isInvalid = false,
  isReadOnly = false,
  ...rest
}: InputProps) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} w="$full" mb="$4">
      <GlueStackInput
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? '$red600' : '$green500',
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
        isInvalid={isInvalid}
        $invalid={{
          borderWidth: 1,
          borderColor: '$red600',
        }}
      >
        {inputRef && (
          <InputField
            px="$4"
            bg="$gray700"
            color="$white"
            fontFamily="$body"
            placeholderTextColor="$gray300"
            ref={inputRef}
            {...rest}
          />
        )}

        {!inputRef && (
          <InputField
            px="$4"
            bg="$gray700"
            color="$white"
            fontFamily="$body"
            placeholderTextColor="$gray300"
            {...rest}
          />
        )}
      </GlueStackInput>
      <FormControlError>
        <FormControlErrorText>{errorMessage}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}
