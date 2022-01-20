export function JSONStringify (value: any): string {
  return JSON.stringify(value, (_, v) => typeof v === 'bigint' ? `${v}n` : v)
}

export function JSONParse (json: any): any {
  return JSON.parse(json, (_key, value) => {
    if (isBigInt(value)) {
      return BigInt(value.substr(0, value.length - 1))
    }
    return value
  })
}

export function isBigInt (value: any): boolean {
  return typeof value === 'string' && /^\d+n$/.test(value)
}
