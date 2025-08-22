import { useState } from "react";
import { ChevronDown } from "lucide-react";

const TimeSelect = ({ name, value, onChange, error }) => {
  const [open, setOpen] = useState(false);

  // Generate times (00:00 → 23:30)
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 30]) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }

  return (
    <div
      className={`relative flex items-center border rounded-lg transition-colors cursor-pointer ${
        error ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="w-full px-3 py-2 text-gray-900">
        {value || "Select time"}
      </div>
      <ChevronDown className="mr-3 h-4 w-4 text-gray-500" />

      {open && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg z-50">
          {times.map((t) => (
            <div
              key={t}
              onClick={() => {
                onChange({ target: { name, value: t } });
                setOpen(false);
              }}
              className={`px-3 py-2 hover:bg-red-50 cursor-pointer ${
                value === t ? "bg-red-500 text-white" : "text-gray-700"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSelect;
