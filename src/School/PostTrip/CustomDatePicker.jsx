import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Custom CSS for red theme (unchanged)
const customStyles = `
  .react-datepicker__header {
    background-color: #dc2626;
    border-bottom: none;
  }
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block !important;
    width: 100% !important;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range {
    background-color: #dc2626;
    color: white;
  }
  .react-datepicker__day:hover {
    background-color: #fee2e2;
  }
  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
  }
  .react-datepicker__triangle::before,
  .react-datepicker__triangle::after {
    border-bottom-color: #dc2626 !important;
  }
  .react-datepicker__navigation-icon::before {
    border-color: white;
  }
  /* ✅ Fix input focus color */
  .react-datepicker__input-container input:focus {
    outline: none;
    border-color: red !important;
  }
`;

const DatePickerComponent = ({ activeTab, formData, setFormData, errors, handleDateContainerClick, toggleRecurringDay }) => {
  const dateInputRef = useRef(null);

  const handleInputChange = (date) => {
    if (!date) {
      setFormData((prev) => ({ ...prev, tripDate: '' }));
      return;
    }
    // Use local date components to avoid UTC shift
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      tripDate: `${year}-${month}-${day}`,
    }));
  };

  // Prevent typing in the input field
  const preventTextInput = (e) => {
    e.preventDefault();
  };

  // Parse formData.tripDate as local date for selected prop
  const selectedDate = formData.tripDate
    ? (() => {
        const [year, month, day] = formData.tripDate.split('-').map(Number);
        return new Date(year, month - 1, day);
      })()
    : null;

  return (
    <div className="col-span-full lg:col-span-2 relative">
      <style>{customStyles}</style>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {activeTab === 'one-time' ? 'Trip Date' : 'Recurring Days'} 
        <span className="text-red-500">*</span>
      </label>
      {activeTab === 'one-time' ? (
        <div 
          className={`relative w-full flex items-center focus:border-red-500 focus:ring-2 focus:ring-red-500 border  rounded-lg transition-colors ${
            errors.tripDate ? "border-red-500 ring-0 ring-red-500" : "border-gray-300"
          }`}
          onClick={handleDateContainerClick}
        >
          <DatePicker
            selected={selectedDate}
            onChange={handleInputChange}
            minDate={new Date()}
            className="w-full px-3 py-2  rounded-lg cursor-pointer bg-white text-gray-900 caret-transparent focus:border-red-500 focus:ring-2 focus:ring-red-500"
            ref={dateInputRef}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/DD/YYYY"
            preventOpenOnFocus={true}
            onKeyDown={preventTextInput}
          />
        </div>
      ) : (
        <div className="flex space-x-2">
          {['M', 'T', 'W', 'Th', 'F', 'S'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleRecurringDay(day)}
              className={`w-12 h-12 rounded-lg border 
                ${formData.recurringDays.includes(
                  { M: 'mon', T: 'tue', W: 'wed', Th: 'thu', F: 'fri', S: 'sat' }[day]
                )
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'} 
                border-gray-300 flex items-center justify-center text-sm font-medium transition-colors`}
            >
              {day}
            </button>
          ))}
        </div>
      )}
      {errors.tripDate && activeTab === 'one-time' && (
        <p className="absolute text-red-500 text-xs mt-1">{errors.tripDate}</p>
      )}
      {errors.recurringDays && activeTab === 'recurring' && (
        <p className="absolute text-red-500 text-xs mt-1">{errors.recurringDays}</p>
      )}
    </div>
  );
};

export default DatePickerComponent;