function BoldH1({
  text,
  size = "text-5xl",
}) {
  return (
    <h1 className={`${size} font-bold text-neutral-200`}>
      {text}
    </h1>
  );
}

export default BoldH1;




