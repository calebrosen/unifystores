function XLInput({
  placeholder,
  value,
  size = "text-4xl",
  maxLength,
  name = "input",
  type = "text",
  onChange
}) {
  return (
          <input
            className={`bg-slate-800 p-4 rounded-lg ${size} text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400`}
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            name={name}
            type={type}
            onChange={onChange}
          />
  );
}

export default XLInput;
