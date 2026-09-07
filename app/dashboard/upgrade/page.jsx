import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "3 mock interviews / month",
      "5 questions per interview",
      "Basic AI feedback",
      "Webcam + mic support",
    ],
    buttonLabel: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹299",
    period: "per month",
    features: [
      "Unlimited mock interviews",
      "Up to 10 questions each",
      "Detailed AI feedback & rating",
      "Priority support",
    ],
    buttonLabel: "Coming Soon",
    disabled: true,
    highlight: true,
  },
];

const page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Upgrade Plan</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Choose the plan that works best for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`border rounded-xl p-6 flex flex-col gap-4 ${
              plan.highlight ? "border-blue-600 shadow-md" : "border-gray-200"
            }`}
          >
            <div>
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-3xl font-bold mt-1">
                {plan.price}{" "}
                <span className="text-sm font-normal text-gray-500">
                  / {plan.period}
                </span>
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              disabled={plan.disabled}
              className={`mt-auto ${
                plan.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {plan.buttonLabel}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;