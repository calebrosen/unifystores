function HighlightedBanner({
  text,
  size = "text-6xl",
  centered = true,
}) {
  return (
    <div className={`border-3 border-cyan-600 bg-cyan-800 hover:scale-105 transition ease-in-out text-white ${size} font-medium px-4 pt-2.5 pb-3 rounded-xl w-max ${centered ? "mx-auto" : ""}`}>
      {text}
    </div>
  );
}

export default HighlightedBanner;
