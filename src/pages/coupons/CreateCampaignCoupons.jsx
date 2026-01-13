import axios from "axios";
import { useContext, useState } from "react";
import LargeInput from "../../components/inputs/LargeInput";
import LargeButton from "../../components/buttons/LargeButton";
import { StoreContext } from "../../contexts/StoreContext";

function CreateCampaignCoupons() {
  const [campaignType, setCampaignType] = useState("giftcard");
  const [generatedCoupons, setGeneratedCoupons] = useState([]);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const { selectedStore } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copyToClipboard = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          alert("Coupon code copied: " + code);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          // fallback for older browsers
          fallbackCopyToClipboard(code);
        });
    } else {
      fallbackCopyToClipboard(code);
    }
  };

  const fallbackCopyToClipboard = (code) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      alert("Coupon code copied: " + code);
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      alert("Failed to copy coupon code");
    }
    document.body.removeChild(textArea);
  };

  const updateDateStart = (value) => {
    // if value is an event object, extract the target value
    const dateValue = value?.target?.value ?? value;
    setDateStart(dateValue);
    setError("");
  };

  const updateDateEnd = (value) => {
    // if value is an event object, extract the target value
    const dateValue = value?.target?.value ?? value;
    setDateEnd(dateValue);
    setError("");
  };

  // create a single coupon with specific parameters
  const createSingleCoupon = async (
    amountValue,
    minOrderValue,
    label,
    startDate,
    endDate
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/node/coupons/createCampaignCoupon`,
        {
          selectedStore: selectedStore,
          amount: parseFloat(amountValue),
          minimumOrderAmount: parseFloat(minOrderValue),
          dateStart: startDate,
          dateEnd: endDate,
        }
      );

      return {
        label,
        code: response.data[0][0].couponCode,
        amount: amountValue,
        minimumOrder: minOrderValue,
        startDate,
        endDate,
      };
    } catch (err) {
      console.error(`Error creating ${label}:`, err);
      throw new Error(`Failed to create ${label}`);
    }
  };

  // create all preset coupons at once using the dates from the form
  const handleCreateAllCoupons = async () => {
    // validate dates are set
    if (!dateStart) {
      setError("Please select a start date");
      return;
    }
    if (!dateEnd) {
      setError("Please select an end date");
      return;
    }
    if (new Date(dateStart) > new Date(dateEnd)) {
      setError("End date must be after start date");
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedCoupons([]);

    // define presets based on campaign type
    let presets = [];

    if (campaignType === "giftcard") {
      presets = [
        { amount: 50, minOrder: 1500, label: "$50 Off Above $1,500" },
        { amount: 100, minOrder: 2500, label: "$100 Off Above $2,500" },
        { amount: 150, minOrder: 2500, label: "$150 Off Above $2,500" },
      ];
    } else if (campaignType === "lostleads") {
      presets = [
        { amount: 50, minOrder: 750, label: "$50 Off Above $750" },
        { amount: 75, minOrder: 1500, label: "$75 Off Above $1,500" },
        { amount: 100, minOrder: 2500, label: "$100 Off Above $2,500" },
        { amount: 150, minOrder: 2500, label: "$150 Off Above $2,500" },
      ];
    }

    try {
      const createdCoupons = [];

      for (const preset of presets) {
        const coupon = await createSingleCoupon(
          preset.amount,
          preset.minOrder,
          preset.label,
          dateStart,
          dateEnd
        );
        createdCoupons.push(coupon);
      }

      setGeneratedCoupons(createdCoupons);

    } catch (err) {
      setError(
        err.message || "Failed to create all coupons. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* campaign type selection */}
      <div className="flex flex-row items-center justify-center w-full gap-6 mt-10 mb-10">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="campaignType"
            value="giftcard"
            checked={campaignType === "giftcard"}
            onChange={(e) => setCampaignType(e.target.value)}
            className="hidden"
          />
          <div
            className={`px-8 py-4 rounded-lg border-2 transition-all ${
              campaignType === "giftcard"
                ? "bg-cyan-600 border-cyan-900 text-white"
                : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
            }`}
          >
            <span className="text-3xl font-semibold">Gift Card Campaign</span>
          </div>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="campaignType"
            value="lostleads"
            checked={campaignType === "lostleads"}
            onChange={(e) => setCampaignType(e.target.value)}
            className="hidden"
          />
          <div
            className={`px-8 py-4 rounded-lg border-2 transition-all ${
              campaignType === "lostleads"
                ? "bg-cyan-600 border-cyan-900 text-white"
                : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
            }`}
          >
            <span className="text-3xl font-semibold">Lost Leads Campaign</span>
          </div>
        </label>
      </div>
      <hr />
      {/* date inputs */}
      <div className="flex flex-row items-center justify-center w-full gap-10 mt-10 mb-10">
        <LargeInput
          type="date"
          label="Start Date"
          placeholder="Start Date"
          value={dateStart}
          onChange={updateDateStart}
        />
        <span className="text-neutral-200 font-bold text-2xl">to</span>
        <LargeInput
          type="date"
          label="End Date"
          placeholder="End Date"
          value={dateEnd}
          onChange={updateDateEnd}
        />
      </div>

      {/* create all button */}
      <div className="flex flex-row items-center justify-center w-full gap-10 mt-10 mb-20">
        <LargeButton
          text={isLoading ? "Creating..." : "Create All"}
          action={handleCreateAllCoupons}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-500 mt-5 text-lg flex justify-center">
          {error}
        </div>
      )}

      {/* display created coupons in slate-styled cards */}
      {generatedCoupons.length > 0 && (
        <div className="mb-20">
          <div className="grid grid-cols-1 gap-6">
            {generatedCoupons.map((coupon, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-6 shadow-lg border-1 border-slate-700"
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-100 mb-3">
                      {coupon.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-2xl">
                      <div>
                        <span className="text-slate-400">Coupon Code:</span>
                        <p className="text-blue-400 font-mono text-lg mt-1">
                          {coupon.code}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Amount:</span>
                        <p className="text-slate-100 mt-1">${coupon.amount}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Minimum Order:</span>
                        <p className="text-slate-100 mt-1">
                          ${coupon.minimumOrder}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Valid Period:</span>
                        <p className="text-slate-100 mt-1">
                          {coupon.startDate} to {coupon.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <LargeButton
                      text="Copy"
                      action={() => copyToClipboard(coupon.code)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateCampaignCoupons;
