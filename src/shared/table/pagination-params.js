export async function parsePaginationParams(searchParams, { defaultPageSize = 15, queryKey = 'query' } = {}) {
  const params = await searchParams

  const page = Math.max(1, Number(params?.page) || 1)
  const pageSize = Math.max(1, Number(params?.pageSize) || defaultPageSize)

  const rawQuery = typeof params?.[queryKey] === 'string' ? params[queryKey] : undefined
  const query = rawQuery?.trim() ? rawQuery.trim() : undefined

  return { page, pageSize, query }
}
