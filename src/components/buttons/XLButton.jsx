function XLButton({
  action,
  text,
  type = "button",
  color = "bg-cyan-600",
}) {
  return (
    <button onClick={action} type={type} className={`${color} hover:scale-105 transition ease-in-out text-white text-4xl font-bold p-4 rounded`}>
      {text}
    </button>
  );
}

export default XLButton;
