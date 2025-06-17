function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}
