function MediumTextarea({
  placeholder,
  value,
  defaultValue,
  size = "text-2xl",
  name= "textarea",
  full = true,
  maxLength ="",
  onChange
}) {
  return (
          <textarea
            className={`bg-slate-800 py-2.5 px-2 rounded-lg ${size} text-neutral-200 border-1 border-slate-600 border-opacity-80 placeholder:text-neutral-400 ${full ? "w-full" : ""}`}
            placeholder={placeholder}
            value={value}
            name={name}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onChange={onChange}
          />
  );
}

export default MediumTextarea;
