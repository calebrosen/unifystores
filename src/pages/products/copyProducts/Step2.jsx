import LargeButton from "../../../components/buttons/LargeButton";

// this is the confirm page
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
      <LargeButton
        action={goBack}
        text={"Go Back"}
        color={"bg-slate-700"}
      />

      <h1 className="text-6xl font-bold text-neutral-200 underline mt-6 mb-10">
        Confirm Products to Copy
      </h1>

      <table>
        <thead>
          <tr>
            <th className="p-3 hover:cursor-pointer" onClick={explainForceCopy}>Force Copy?</th>
            <th className="p-3">Product ID</th>
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

      <LargeButton
        action={handleProceedStep3}
        text={"Confirm and Copy"}
      />

      <div className="text-4xl text-neutral-200 my-5">{lastMessage}</div>
    </div>
  );
}

export default Step2;
