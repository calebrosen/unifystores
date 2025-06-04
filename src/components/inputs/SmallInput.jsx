function SmallInput({
  placeholder,
  value,
  size = "text-2xl",
  name = "input",
  type = "text",
  onChange
}) {
  return (
          <input
            className={`bg-slate-800 px-3 py-2 rounded-lg ${size} text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400`}
            placeholder={placeholder}
            value={value}
            name={name}
            type={type}
            onChange={onChange}
          />
  );
}

export default SmallInput;
