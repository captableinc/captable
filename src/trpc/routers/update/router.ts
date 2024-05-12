import { createTRPCRouter } from '@/trpc/api/trpc'
import { cloneUpdateProcedure } from './procedures/clone-update'
import {
  getRecipientsProcedure,
  getUpdatesProcedure,
} from './procedures/get-updates'
import { saveUpdateProcedure } from './procedures/save-update'
import {
  shareUpdateProcedure,
  unshareUpdateProcedure,
} from './procedures/share-update'

export const updateRouter = createTRPCRouter({
  save: saveUpdateProcedure,
  get: getUpdatesProcedure,
  getRecipiants: getRecipientsProcedure,
  clone: cloneUpdateProcedure,
  share: shareUpdateProcedure,
  unShare: unshareUpdateProcedure,
})
