export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('82') && digits.length >= 10) {
    return `0${digits.slice(2)}`
  }
  return digits
}
