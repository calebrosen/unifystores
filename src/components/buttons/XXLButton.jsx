function XXLButton({
  action,
  text,
  type = "button",
  color = "bg-cyan-600",
}) {
  return (
    <button onClick={action} type={type} className={`${color} hover:scale-105 transition ease-in-out text-white text-5xl font-bold py-3 px-5 rounded`}>
      {text}
    </button>
  );
}

export default XXLButton;
