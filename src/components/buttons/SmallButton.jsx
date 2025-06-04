function SmallButton({
  action,
  text,
  type = "button",
  color = "bg-cyan-600",
}) {
  return (
    <button onClick={action} type={type} className={`${color} hover:scale-105 transition ease-in-out text-white text-xl font-bold py-2 px-4 rounded`}>
      {text}
    </button>
  );
}

export default SmallButton;
