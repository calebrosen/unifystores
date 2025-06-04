function LargeTextarea({
  placeholder,
  value,
  defaultValue,
  size = "text-3xl",
  name="textarea",
  full = true,
  onChange
}) {
  return (
          <textarea
            className={`bg-slate-800 py-3 px-4 rounded-lg ${size} text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400 ${full ? "w-full" : ""}`}
            placeholder={placeholder}
            value={value}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
          />
  );
}

export default LargeTextarea;
