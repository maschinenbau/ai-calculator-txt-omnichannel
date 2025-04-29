import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Simple Card Components ---
// Reusable Card component for consistent styling
const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
);

// Reusable Card Header component
const CardHeader = ({ children, className, onClick }) => (
  // Added cursor-pointer and onClick handler for collapsible sections
  <div className={`px-6 py-4 ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {children}
  </div>
);

// Reusable Card Title component
const CardTitle = ({ children, className }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

// Reusable Card Content component
const CardContent = ({ children, className }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

// --- Slider Input Component ---
// Encapsulates the label, slider, and value display for better structure and reuse
const RangeSlider = ({ label, id, value, onChange, min, max, step, unit = '', helpText = '' }) => (
    <div>
        {/* Label and current value display */}
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-600">{label}</label>
            {/* Displaying the value using Brand Green color */}
            <span className="text-sm font-semibold text-lime-600">
               {unit === '$' && unit} {/* Prefix $ if unit is currency */}
               {safeLocaleString(value, { // Format the number
                   minimumFractionDigits: unit === '$' ? 2 : 0, // Decimals for currency
                   maximumFractionDigits: unit === '$' ? 2 : (unit === '%' ? 0 : 1) // No decimals for %, one for others
               })}
               {unit !== '$' && unit} {/* Suffix unit if not currency */}
            </span>
        </div>
        {/* The actual range slider input */}
        <input
            type="range"
            id={id}
            name={id}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
             // Using Brand Green (lime-500) for slider thumb/track accent color
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-500"
        />
        {/* Optional help text below the slider */}
        {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
);


// --- Print Styles Component ---
// Defines CSS rules specifically for printing the calculator results
const PrintStyles = () => (
  <style type="text/css">
    {`
      @media print {
        /* Hide everything except the printable area */
        body * { visibility: hidden; }
        #printable-area, #printable-area * { visibility: visible; }
        #printable-area { position: absolute; left: 0; top: 0; width: 100%; }

        /* Hide elements marked as no-print */
        .no-print, .no-print * { display: none !important; }

        /* Adjust layout for printing */
        .print-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; } /* Force single column */
        .print-p-0 { padding: 0 !important; } /* Remove padding */
        .print-shadow-none { box-shadow: none !important; } /* Remove shadows */
        .print-border-none { border: none !important; } /* Remove borders */

        /* Ensure chart elements are positioned correctly */
        .recharts-legend-wrapper { position: relative !important; }
        .recharts-tooltip-wrapper { display: none !important; } /* Hide tooltips on print */

        /* Ensure backgrounds print (requires browser settings too) */
        .bg-white { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-100 { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-200 { background-color: #e5e7eb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-300 { background-color: #d1d5db !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-400 { background-color: #9ca3af !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-800 { background-color: #1f2937 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } /* Dark Grey */
        .bg-lime-100 { background-color: #f4fce8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } /* Light Green */
        .bg-lime-300 { background-color: #d9f99d !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } /* Light Green Alt */
        .bg-indigo-50 { background-color: #eef2ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-purple-50 { background-color: #faf5ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        /* Ensure text colors print */
        * { color: inherit !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-white { color: white !important; }
        .text-gray-300 { color: #d1d5db !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-800 { color: #1f2937 !important; } /* Dark Grey */
        .text-gray-900 { color: #111827 !important; }
        .text-red-500 { color: #ef4444 !important; }
        .text-red-600 { color: #dc2626 !important; }
        .text-red-700 { color: #b91c1c !important; }
        .text-green-600 { color: #16a34a !important; } /* Standard Green - Keep for +/- indicators */
        .text-green-700 { color: #15803d !important; }
        .text-green-800 { color: #166534 !important; }
        .text-lime-500 { color: #84cc16 !important; } /* Brand Green */
        .text-lime-600 { color: #65a30d !important; } /* Brand Green Darker */
        .text-lime-700 { color: #4d7c0f !important; }
        .text-indigo-800 { color: #3730a3 !important; }
        .text-purple-800 { color: #6b21a8 !important; }
        .text-slate-500 { color: #64748b !important; } /* Brand Gray */

        /* Hide sliders in print */
        input[type=range] { display: none !important; }
        /* Ensure value spans next to labels are visible */
        label + span { display: inline-block !important; margin-left: 5px; }
        /* Ensure toggle sections are shown when printing */
        .qualitative-benefits-content, .key-insights-content { display: block !important; visibility: visible !important; }
      }
    `}
  </style>
);

// --- Helper Function to Safely Format Numbers ---
// Formats numbers for display, handling potential non-numeric values and providing options
const safeLocaleString = (value, options = {}, fallback = '0.00') => {
  const numValue = Number(value); // Attempt to convert value to number
  // If it's a valid, finite number, format it
  if (typeof numValue === 'number' && isFinite(numValue)) {
    return numValue.toLocaleString(undefined, options);
  }
  // Handle specific fallback cases
  if (fallback === 'N/A') return 'N/A';
  // Attempt to format the fallback if it's numeric
  const fallbackNum = Number(fallback);
  if (typeof fallbackNum === 'number' && isFinite(fallbackNum)) {
     return fallbackNum.toLocaleString(undefined, options);
  }
  // Otherwise, return the fallback as a string
  return String(fallback);
};


// --- Main Calculator Component ---
function App() {
  // --- State Variables ---
  // Inputs for calculations, initialized with default values based on research/assumptions
  const [avgRevenuePerSale, setAvgRevenuePerSale] = useState(500);
  const [totalMonthlyInteractions, setTotalMonthlyInteractions] = useState(500);
  const [avgHumanAgentHourlyCost, setAvgHumanAgentHourlyCost] = useState(30);
  const [avgTimePerInteractionByHuman, setAvgTimePerInteractionByHuman] = useState(10);
  const [percentInteractionsHuman, setPercentInteractionsHuman] = useState(70);
  const [currentLeadQualificationRate, setCurrentLeadQualificationRate] = useState(25);
  const [currentAppointmentBookingRate, setCurrentAppointmentBookingRate] = useState(30);
  const [appointmentShowUpRate, setAppointmentShowUpRate] = useState(75);
  const [appointmentToSaleRate, setAppointmentToSaleRate] = useState(30);
  const [aiMonthlyCost, setAiMonthlyCost] = useState(497);
  const [aiSetupFee, setAiSetupFee] = useState(2500);
  const [aiAutonomyRate, setAiAutonomyRate] = useState(75);
  const [aiBookingRateImprovement, setAiBookingRateImprovement] = useState(15);
  const [aiShowRateImprovement, setAiShowRateImprovement] = useState(15);

  // State for input errors (less critical with sliders, but kept for structure)
  const [inputErrors, setInputErrors] = useState({});
  const [validationError, setValidationError] = useState(false); // Kept for potential future non-slider inputs

  // State to hold the calculated results
  const [results, setResults] = useState({
    // Baseline metrics (Before AI)
    humanMonthlyInteractionCost: 0, humanMonthlyQualifiedLeads: 0, humanMonthlyAppointmentsBooked: 0,
    humanMonthlyAppointmentsAttended: 0, humanMonthlySales: 0, humanMonthlyRevenue: 0,
    // Projected metrics (With AI)
    aiMonthlyHumanInteractionCostReduced: 0, aiMonthlyLaborCostSavings: 0, aiInfluencedQualifiedLeads: 0,
    aiAppointmentBookingRate: 0, aiEffectiveShowUpRate: 0,
    aiMonthlyAppointmentsBooked: 0, aiMonthlyAppointmentsAttended: 0,
    aiMonthlySales: 0, aiMonthlyRevenue: 0, aiMonthlyRevenueIncrease: 0,
    // AI Costs
    aiTotalMonthlyCost: 0, aiSetupFee: 0, aiEffectiveMonthlyCostY1: 0,
    // Key ROI Metrics
    totalMonthlyGain: 0, monthlyROI: 0, annualROI: 0,
    annualTotalGain: 0, annualCostSavings: 0, annualRevenueIncrease: 0, paybackPeriod: 0,
    // Supporting Analysis Metrics
    totalMonthlyInteractions: 0, humanInteractionsMonthly: 0, aiHandledInteractionsMonthly: 0,
    humanInteractionsRemainingMonthly: 0,
  });

  // State for managing the collapsible sections
  const [isQualitativeBenefitsOpen, setIsQualitativeBenefitsOpen] = useState(false);
  const [isKeyInsightsOpen, setIsKeyInsightsOpen] = useState(false);


  // --- Effects ---
  // Basic validation check (less critical now)
  useEffect(() => {
    const hasErrors = Object.values(inputErrors).some(error => error);
    setValidationError(hasErrors);
  }, [inputErrors]);

  // --- Calculation Logic ---
  // This effect runs whenever any of the input state variables change
  useEffect(() => {
    try {
        // --- Current State ("Before AI") Calculations ---
        // Calculate how many interactions humans handle and the associated cost
        const humanInteractionsMonthly = totalMonthlyInteractions * (percentInteractionsHuman / 100);
        const calculatedHumanMonthlyCost = humanInteractionsMonthly * (avgTimePerInteractionByHuman / 60) * avgHumanAgentHourlyCost;

        // Calculate the current sales funnel performance
        const humanMonthlyQualifiedLeads = totalMonthlyInteractions * (currentLeadQualificationRate / 100);
        const humanMonthlyAppointmentsBooked = humanMonthlyQualifiedLeads * (currentAppointmentBookingRate / 100);
        const humanMonthlyAppointmentsAttended = humanMonthlyAppointmentsBooked * (appointmentShowUpRate / 100);
        const humanMonthlySales = humanMonthlyAppointmentsAttended * (appointmentToSaleRate / 100);
        const humanMonthlyRevenue = humanMonthlySales * avgRevenuePerSale;

        // --- Projected State ("With AI") Calculations ---
        // Calculate interactions handled by AI vs. remaining for humans
        const aiHandledInteractionsMonthly = totalMonthlyInteractions * (aiAutonomyRate / 100);
        const humanInteractionsRemainingMonthly = totalMonthlyInteractions * (1 - (aiAutonomyRate / 100));
        // Calculate the reduced cost of human labor (only handling escalated interactions)
        const aiMonthlyHumanInteractionCostReduced = humanInteractionsRemainingMonthly * (avgTimePerInteractionByHuman / 60) * avgHumanAgentHourlyCost;
        // Calculate direct labor savings
        const aiMonthlyLaborCostSavings = calculatedHumanMonthlyCost - aiMonthlyHumanInteractionCostReduced;

        // Calculate the AI-influenced sales funnel performance
        const aiInfluencedQualifiedLeads = totalMonthlyInteractions * (currentLeadQualificationRate / 100); // Assuming same qualification rate for simplicity
        // Apply AI improvement to booking rate
        const aiEffectiveBookingRate = currentAppointmentBookingRate * (1 + (aiBookingRateImprovement / 100));
        const aiMonthlyAppointmentsBooked = aiInfluencedQualifiedLeads * (aiEffectiveBookingRate / 100);
        // Apply AI improvement to show-up rate (capped at 100%)
        const aiEffectiveShowUpRate = Math.min(100, appointmentShowUpRate * (1 + (aiShowRateImprovement / 100)));
        const aiMonthlyAppointmentsAttended = aiMonthlyAppointmentsBooked * (aiEffectiveShowUpRate / 100);
        // Calculate sales and revenue with AI improvements
        const aiMonthlySales = aiMonthlyAppointmentsAttended * (appointmentToSaleRate / 100); // Assuming same close rate
        const aiMonthlyRevenue = aiMonthlySales * avgRevenuePerSale;
        // Calculate the increase in revenue compared to the baseline
        const aiMonthlyRevenueIncrease = aiMonthlyRevenue - humanMonthlyRevenue;

        // --- AI Costs ---
        // Calculate total monthly AI cost and effective cost including amortized setup fee
        const calculatedAiTotalMonthlyCost = aiMonthlyCost;
        const aiSetupFeeMonthlyAmortized = aiSetupFee > 0 ? aiSetupFee / 12 : 0; // Avoid division by zero
        const aiEffectiveMonthlyCostY1 = calculatedAiTotalMonthlyCost + aiSetupFeeMonthlyAmortized;

        // --- ROI Metrics ---
        // Calculate total monthly gain (savings + revenue increase)
        const totalMonthlyGain = aiMonthlyLaborCostSavings + aiMonthlyRevenueIncrease;
        // Calculate ROI percentage, handling potential division by zero or infinite ROI
        const monthlyROI = aiEffectiveMonthlyCostY1 > 0 ? ((totalMonthlyGain - aiEffectiveMonthlyCostY1) / aiEffectiveMonthlyCostY1) * 100 : (totalMonthlyGain > 0 ? Infinity : 0);
        const annualROI = monthlyROI; // Assuming monthly ROI rate applies annually
        // Calculate annual figures
        const annualTotalGain = totalMonthlyGain * 12;
        const annualCostSavings = aiMonthlyLaborCostSavings * 12;
        const annualRevenueIncrease = aiMonthlyRevenueIncrease * 12;
        // Calculate payback period in months
        let paybackPeriodMonths = Infinity; // Default to never
        if (totalMonthlyGain > 0 && aiSetupFee > 0) {
            paybackPeriodMonths = aiSetupFee / totalMonthlyGain;
        } else if (totalMonthlyGain > 0 && aiSetupFee <= 0) {
            paybackPeriodMonths = 0; // Immediate if no setup fee and positive gain
        }

        // Update the results state with all calculated values
        setResults({
            humanMonthlyInteractionCost: calculatedHumanMonthlyCost, humanMonthlyQualifiedLeads: humanMonthlyQualifiedLeads,
            humanMonthlyAppointmentsBooked: humanMonthlyAppointmentsBooked, humanMonthlyAppointmentsAttended: humanMonthlyAppointmentsAttended,
            humanMonthlySales: humanMonthlySales, humanMonthlyRevenue: humanMonthlyRevenue,
            aiMonthlyHumanInteractionCostReduced: aiMonthlyHumanInteractionCostReduced, aiMonthlyLaborCostSavings: aiMonthlyLaborCostSavings,
            aiInfluencedQualifiedLeads: aiInfluencedQualifiedLeads,
            aiAppointmentBookingRate: aiEffectiveBookingRate,
            aiEffectiveShowUpRate: aiEffectiveShowUpRate,
            aiMonthlyAppointmentsBooked: aiMonthlyAppointmentsBooked, aiMonthlyAppointmentsAttended: aiMonthlyAppointmentsAttended,
            aiMonthlySales: aiMonthlySales, aiMonthlyRevenue: aiMonthlyRevenue, aiMonthlyRevenueIncrease: aiMonthlyRevenueIncrease,
            aiTotalMonthlyCost: calculatedAiTotalMonthlyCost, aiSetupFee: aiSetupFee, aiEffectiveMonthlyCostY1: aiEffectiveMonthlyCostY1,
            totalMonthlyGain: totalMonthlyGain, monthlyROI: monthlyROI, annualROI: annualROI, annualTotalGain: annualTotalGain,
            annualCostSavings: annualCostSavings, annualRevenueIncrease: annualRevenueIncrease, paybackPeriod: paybackPeriodMonths,
            totalMonthlyInteractions: totalMonthlyInteractions, humanInteractionsMonthly: humanInteractionsMonthly,
            aiHandledInteractionsMonthly: aiHandledInteractionsMonthly, humanInteractionsRemainingMonthly: humanInteractionsRemainingMonthly,
        });
    } catch (error) {
        // Log any calculation errors to the console
        console.error("Error during calculation:", error);
    }
  }, [ // List of dependencies that trigger recalculation
    avgRevenuePerSale, totalMonthlyInteractions, avgHumanAgentHourlyCost,
    avgTimePerInteractionByHuman, percentInteractionsHuman, currentLeadQualificationRate,
    currentAppointmentBookingRate, appointmentShowUpRate, appointmentToSaleRate,
    aiMonthlyCost, aiSetupFee, aiAutonomyRate, aiBookingRateImprovement, aiShowRateImprovement
  ]);

  // --- Handlers & Helpers ---
  // Handles changes from the range sliders, updating the corresponding state variable
  const handleSliderChange = (setter) => (e) => {
    setter(Number(e.target.value));
  };

  // Formats the payback period (in months) into a user-friendly string (years, months, days)
   const formatPaybackPeriod = (periodInMonths) => {
      if (periodInMonths === 0) return "Immediate"; // Handle zero payback
      if (!isFinite(periodInMonths) || periodInMonths < 0) return "Never"; // Handle infinite or negative payback

      const absoluteMonths = Math.abs(periodInMonths);
      const years = Math.floor(absoluteMonths / 12);
      const months = Math.floor(absoluteMonths % 12);
      const days = Math.round((absoluteMonths % 1) * 30); // Approximate days

      let result = "";
      if (years > 0) result += `${years} year${years > 1 ? 's' : ''}`;
      if (months > 0) result += (result ? " " : "") + `${months} month${months > 1 ? 's' : ''}`;

      // Show days only if period is less than a month or for precision < 2 months
      if (years === 0 && months === 0 && days > 0) {
           result = `${days} day${days > 1 ? 's' : ''}`;
      } else if (years === 0 && months < 2 && days > 0 && !result.includes('month')) {
           result += (result ? " " : "") + `~${days} day${days > 1 ? 's' : ''}`;
      }

      return result || "Less than 1 day"; // Fallback for very small positive numbers
  };

  // Triggers the browser's print dialog
  const handlePrint = () => { window.print(); };

  // --- JSX Rendering ---
  return (
    <>
      <PrintStyles /> {/* Include print-specific styles */}
      <div id="printable-area" className="p-4 max-w-6xl mx-auto font-sans print-p-0">
        {/* Main Card Container */}
        <Card className="w-full print-shadow-none print-border-none">
          {/* Header Section */}
          <CardHeader className="bg-gray-800 text-white rounded-t-lg"> {/* Brand Dark Grey */}
            <CardTitle className="text-center text-2xl">Omnichannel AI Agent ROI Calculator</CardTitle>
            <p className="text-center text-sm text-gray-300 mt-1">Estimate the Value of Automating Text-Based Customer Interactions</p>
          </CardHeader>

          {/* Main Content Area (Inputs and Results) */}
          <CardContent className="p-6">
            {/* Grid Layout for Inputs and Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-grid-cols-1">

              {/* Left Column: Input Sections */}
              <div className="space-y-6">
                {/* Business & Interaction Volume Card */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold mb-3 text-gray-800">Business & Interaction Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <RangeSlider
                        label="Total Monthly Incoming Interactions"
                        id="totalMonthlyInteractions"
                        value={totalMonthlyInteractions}
                        onChange={handleSliderChange(setTotalMonthlyInteractions)}
                        min="0" max="5000" step="10"
                        unit="#"
                        helpText="Total relevant conversations across SMS, WhatsApp, Email, Social DMs, Web Chat etc."
                    />
                     <RangeSlider
                        label="Average Revenue per Sale"
                        id="avgRevenuePerSale"
                        value={avgRevenuePerSale}
                        onChange={handleSliderChange(setAvgRevenuePerSale)}
                        min="0" max="10000" step="10"
                        unit="$"
                        helpText="Typical value of a closed deal from these interactions."
                    />
                  </CardContent>
                </Card>

                 {/* Current Human Performance & Costs Card */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold mb-3 text-gray-800">Current Human Performance & Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                     <RangeSlider
                        label="Average Human Agent Hourly Cost"
                        id="avgHumanAgentHourlyCost"
                        value={avgHumanAgentHourlyCost}
                        onChange={handleSliderChange(setAvgHumanAgentHourlyCost)}
                        min="0" max="100" step="1"
                        unit="$"
                        helpText="Enter the *fully loaded* hourly cost (including salary, benefits, overhead, etc.). Default: $30"
                     />
                     <RangeSlider
                        label="Average Time Spent per Interaction by Human"
                        id="avgTimePerInteractionByHuman"
                        value={avgTimePerInteractionByHuman}
                        onChange={handleSliderChange(setAvgTimePerInteractionByHuman)}
                        min="1" max="60" step="1"
                        unit=" min"
                        helpText="Include response, research, logging time etc. Default: 10 min"
                     />
                     <RangeSlider
                        label="% Interactions Requiring Human Intervention Currently"
                        id="percentInteractionsHuman"
                        value={percentInteractionsHuman}
                        onChange={handleSliderChange(setPercentInteractionsHuman)}
                        min="0" max="100" step="1"
                        unit="%"
                        helpText="Estimate the percentage of *all* incoming interactions (across channels) that *currently* require handling by a human agent. Default: 70%"
                     />
                     {/* Sub-section for Funnel Rates */}
                     <div className="pt-4 mt-4 border-t">
                       <h4 className="text-md font-semibold mb-3 text-gray-700">Current Sales Funnel Rates</h4>
                       <div className="space-y-5">
                           <RangeSlider
                              label="Current Lead Qualification Rate"
                              id="currentLeadQualificationRate"
                              value={currentLeadQualificationRate}
                              onChange={handleSliderChange(setCurrentLeadQualificationRate)}
                              min="0" max="100" step="1"
                              unit="%"
                              helpText="Of *all* incoming interactions, % typically identified as potential leads meeting basic criteria (Marketing Qualified Leads)? Default: 25%"
                           />
                           <RangeSlider
                              label="Current Appointment Booking Rate (Qualified Leads)"
                              id="currentAppointmentBookingRate"
                              value={currentAppointmentBookingRate}
                              onChange={handleSliderChange(setCurrentAppointmentBookingRate)}
                              min="0" max="100" step="1"
                              unit="%"
                              helpText="Of the leads identified as qualified (from the previous step), % that typically result in a booked appointment? Default: 30%"
                           />
                            <RangeSlider
                              label="Appointment Show-Up Rate"
                              id="appointmentShowUpRate"
                              value={appointmentShowUpRate}
                              onChange={handleSliderChange(setAppointmentShowUpRate)}
                              min="0" max="100" step="1"
                              unit="%"
                              helpText="% of booked appointments that attend (Base rate). Default: 75%"
                           />
                           <RangeSlider
                              label="Appointment-to-Sale Rate"
                              id="appointmentToSaleRate"
                              value={appointmentToSaleRate}
                              onChange={handleSliderChange(setAppointmentToSaleRate)}
                              min="0" max="100" step="1"
                              unit="%"
                              helpText="Of the appointments that *show up*, % that typically convert into a paying customer? Default: 30%"
                           />
                       </div>
                     </div>
                  </CardContent>
                </Card>

                {/* AI Agent Parameters & Costs Card */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold mb-3 text-gray-800">AI Agent Parameters & Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                     <RangeSlider
                        label="Monthly Cost of AI Agent"
                        id="aiMonthlyCost"
                        value={aiMonthlyCost}
                        onChange={handleSliderChange(setAiMonthlyCost)}
                        min="0" max="5000" step="10"
                        unit="$"
                        helpText="Your estimated monthly subscription/service fee. Default: $497"
                     />
                     <RangeSlider
                        label="One-time Setup Fee"
                        id="aiSetupFee"
                        value={aiSetupFee}
                        onChange={handleSliderChange(setAiSetupFee)}
                        min="0" max="10000" step="100"
                        unit="$"
                        helpText="Any initial setup or implementation cost. Default: $2500"
                     />
                     <RangeSlider
                        label="Estimated % Interactions Handled Autonomously by AI"
                        id="aiAutonomyRate"
                        value={aiAutonomyRate}
                        onChange={handleSliderChange(setAiAutonomyRate)}
                        min="0" max="100" step="1"
                        unit="%"
                        helpText="Estimate the percentage of *total* interactions the AI can fully resolve *without any human help* (e.g., answering FAQs, qualifying leads, scheduling). This depends heavily on your specific processes. Default: 75%"
                     />
                    <RangeSlider
                        label="Estimated Improvement in Appointment Booking Rate (AI vs Human)"
                        id="aiBookingRateImprovement"
                        value={aiBookingRateImprovement}
                        onChange={handleSliderChange(setAiBookingRateImprovement)}
                        min="0" max="100" step="1"
                        unit="%"
                        helpText="Estimate the % increase in booking rate *for qualified leads* you expect from the AI's efficiency (e.g., speed, 24/7 availability, persistence) compared to the current human process. Default: 15%"
                     />
                     <RangeSlider
                        label="Estimated Improvement in Appointment Show-Up Rate (AI vs Human)"
                        id="aiShowRateImprovement"
                        value={aiShowRateImprovement}
                        onChange={handleSliderChange(setAiShowRateImprovement)}
                        min="0" max="100" step="1"
                        unit="%"
                        helpText="Expected lift in show-up rate due to AI reminders & engagement. Default: 15%"
                     />
                  </CardContent>
                </Card>

                {/* Scroll to Results Button */}
                <div className="mt-6 no-print">
                  <button
                    onClick={() => {
                        const resultsSection = document.getElementById('results-section');
                        if (resultsSection) {
                          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                    // Using Brand Gray (slate-500)
                    className={`w-full font-bold py-3 px-4 rounded transition duration-200 ease-in-out text-white shadow-md hover:shadow-lg bg-slate-500 hover:bg-slate-600 cursor-pointer`}
                  >
                     Scroll to Results
                  </button>
                   <p className="text-xs text-center text-gray-500 mt-2">Results update automatically as you adjust sliders.</p>
                </div>
              </div> {/* End Left Column */}


              {/* Right Column: Results Sections */}
              <div id="results-section" className="space-y-6">

                {/* --- Key Results Summary Card --- */}
                <Card className="border border-gray-500 bg-gray-400 print-shadow-none print-border-none"> {/* Darker gray bg, darker gray border */}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-900">Your Estimated AI Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center space-y-5">
                    {/* Annual Total Gain - Primary Metric */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Potential Annual Total Gain</div>
                      <div className={`text-4xl font-extrabold ${results.annualTotalGain >= 0 ? 'text-lime-600' : 'text-red-600'}`}> {/* Brand Green */}
                        {safeLocaleString(results.annualTotalGain, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-xs text-gray-600">(Annual Labor Savings + Annual Added Revenue)</p>
                    </div>
                    {/* Secondary Metrics (ROI, Payback) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-500">
                       <div>
                         <div className="text-sm font-medium text-gray-700 mb-1">Estimated Annual ROI</div>
                         <div className={`text-3xl font-bold text-gray-900`}> {/* Grayscale */}
                           {isFinite(results.annualROI)
                               ? safeLocaleString(results.annualROI, { style: 'percent', maximumFractionDigits: 0 }, 'N/A')
                               : (results.totalMonthlyGain > 0 ? '∞%' : 'N/A')
                           }
                         </div>
                       </div>
                       <div>
                         <div className="text-sm font-medium text-gray-700 mb-1">Payback Period</div>
                         <div className="text-3xl font-bold text-gray-900"> {/* Grayscale */}
                           {formatPaybackPeriod(results.paybackPeriod)}
                         </div>
                       </div>
                    </div>
                     {/* Breakdown of Gain */}
                     <div className="text-xs text-gray-700 pt-3">
                        Driven by:
                        <span className={`font-medium text-gray-800 mx-1`}> {/* Grayscale */}
                            {safeLocaleString(results.annualCostSavings, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </span>
                        in annual cost savings and
                        <span className={`font-medium text-gray-800 ml-1`}> {/* Grayscale */}
                            {safeLocaleString(results.annualRevenueIncrease, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </span>
                        in potential added revenue.
                     </div>
                  </CardContent>
                </Card>

                {/* --- Call to Action Button --- */}
                <div className="no-print">
                    <button
                        onClick={() => window.location.href = '#contact-us'} // Example action
                        // Using Brand Green (lime-500)
                        className="w-full font-bold py-3 px-4 rounded transition duration-200 ease-in-out text-white shadow-md hover:shadow-lg bg-lime-500 hover:bg-lime-600 cursor-pointer text-lg"
                    >
                        Let's Discuss Your Results
                    </button>
                </div>

                {/* --- Chart Card --- */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 mb-1">Monthly Cost & Benefit Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer>
                        <BarChart
                          data={[
                            { name: 'Monthly', 'Current Human Cost': results.humanMonthlyInteractionCost, 'AI Cost (Effective Y1)': results.aiEffectiveMonthlyCostY1, 'Net Benefit': results.totalMonthlyGain > 0 ? results.totalMonthlyGain : 0 }
                          ]}
                          margin={{ top: 5, right: 5, left: 15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(value) => `$${safeLocaleString(value, {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}`} tick={{ fontSize: 10 }} />
                          <Tooltip
                            formatter={(value, name) => [`$${safeLocaleString(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]}
                            labelFormatter={() => 'Monthly Comparison'}
                            cursor={{ fill: 'rgba(230, 230, 230, 0.3)' }}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                          />
                          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: '10px' }} />
                          {/* Bar Colors using Brand Palette */}
                          <Bar dataKey="Current Human Cost" fill="#64748b" name="Current Human Cost" radius={[4, 4, 0, 0]} /> {/* Brand Gray */}
                          <Bar dataKey="AI Cost (Effective Y1)" fill="#d9f99d" name="AI Cost (Incl. Setup/12)" radius={[4, 4, 0, 0]} /> {/* Light Green */}
                           {results.totalMonthlyGain > 0 && <Bar dataKey="Net Benefit" fill="#84cc16" name="Net Monthly Benefit" radius={[4, 4, 0, 0]} />} {/* Brand Green */}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                 {/* --- Monthly Financial Impact Card --- */}
                 <Card className="border border-gray-200 bg-white print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Monthly Financial Impact (AI vs. Current)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Direct Labor Cost Savings:</span>
                      <span className={`font-medium ${results.aiMonthlyLaborCostSavings >= 0 ? 'text-lime-600' : 'text-red-600'}`}> {/* Brand Green */}
                         {safeLocaleString(results.aiMonthlyLaborCostSavings, { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 -mt-2 mb-2 pl-1">(Current Human Cost - Cost of Humans Handling AI Escalations)</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Potential Added Revenue:</span>
                      <span className={`font-medium ${results.aiMonthlyRevenueIncrease >= 0 ? 'text-lime-600' : 'text-red-600'}`}> {/* Brand Green */}
                        {results.aiMonthlyRevenueIncrease >= 0 ? '+' : ''}{safeLocaleString(results.aiMonthlyRevenueIncrease, { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 -mt-2 mb-2 pl-1">(Est. Revenue from Improved Booking & Show-Up Rates)</p>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                      <span className="text-sm font-semibold text-gray-700">Total Monthly Benefit:</span>
                      <span className={`font-semibold text-xl ${results.totalMonthlyGain >= 0 ? 'text-lime-600' : 'text-red-600'}`}> {/* Brand Green */}
                         {safeLocaleString(results.totalMonthlyGain, { style: 'currency', currency: 'USD' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 -mt-2 pl-1">(Cost Savings + Added Revenue)</p>
                  </CardContent>
                </Card>

                 {/* --- AI Agent Cost Card --- */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">AI Agent Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-50 p-4 rounded-b-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">One-time Setup Fee:</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.aiSetupFee, { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Monthly Subscription/Service Cost:</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.aiTotalMonthlyCost, { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2 mt-2">
                      <span className="text-sm font-semibold text-gray-800">Effective Monthly Cost (Year 1):</span>
                      <span className="font-semibold text-lime-600">{safeLocaleString(results.aiEffectiveMonthlyCostY1, { style: 'currency', currency: 'USD' })}</span> {/* Brand Green */}
                    </div>
                    <p className="text-xs text-gray-500 -mt-2 pl-1">(Monthly Recurring + Setup Fee/12)</p>
                  </CardContent>
                </Card>

                 {/* --- Human Cost Card --- */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Calculated Human Agent Cost (Current)</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-50 p-4 rounded-b-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Est. Monthly Cost (Labor + Overhead):</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.humanMonthlyInteractionCost, { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <p className="text-xs text-gray-500 -mt-2 mb-2 pl-1"> Based on {safeLocaleString(results.humanInteractionsMonthly, {maximumFractionDigits: 0})} interactions handled by humans @ {safeLocaleString(avgHumanAgentHourlyCost, {style:'currency', currency:'USD'})}/hr & {safeLocaleString(avgTimePerInteractionByHuman, {maximumFractionDigits:1})} min/interaction</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-700">Est. Annual Cost:</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.humanMonthlyInteractionCost * 12, { style: 'currency', currency: 'USD' })}</span>
                    </div>
                  </CardContent>
                </Card>

                 {/* --- Interaction Analysis Card --- */}
                <Card className="border border-gray-200 print-shadow-none print-border-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Monthly Interaction Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-50 p-4 rounded-b-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Total Interactions Entered:</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.totalMonthlyInteractions, { maximumFractionDigits: 0 }, '0')}</span>
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Currently Handled by Humans:</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.humanInteractionsMonthly, { maximumFractionDigits: 0 }, '0')}</span>
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Est. Handled Autonomously by AI:</span>
                      <span className="font-medium text-lime-600">{safeLocaleString(results.aiHandledInteractionsMonthly, { maximumFractionDigits: 0 }, '0')}</span> {/* Brand Green */}
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Est. Remaining for Humans (w/ AI):</span>
                      <span className="font-medium text-gray-900">{safeLocaleString(results.humanInteractionsRemainingMonthly, { maximumFractionDigits: 0 }, '0')}</span>
                    </div>
                  </CardContent>
                </Card>

              </div> {/* End Right Column */}

            </div> {/* End Grid */}


            {/* --- Key Insights Section (COLLAPSIBLE) --- */}
            <div className="mt-8">
                <Card className="border border-gray-300 bg-gray-200 print-shadow-none print-border-none"> {/* Gray BG */}
                    {/* Make Header Clickable */}
                    <CardHeader
                        className="flex justify-between items-center hover:bg-gray-300 transition-colors duration-200"
                        onClick={() => setIsKeyInsightsOpen(!isKeyInsightsOpen)}
                    >
                        <CardTitle className="text-lg font-semibold text-gray-800">Key Insights & Annual Projections</CardTitle> {/* Dark Gray Title */}
                        {/* Arrow Icon */}
                        <span className={`transform transition-transform duration-200 ${isKeyInsightsOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </CardHeader>
                    {/* Conditionally Render Content */}
                    {isKeyInsightsOpen && (
                        <CardContent className="p-4 space-y-4 text-sm key-insights-content"> {/* Added class for print */}

                            {/* Annual Added Revenue Display */}
                            {results.annualRevenueIncrease !== 0 && (
                                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                    <p className="font-medium text-gray-800 mb-1">
                                        Potential Annual Added Revenue:
                                    </p>
                                    <p className={`text-xl font-semibold ${results.annualRevenueIncrease >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {safeLocaleString(results.annualRevenueIncrease, { style: 'currency', currency: 'USD' })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">(Est. Revenue from Improved Funnel x 12)</p>
                                </div>
                            )}

                            {/* Annual Cost Savings Display */}
                             {results.annualCostSavings !== 0 && (
                                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                    <p className="font-medium text-gray-800 mb-1">
                                        Potential Annual Labor Cost Savings:
                                    </p>
                                    <p className={`text-xl font-semibold ${results.annualCostSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {safeLocaleString(results.annualCostSavings, { style: 'currency', currency: 'USD' })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">(Savings from reduced human handling x 12)</p>
                                </div>
                            )}

                            {/* Annual Total Gain Display */}
                            <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-1">Potential Annual Total Gain:</p>
                                <p className={`text-xl font-semibold ${results.annualTotalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {safeLocaleString(results.annualTotalGain, { style: 'currency', currency: 'USD' })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">(Annual Labor Cost Savings + Annual Added Revenue)</p>
                            </div>

                            {/* --- DYNAMIC INSIGHTS LIST (Unchanged structure) --- */}
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li> The AI Agent projects a total monthly <span className={`font-semibold ${results.totalMonthlyGain >= 0 ? 'text-green-600' : 'text-red-600'}`}> {results.totalMonthlyGain >= 0 ? ' gain ' : ' loss '} of {safeLocaleString(Math.abs(results.totalMonthlyGain), { style: 'currency', currency: 'USD' })} </span>, combining labor savings and potential revenue increases. </li>
                                {(results.paybackPeriod > 0 && isFinite(results.paybackPeriod)) && ( <li> The initial investment (setup fee of {safeLocaleString(results.aiSetupFee, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}) is estimated to be paid back within <span className="font-semibold text-lime-600"> {formatPaybackPeriod(results.paybackPeriod)}</span> through the net monthly benefits. </li> )} {/* Brand Green */}
                                {(!isFinite(results.paybackPeriod)) && results.totalMonthlyGain <= 0 && ( <li> Based on the current inputs, the initial investment is not projected to be paid back via net benefits. </li> )}
                                {(results.paybackPeriod === 0) && ( <li> With a positive net benefit and zero setup fee, the return is effectively immediate. </li> )}
                                {results.aiMonthlyRevenueIncrease !== 0 && ( <li> Improving the sales funnel (e.g., <span className="font-semibold">{safeLocaleString(aiBookingRateImprovement, {maximumFractionDigits:0})}%</span> higher booking rate, <span className="font-semibold">{safeLocaleString(aiShowRateImprovement, {maximumFractionDigits:0})}%</span> higher show-up rate) is estimated to add <span className={`font-semibold ${results.aiMonthlyRevenueIncrease >= 0 ? 'text-green-600' : 'text-red-600'}`}> {safeLocaleString(results.aiMonthlyRevenueIncrease, { style: 'currency', currency: 'USD' })}</span> in potential revenue each month. This doesn't even include the impact of faster response times, which can boost conversions significantly! </li> )}
                                {results.aiMonthlyLaborCostSavings > 0 && ( <li> Automating {safeLocaleString(aiAutonomyRate, {maximumFractionDigits: 0})}% of interactions generates <span className="font-semibold text-green-600">{safeLocaleString(results.aiMonthlyLaborCostSavings, { style: 'currency', currency: 'USD' })}</span> in monthly labor savings. Consider the extra value if this frees up high-cost staff (like technicians) from handling routine messages! </li> )}
                                {results.aiMonthlyLaborCostSavings <= 0 && results.aiMonthlyLaborCostSavings !== 0 && ( <li> Automating {safeLocaleString(aiAutonomyRate, {maximumFractionDigits: 0})}% of interactions shows a potential monthly labor <span className="font-semibold text-red-600"> increased cost of {safeLocaleString(Math.abs(results.aiMonthlyLaborCostSavings), { style: 'currency', currency: 'USD' })} </span> (ensure AI cost inputs are accurate). </li> )}
                                <li> <span className="font-semibold text-gray-700">Don't Forget Speed:</span> Responding within 5 minutes can increase lead conversion by 9x or more. AI enables this instant engagement, maximizing the value of your marketing spend.</li> {/* Adjusted color */}
                                <li> <span className="font-semibold text-gray-700">Capture After-Hours Leads:</span> If a significant portion of inquiries arrive outside business hours, AI ensures they are engaged immediately, converting potential lost opportunities into revenue.</li> {/* Adjusted color */}
                                {isFinite(results.monthlyROI) && !isNaN(results.monthlyROI) && results.monthlyROI !== 0 && (
                                    <li> This translates to a potential ROI of <span className={`font-semibold ${results.monthlyROI >= 0 ? 'text-lime-600' : 'text-red-600'}`}> {/* Brand Green */}
                                        {safeLocaleString(results.monthlyROI, { maximumFractionDigits: 0 }, 'N/A')}%
                                    </span> (monthly/annual rate), comparing the total monthly benefit to the effective AI cost (incl. amortized setup). </li>
                                )}
                                 {results.monthlyROI === Infinity && (
                                    <li> With positive gains and zero effective cost (or negligible cost compared to gains), the ROI is effectively infinite.</li>
                                 )}
                            </ul>
                        </CardContent>
                    )}
                </Card>
            </div> {/* End Key Insights Section Wrapper */}


            {/* --- Qualitative Benefits Section (COLLAPSIBLE & STYLED) --- */}
            <div className="mt-8">
              <Card className="border border-gray-200 bg-gray-100 print-shadow-none print-border-none"> {/* Light Gray BG */}
                {/* Make Header Clickable */}
                <CardHeader
                    className="flex justify-between items-center hover:bg-gray-200 transition-colors duration-200" // Gray hover
                    onClick={() => setIsQualitativeBenefitsOpen(!isQualitativeBenefitsOpen)}
                >
                    <CardTitle className="text-lg font-semibold text-gray-800">Additional Potential Benefits (Qualitative)</CardTitle> {/* Dark Gray Title */}
                    {/* Arrow Icon */}
                    <span className={`transform transition-transform duration-200 ${isQualitativeBenefitsOpen ? 'rotate-180' : 'rotate-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"> {/* Gray Icon */}
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </CardHeader>
                {/* Conditionally Render Content */}
                {isQualitativeBenefitsOpen && (
                    <CardContent className="p-4 text-sm text-gray-700 qualitative-benefits-content"> {/* Added class for print styles */}
                      <p className="mb-3">Beyond the calculated ROI, consider these critical operational advantages:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li> <span className="font-medium">Drastically Improved Response Time:</span> Engage leads in minutes, not hours. 78% of customers choose the first responder – AI gives you the speed to win.</li>
                        <li> <span className="font-medium">24/7 Omnichannel Availability:</span> Capture and engage every lead instantly via SMS, WhatsApp, Email, Social Media, and Web Chat, maximizing opportunities from your marketing efforts.</li>
                        <li> <span className="font-medium">Instant FAQ Resolution & Efficient Service:</span> Provide immediate, consistent answers and handle routine service inquiries, freeing up valuable human agent time.</li>
                        <li> <span className="font-medium">Boost Labor Efficiency & Reduce Costs:</span> Stop wasting expensive human hours (especially skilled technicians!) on routine interactions. AI handles these for a fraction of the cost, allowing your team to focus on high-value, billable work.</li>
                        <li> <span className="font-medium">Efficient Appointment Scheduling & Reduced No-Shows:</span> Automate booking, rescheduling, and reminders (which can reduce no-shows by 60-70%), including lead qualification, reducing administrative burden and maximizing attended appointments.</li>
                         <li> <span className="font-medium">Consistent Lead Engagement & Follow-up:</span> Nurture leads systematically with automated messages and follow-ups, crucial since 80% of sales require 5+ follow-ups.</li>
                         <li> <span className="font-medium">Automated Review Generation:</span> Proactively encourage satisfied customers to leave reviews on Google or Facebook, boosting online reputation and attracting more business.</li>
                         <li> <span className="font-medium">Seamless Human Handoff:</span> Intelligently route complex conversations or high-intent leads to the right human agent with context, ensuring a smooth customer experience.</li>
                         <li> <span className="font-medium">Scalability & Competitive Advantage:</span> Handle significantly more interactions without proportionally increasing staff costs. This lowers your cost-per-acquisition compared to competitors relying solely on manual processes.</li>
                         <li> <span className="font-medium">Actionable Data & Insights:</span> Gather valuable information during interactions to better understand customer needs and qualify prospects for sales.</li>
                      </ul>
                    </CardContent>
                )}
              </Card>
            </div>

            {/* --- Bottom Button Section --- */}
            <div className="mt-8 text-center no-print">
              {/* Flex container for buttons */}
              <div className="flex justify-center items-center space-x-4">
                  {/* Print Button - Using Brand Gray (slate-500) */}
                  <button
                    onClick={handlePrint}
                    className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow hover:shadow-md"
                  >
                    Print Results
                  </button>
                  {/* Discuss Results Link Button - Using Brand Green */}
                  <a
                    href="#appointment-calendar" // Placeholder URL
                    className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow hover:shadow-md" // Brand Green
                  >
                    Let's Discuss Your Results
                  </a>
              </div>
              <p className="text-xs text-gray-500 mt-2"> Use your browser's print dialog to save as PDF. </p>
            </div>

          </CardContent>
        </Card>
      </div> {/* End Printable Area */}
    </> // End Fragment
  );
}

// Export the component as default App
export default App;
