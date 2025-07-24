import Modal from 'react-modal';
import HighlightedBanner from "../banners/HighlightedBanner";
import LargeButton from '../buttons/LargeButton';
import MediumButton from '../buttons/MediumButton';
import SmallInput from '../inputs/SmallInput';

function ModifyCouponsTable({
  coupons,
  searched,
  selectCoupons,
  openModal,
  isModalOpen,
  closeModal,
  currentCoupon,
  handleEdit,
  handleChange,
  deleteCoupon
}) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-4">
        <LargeButton action={selectCoupons} text={"Select Coupons"} />
        {coupons.length > 0 ? (
          <table className="mt-14">
            <thead>
              <tr>
                <th>Date Added</th>
                <th>Name</th>
                <th>Code</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Starting Date</th>
                <th>Ending Date</th>
                <th>Total Uses</th>
                <th>Status</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <tr key={coupon.id || index}>
                  <td>{coupon.date_added}</td>
                  <td>{coupon.name}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.type}</td>
                  <td>{coupon.date_start}</td>
                  <td>{coupon.date_end}</td>
                  <td>{coupon.uses_total}</td>
                  <td>{coupon.status}</td>
                  <td>
                    <MediumButton text={"Edit"} action={() => openModal(coupon)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          searched &&
          <div className="text-neutral-200 text-3xl mt-8">No coupons found.</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Coupon"
        shouldCloseOnOverlayClick={true}
        className="w-2/7 bg-slate-700 text-white rounded-lg py-8 px-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="Overlay"
      >
        {currentCoupon && (
          <form onSubmit={handleEdit} className="block mb-2">
            <HighlightedBanner text={`Edit Coupon: ${currentCoupon.name}`} size={"text-4xl !pt-3.5"} />

            {[
              { label: "Name", name: "name" },
              { label: "Code", name: "code" },
              { label: "Discount", name: "discount" },
              { label: "Type (F/P)", name: "type" },
              { label: "Starting Date", name: "date_start", type: "date" },
              { label: "Ending Date", name: "date_end", type: "date" },
              { label: "Total Uses", name: "uses_total", type: "number" },
              { label: "Status", name: "status" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="text-neutral-200 text-2xl block mt-4" htmlFor={name}>
                  {label}
                </label>
                <div className="mt-1 mb-3">
                  <SmallInput
                    name={name}
                    value={currentCoupon[name]}
                    onChange={handleChange}
                    placeholder={label}
                    type={type}
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-row gap-6">
              <MediumButton text={"Save"} type="submit" />
              <MediumButton action={deleteCoupon} text={"Delete"} color="bg-slate-800" />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ModifyCouponsTable;
