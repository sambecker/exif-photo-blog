export default function FieldSet({
  id,
  label,
  value,
  onChange,
  required,
  readOnly,
  type = 'text',
}: {
  id: string
  label: string
  value: string
  onChange?: (value: string) => void
  required?: boolean
  readOnly?: boolean
  type?: 'text' | 'password'
}) {
  return (
    <div className="space-y-1">
      <label
        className="flex gap-2"
        htmlFor={id}
      >
        {label}
        {required &&
          <span className="text-gray-400 dark:text-gray-600">
            (Required)
          </span>}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        type={type}
        autoComplete="off"
        readOnly={readOnly}
        className="w-full"
      />
    </div>
  );
};
