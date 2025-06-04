function SimpleBanner({
  text,
  size = "text-6xl",
  centered = true,
}) {
  return (
    <div
      className={`bg-cyan-600 hover:scale-105 border-2 border-cyan-400 border-opacity-10 transition ease-in-out text-white ${size} font-[650] px-4 pt-2.5 pb-3 rounded-lg w-max ${centered ? "mx-auto" : ""}`}
    >
      {text}
    </div>
  );
}

export default SimpleBanner;
