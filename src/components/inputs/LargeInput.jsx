function LargeInput({
  placeholder,
  value,
  size = "text-3xl",
  name = "input",
  type = "text",
  onChange
}) {
  return (
          <input
            className={`bg-slate-800 py-3 px-4 rounded-lg ${size} text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400`}
            placeholder={placeholder}
            value={value}
            name={name}
            type={type}
            onChange={onChange}
          />
  );
}

export default LargeInput;
