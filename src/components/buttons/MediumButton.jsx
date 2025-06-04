function MediumButton({
  action,
  text,
  type = "button",
  color = "bg-cyan-600",
  id,
  name,
  size = "text-2xl"
}) {
  return (
    <button onClick={action} id={id} name={name} type={type} className={`${color} hover:scale-105 transition ease-in-out text-white ${size} font-bold py-2 px-4 rounded`}>
      {text}
    </button>
  );
}

export default MediumButton;
