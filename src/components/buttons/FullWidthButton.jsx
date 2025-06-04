function FullWidthButton({
  action,
  text,
  type = "button",
}) {
  return (
    <button onClick={action} type={type} className="bg-cyan-600 hover:scale-105 transition ease-in-out text-white text-3xl font-bold py-2.5 px-4 rounded w-100">
      {text}
    </button>
  );
}

export default FullWidthButton;
