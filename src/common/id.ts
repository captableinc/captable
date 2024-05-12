import { customAlphabet } from 'nanoid'

export const customId = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyz',
  16,
)

export const generatePublicId = () => customId(12)
