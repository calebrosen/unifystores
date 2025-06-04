function InvertedBanner({
  text,
  size = "text-6xl",
}) {
  return (
    <div className={`border-3 border-cyan-600 hover:scale-105 transition ease-in-out text-white ${size} font-medium pb-3 pt-2.5 px-3 rounded-lg w-max mx-auto`}>
      {text}
    </div>
  );
}

export default InvertedBanner;
