import { z } from 'zod'
import { PayloadType } from './constants'

export const profileSettingsSchema = z.object({
  fullName: z.string().min(2).max(40),
  jobTitle: z.string().min(2).max(30),
  loginEmail: z.string().email().min(2),
  workEmail: z.string().email().min(2),
})

export const ProfileUpdateInput = z.object({
  type: z.literal(PayloadType.PROFILE_DATA),
  payload: profileSettingsSchema,
})

export const AvatarUploadInput = z.object({
  type: z.literal(PayloadType.PROFILE_AVATAR),
  payload: z.object({
    avatarUrl: z.string(),
  }),
})
