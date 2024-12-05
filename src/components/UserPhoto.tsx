import { Image } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type UserPhotoProps = ComponentProps<typeof Image>
export function UserPhoto({ ...props }: UserPhotoProps) {
  return (
    <Image
      {...props}
      alt={props.alt}
      rounded="$full"
      borderWidth="$2"
      borderColor="$gray400"
      backgroundColor="$gray500"
    />
  )
}
