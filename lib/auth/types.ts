export type AuthFormState =
  | {
      error?: string
      fieldErrors?: Record<string, string[]>
    }
  | undefined
