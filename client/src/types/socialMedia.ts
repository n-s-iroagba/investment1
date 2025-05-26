export type SocialMedia = {
  id: number
  name: string
  link: string
  logo: string
}

export type SocialMediaCreationDto = {
  name: string
  link: string
  logo: File | string
}
