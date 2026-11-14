// Dynamic lookup so Next does not bake empty values into the server bundle at image build time.
export function env(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}
