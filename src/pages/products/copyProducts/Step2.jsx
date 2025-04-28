function Step2({
  viewProducts,
  forceCopy,
  toggleForceCopy,
  handleProceedStep3,
  explainForceCopy,
  goBack,
  lastMessage,
}) {
  return (
    <div className="text-center">
      <button
        onClick={goBack}
        className="text-white bg-slate-700 hover:bg-slate-800 text-4xl rounded-xl p-4 my-4"
      >
        Go Back
      </button>

      <h1 className="text-6xl font-bold text-neutral-200 underline mt-6 mb-10">
        Confirm Products to Copy
      </h1>

      <table className="w-full text-neutral-200 text-xl border-collapse">
        <thead>
          <tr>
            <th className="p-3" onClick={explainForceCopy}>
              Force Copy{" "}
              <span className="inline-block vertical-align-middle align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="15"
                  width="15"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fff"
                    d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248z"
                  />
                  <path
                    fill="#3fa9f5"
                    d="M262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z"
                  />
                </svg>
              </span>
            </th>
            <th className="p-3">ID</th>
            <th className="p-3">Model</th>
            <th className="p-3">MPN</th>
            <th className="p-3">Name</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {viewProducts.map((product) => (
            <tr key={product.product_id}>
              <td className="p-3">
                <input
                  type="checkbox"
                  className="w-6 h-6"
                  checked={!!forceCopy[product.product_id]}
                  onChange={() => toggleForceCopy(product.product_id)}
                />
              </td>
              <td className="p-3">{product.product_id}</td>
              <td className="p-3">{product.model}</td>
              <td className="p-3">{product.mpn}</td>
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.status}</td>
              <td className="p-3">{product.date_added}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleProceedStep3}
        className="text-white bg-cyan-700 hover:bg-cyan-800 text-4xl rounded-xl p-4 my-10"
      >
        Confirm and Copy
      </button>

      <div className="text-4xl text-neutral-200 my-5">{lastMessage}</div>
    </div>
  );
}

export default Step2;
