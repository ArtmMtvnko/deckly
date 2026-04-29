type Props = {
  name: string
  type?: 'text' | 'email' | 'password'
  placeholder: string
  autoComplete?: string
  defaultValue?: string
  errors?: string[]
}

export function AuthInput({
  name,
  type = 'text',
  placeholder,
  autoComplete,
  defaultValue = '',
  errors,
}: Props) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        key={`${name}-${defaultValue}`}
        className="border-border dark:border-border-dark text-content-primary dark:text-content-primary-dark rounded-button w-full border bg-transparent px-4 py-3 text-sm transition-colors outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
      />
      {errors?.map((msg) => (
        <p key={msg} className="text-xs text-red-600 dark:text-red-400">
          {msg}
        </p>
      ))}
    </div>
  )
}
