function LargeButton({
  action,
  text,
  type = "button",
  color = "bg-cyan-600",
}) {
  return (
    <button onClick={action} type={type} className={`${color} hover:scale-105 transition ease-in-out text-white text-3xl font-bold py-3 px-4 rounded`}>
      {text}
    </button>
  );
}

export default LargeButton;
