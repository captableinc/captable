/**
 * Pagination information
 */
export type PaginationData = {
  limit: number;
  cursor?: string;
};

/**
 * Proxy functions
 *
 * used to create custom methods for prisma models
 */
export type ProxyFunctions = {
  // biome-ignore lint/suspicious/noExplicitAny: <any is legal here>
  findMany: (params: any, pagination: PaginationData) => Promise<any>;
  // biome-ignore lint/suspicious/noExplicitAny: <any is legal here>
  count: (params: any) => Promise<number>;
};
