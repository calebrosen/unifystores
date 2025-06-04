function MediumInput({
  placeholder,
  defaultValue,
  id = '',
  value,
  size = "text-2xl",
  name = "input",
  type = "text",
  onChange
}) {
  return (
          <input
            className={`bg-slate-800 p-3 rounded-lg ${size} text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400`}
            placeholder={placeholder}
            defaultValue={defaultValue}
            id={id}
            value={value}
            name={name}
            type={type}
            onChange={onChange}
          />
  );
}

export default MediumInput;
