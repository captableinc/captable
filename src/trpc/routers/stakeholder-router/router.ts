import { createTRPCRouter } from '@/trpc/api/trpc'

import { addStakeholdersProcedure } from './procedures/add-stakeholders'
import { getStakeholdersProcedure } from './procedures/get-stakeholders'

export const stakeholderRouter = createTRPCRouter({
  addStakeholders: addStakeholdersProcedure,
  getStakeholders: getStakeholdersProcedure,
})
