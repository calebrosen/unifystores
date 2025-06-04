function InfoBanner({
  text,
  size = "text-4xl",
  maxW = "max-w-7xl",
}) {
  return (
    <div className={`text-neutral-200 text-4xl mt-8 ${maxW} mx-auto bg-slate-800 border-slate-700 border-1 rounded-lg p-4 ${size}`}
      dangerouslySetInnerHTML={{ __html: text }}>

    </div>
  );
}

export default InfoBanner;
