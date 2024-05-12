export function getIp(headers: Headers) {
  const FALLBACK_IP_ADDRESS = '127.0.0.1'
  const forwardedFor = headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor
      ? Array.isArray(forwardedFor)
        ? (forwardedFor[0] as string)
        : forwardedFor.split(',')[0]!
      : FALLBACK_IP_ADDRESS
  }

  return headers.get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

export function getUserAgent(headers: Headers) {
  return headers.get('user-agent') ?? ''
}
