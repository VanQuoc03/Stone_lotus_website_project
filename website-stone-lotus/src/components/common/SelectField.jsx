export default function SelectField({
  label,
  name,
  value,
  onChange,
  required = false,
  options = [],
  error,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Chọn {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
