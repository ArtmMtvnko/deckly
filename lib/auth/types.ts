export type AuthFormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  values?: {
    email?: string
    username?: string
  }
}
