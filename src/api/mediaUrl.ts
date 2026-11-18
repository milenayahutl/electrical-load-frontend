export function mediaUrl(
  value: string | undefined | null,
  fallback: string
): string {
  if (!value) return fallback

  if (value.startsWith('/s3/')) return value

  if (value.startsWith('http://localhost:9000/')) {
    return value.replace('http://localhost:9000/', '/s3/')
  }

  if (value.startsWith('media/')) {
    return `/s3/${value}`
  }

  if (value.startsWith('/media/')) {
    return `/s3${value}`
  }

  if (value.startsWith('/')) return value

  return `/s3/media/${encodeURIComponent(value)}`
}
