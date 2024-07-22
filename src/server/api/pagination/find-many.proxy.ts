import type { PaginationData, ProxyFunctions } from "./types";

interface Paginated<T> {
  data: T[];
  count: number;
  total: number | null;
  cursor: string | null;
}

/**
 * FindManyPaginated
 *
 * type of the findManyPaginated method
 */
export type FindManyPaginated<F extends ProxyFunctions> = {
  findManyPaginated: (
    data: Omit<Parameters<F["findMany"]>[0], "take" | "skip" | "cursor">,
    pagination: PaginationData,
  ) => Promise<Paginated<Awaited<ReturnType<F["findMany"]>>[0]>>;
};

/**
 * makeFindManyPaginated
 *
 * factory function that creates the findManyPaginated method.
 * this method is used to paginate the results of a findMany method.
 * this method implements js proxy to intercept the call to findMany and add the pagination logic.
 */
export function makeFindManyPaginated(model: ProxyFunctions) {
  return new Proxy(model.findMany, {
    apply: async (target, thisArg, [data, paginationInfo]) => {
      const take = paginationInfo?.take;
      const cursor = paginationInfo?.cursor;

      const query = data || {};
      query.take = take;
      if (cursor) {
        query.cursor = { id: cursor }; // Assuming `id` is the cursor field
        query.skip = 1; // Skip the cursor item itself
      }

      const totalCount = await model.count({
        where: query.where,
      });

      //@ts-ignore
      const docs = await target.apply(thisArg, [query]);

      const nextCursor = docs.length === take ? docs[docs.length - 1].id : null; // Assuming `id` is the cursor field

      return {
        data: docs,
        count: docs.length,
        total: totalCount,
        cursor: nextCursor,
      };
    },
  });
}
