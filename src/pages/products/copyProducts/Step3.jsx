function Step3({ goBack, lastMessage }) {
  return (
    <div className="text-center">
      <button
        onClick={goBack}
        className="text-white bg-slate-700 hover:bg-slate-800 text-4xl rounded-xl p-4 my-4"
      >
        Go Back
      </button>

      <div className="text-4xl text-neutral-200 my-20">{lastMessage}</div>
    </div>
  );
}

export default Step3;

