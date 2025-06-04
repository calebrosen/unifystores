function AlternateBanner({
  text,
  size = "text-4xl",
}) {
  return (
    <div className={`bg-slate-700 border-2 border-slate-600 border-opacity-30 hover:scale-105 transition ease-in-out text-white ${size} font-medium px-8 py-3 rounded-lg w-max mx-auto`}>
      {text}
    </div>
  );
}

export default AlternateBanner;
