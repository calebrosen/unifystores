import LargeButton from "../../../components/buttons/LargeButton";

// this is the table for product selection
function Step1({
  products,
  selectedProductIds,
  toggleProductSelection,
  clearSelections,
  handleProceedStep2,
  page,
  totalPages,
  handlePageChange,
}) {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-neutral-200 mt-16">
        SELECT PRODUCTS TO COPY
      </h1>

      <div className="mb-10">
        {selectedProductIds.length > 0 && (
          <div className="text-4xl text-neutral-200 mb-6 mt-4">
            Selected Product ID's: {selectedProductIds.join(", ")}
          </div>
        )}

        <div className="flex justify-center gap-6 mt-8">
          <LargeButton
            action={handleProceedStep2}
            text={"Proceed"}
          />
          <LargeButton
            action={clearSelections}
            text={"Clear Selection"}
            type={"button"}
            color={"bg-slate-700"}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="p-3">Copy</th>
            <th className="p-3">Product ID</th>
            <th className="p-3">Model</th>
            <th className="p-3">MPN</th>
            <th className="p-3">Manufacturer</th>
            <th className="p-3">Name</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductID}>
              <td className="p-3">
                <input
                  type="checkbox"
                  className="w-6 h-6"
                  checked={selectedProductIds.includes(product.ProductID)}
                  onChange={() => toggleProductSelection(product.ProductID)}
                />
              </td>
              <td className="p-3">{product.ProductID}</td>
              <td className="p-3">{product.Model}</td>
              <td className="p-3">{product.MPN}</td>
              <td className="p-3">{product.Manufacturer}</td>
              <td className="p-3">{product.Name}</td>
              <td className="p-3">{product.Status}</td>
              <td className="p-3">{product.DateAdded}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex my-10">
        <div className="grid gap-4 justify-between" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
        {/* page numbers pagination */}
        {Array.from({ length: totalPages }, (_, i) => (

          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1
                ? "bg-cyan-700 text-white"
                : "bg-slate-700 text-white hover:bg-slate-800"
            }`}
          >
            {i + 1}
          </button>
       
        ))}
        </div>
      </div>
    </div>
  );
}

export default Step1;
