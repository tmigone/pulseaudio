export function JSONStringify(value: any) {
  return JSON.stringify(value, (_, v) => typeof v === 'bigint' ? `${v}n` : v)
}

export function JSONParse(json: any) {
  return JSON.parse(json, (_key, value) => {
    if (isBigInt(value)) {
      return BigInt(value.substr(0, value.length - 1))
    }
    return value;
  })
}

export function isBigInt (value: any) {
  return typeof value === "string" && /^\d+n$/.test(value)
}