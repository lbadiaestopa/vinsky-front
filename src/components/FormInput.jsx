function FormInput({
    label,
    type = 'text',
    value,
    onChange,
    disabled,
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium ms-1">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="rounded-lg border border-gray px-3 py-2 text-sm focus:outline-none"
            />
        </div>
    )
}

export default FormInput