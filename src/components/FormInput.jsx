function FormInput({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    disabled = false,
    autoComplete,
}) {
    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={id}
                className="text-sm font-medium ms-1"
            >
                {label}
            </label>

            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
            />
        </div>
    )
}

export default FormInput