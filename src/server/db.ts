import { PrismaClient } from '@prisma/client'

import { env } from '@/env'
import { type TTemplateFieldMetaType } from '@/trpc/routers/template-field-router/schema'

declare global {
  // biome-ignore lint/style/noNamespace: <explanation>
  namespace PrismaJson {
    type TemplateFieldMeta = TTemplateFieldMetaType
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export type PrismaTransactionalClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0]

export type TPrisma = typeof db

export type TPrismaOrTransaction = TPrisma | PrismaTransactionalClient
