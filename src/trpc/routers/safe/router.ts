import { createTRPCRouter } from '@/trpc/api/trpc'
import { addExistingSafeProcedure } from './procedures/add-existing-safe'
import { createSafeProcedure } from './procedures/create-safe'
import { deleteSafeProcedure } from './procedures/delete-safe'
import { getSafesProcedure } from './procedures/get-safes'

export const safeRouter = createTRPCRouter({
  getSafes: getSafesProcedure,
  create: createSafeProcedure,
  addExisting: addExistingSafeProcedure,
  deleteSafe: deleteSafeProcedure,
})
