function MediumFileInput({
  size = "text-2xl",
  name = "file-input",
  onChange,
  accept= "*" // all by default
}) {
  return (
    <input
      className={`bg-slate-800 p-3 w-full rounded-lg ${size} text-neutral-200 border-1 border-slate-700 placeholder:text-neutral-400`}
      name={name}
      type="file"
      onChange={onChange}  b 
      accept={accept}
      multiple
    />
  );
}

export default MediumFileInput;
