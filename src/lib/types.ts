import { type PayloadType } from './constants'

type ProfilePayload = {
  type: PayloadType.PROFILE_DATA
  payload: {
    fullName: string
    jobTitle: string
    loginEmail: string
    workEmail: string
  }
}

type AvatarPayload = {
  type: PayloadType.PROFILE_AVATAR
  payload: {
    avatarUrl: string
  }
}

export type RootPayload = ProfilePayload | AvatarPayload

export type MemberProfile = {
  fullName: string
  jobTitle: string
  loginEmail: string
  workEmail: string
  avatarUrl: string
}
