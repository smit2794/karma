import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/store";
import { Button } from "@/components/ui/button";
import {
  UserPlus, Save, ChevronLeft, ChevronRight, Check,
  Users, HeartPulse, MapPin, ClipboardList, Leaf
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Child } from "@/data/mockData";

interface FormField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "checkbox" | "textarea" | "checkgroup";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  colSpan?: 1 | 2 | 3;
}

const steps = [
  { id: 1, title: "Child Identity", icon: UserPlus, color: "#0B6CC4", desc: "Basic personal information" },
  { id: 2, title: "Family Info", icon: Users, color: "#F28C28", desc: "Parents & family details" },
  { id: 3, title: "Household", icon: MapPin, color: "#10b981", desc: "Living conditions & economy" },
  { id: 4, title: "Health", icon: HeartPulse, color: "#D92B2B", desc: "Measurements & health status" },
  { id: 5, title: "Nutrition", icon: Leaf, color: "#F9C642", desc: "Diet & nutrition profile" },
  { id: 6, title: "Field Notes", icon: ClipboardList, color: "#5DBCEB", desc: "Observations & next steps" },
];

function FieldInput({
  field,
  value,
  onChange
}: {
  field: FormField;
  value: any;
  onChange: (val: any) => void;
}) {
  const { label, type, placeholder, options, required, colSpan = 1 } = field;
  const colClass = colSpan === 2 ? "col-span-2" : colSpan === 3 ? "col-span-3" : "col-span-1";
  
  if (type === "checkgroup" && options) {
    const list = Array.isArray(value) ? value : [];
    const handleCheckChange = (opt: string, checked: boolean) => {
      if (checked) {
        onChange([...list, opt]);
      } else {
        onChange(list.filter((x: string) => x !== opt));
      }
    };
    return (
      <div className={`space-y-2 ${colClass}`}>
        <label className="field-label text-slate-600 font-bold text-xs uppercase tracking-wide">{label}</label>
        <div className="grid grid-cols-2 gap-2">
          {options.map(opt => (
            <label
              key={opt}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-blue-600"
                checked={list.includes(opt)}
                onChange={e => handleCheckChange(opt, e.target.checked)}
              />
              <span className="text-sm text-slate-700 font-medium group-hover:text-blue-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === "checkbox") {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all ${colClass}`}>
        <input
          type="checkbox"
          className="w-5 h-5 rounded accent-blue-600"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`space-y-1.5 ${colClass}`}>
        <label className="field-label text-slate-600 font-bold text-xs uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <textarea
          placeholder={placeholder}
          rows={3}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          className="field-input resize-none"
          required={required}
        />
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <div className={`space-y-1.5 ${colClass}`}>
        <label className="field-label text-slate-600 font-bold text-xs uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
        <select
          className="field-select"
          required={required}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${colClass}`}>
      <label className="field-label text-slate-600 font-bold text-xs uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="field-input"
      />
    </div>
  );
}

const stepFields: Record<number, FormField[]> = {
  1: [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Rahul Kumar", required: true },
    { key: "age", label: "Age (Years)", type: "number", placeholder: "0–15" },
    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
    { key: "dob", label: "Date of Birth", type: "date", required: true },
    { key: "aadhaar", label: "Aadhaar Number", type: "text", placeholder: "XXXX XXXX XXXX" },
    { key: "schoolStatus", label: "School Status", type: "select", options: ["Enrolled", "Dropout", "Never Enrolled", "Pre-School Age"] },
    { key: "educationLevel", label: "Education Level", type: "select", options: ["None", "Anganwadi", "Primary (1–5)", "Upper Primary (6–8)", "Secondary"] },
    { key: "village", label: "Village", type: "select", options: ["Select Village"], required: true },
  ],
  2: [
    { key: "fatherName", label: "Father's Full Name", type: "text", placeholder: "Father's name" },
    { key: "motherName", label: "Mother's Full Name", type: "text", placeholder: "Mother's name" },
    { key: "guardianName", label: "Guardian Name (if different)", type: "text", placeholder: "Guardian's name" },
    { key: "mobileNumber", label: "Mobile Number", type: "text", placeholder: "+91 XXXXX XXXXX", required: true },
    { key: "familyMembersCount", label: "Total Family Members", type: "number", placeholder: "e.g. 5" },
    { key: "fatherAadhaar", label: "Father's Aadhaar", type: "text", placeholder: "XXXX XXXX XXXX" },
    { key: "motherAadhaar", label: "Mother's Aadhaar", type: "text", placeholder: "XXXX XXXX XXXX" },
    { key: "address", label: "Address", type: "textarea", placeholder: "Full residential address", colSpan: 2 },
  ],
  3: [
    { key: "occupation", label: "Occupation", type: "select", options: ["Farmer", "Daily Wage Labour", "Small Business", "Government Employee", "Unemployed", "Other"] },
    { key: "monthlyIncome", label: "Monthly Income (₹)", type: "number", placeholder: "e.g. 5000" },
    { key: "familyEconomyLevel", label: "Family Economy Level", type: "select", options: ["Extremely Poor (BPL)", "Poor", "Lower Middle Class", "Middle Class"] },
    { key: "houseType", label: "House Type", type: "select", options: ["Kutcha (Mud/Thatch)", "Semi-Pucca", "Pucca (Brick/Concrete)"] },
    { key: "waterAvailability", label: "Water Availability", type: "select", options: ["Piped Water (In-house)", "Hand Pump/Borewell", "Community Tap", "River/Pond", "No Access"] },
    { key: "electricity", label: "Electricity", type: "select", options: ["Available (24hrs)", "Available (Limited)", "Solar", "No Electricity"] },
    { key: "toiletFacility", label: "Toilet Facility", type: "select", options: ["In-house Toilet", "Shared Community Toilet", "Open Defecation", "Newly Constructed"] },
    { key: "govSchemeBenefits", label: "Government Scheme Benefits", type: "checkgroup", options: ["PMJDY", "Antyodaya Anna Yojana", "ICDS", "POSHAN Abhiyan", "PM Awas Yojana", "None"] },
    { key: "parentalDiseases", label: "Parental Serious Diseases", type: "text", placeholder: "e.g. TB, Diabetes (blank if none)", colSpan: 2 },
  ],
  4: [
    { key: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 110.5", required: true },
    { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 15.2", required: true },
    { key: "muac", label: "MUAC (cm)", type: "number", placeholder: "e.g. 12.5" },
    { key: "vaccinationStatus", label: "Vaccination Status", type: "select", options: ["Fully Vaccinated", "Partially Vaccinated", "Not Vaccinated", "Unknown"], required: true },
    { key: "vaccinationsReceived", label: "Vaccinations Already Received", type: "checkgroup", options: ["BCG", "OPV (Polio)", "DPT", "Measles/MR", "Hepatitis B", "Vitamin A", "Typhoid", "COVID-19"] },
    { key: "currentHealthStatus", label: "Current Health Status", type: "select", options: ["Healthy", "Mild Illness", "Moderate Illness", "Severe Illness", "Under Treatment"] },
    { key: "disabilityInfo", label: "Disability Information", type: "select", options: ["None", "Physical Disability", "Visual Impairment", "Hearing Impairment", "Intellectual Disability", "Multiple Disabilities"] },
    { key: "knownHealthConditions", label: "Known Health Conditions", type: "textarea", placeholder: "e.g. Anaemia, Asthma, Congenital condition...", colSpan: 2 },
    { key: "medicalHistorySummary", label: "Medical History Summary", type: "textarea", placeholder: "Previous illnesses, surgeries, hospitalizations...", colSpan: 2 },
  ],
  5: [
    { key: "nutritionCategory", label: "Nutrition Category", type: "select", options: ["Normal (WHZ > -2)", "Moderate Acute Malnutrition (MAM)", "Severe Acute Malnutrition (SAM)", "Global Acute Malnutrition (GAM)"], required: true },
    { key: "nutritionRiskLevel", label: "Nutrition Risk Level", type: "select", options: ["Low", "Medium", "High", "Critical"], required: true },
    { key: "mealsPerDay", label: "Meals Per Day", type: "select", options: ["1 Meal", "2 Meals", "3 Meals", "More than 3"] },
    { key: "foodAvailability", label: "Food Availability", type: "select", options: ["Adequate", "Partially Adequate", "Inadequate", "Severely Inadequate"] },
    { key: "supplementReceived", label: "Supplement Received", type: "select", options: ["Yes – Regular", "Yes – Occasional", "No"] },
    { key: "milletSupportReceived", label: "Millet Support Received", type: "select", options: ["Yes – Regular", "Yes – Once", "No"] },
    { key: "dietaryDiversityScore", label: "Dietary Diversity Score", type: "select", options: ["1–2 (Very Low)", "3–4 (Low)", "5–6 (Moderate)", "7+ (High)"] },
    { key: "breastfeedingStatus", label: "Breastfeeding Status (if under 2)", type: "select", options: ["Exclusively Breastfed", "Partially Breastfed", "Not Breastfed", "Not Applicable"] },
  ],
  6: [
    { key: "lastVisitDate", label: "Last Visit Date", type: "date", required: true },
    { key: "nextVisitDate", label: "Next Visit Date (Planned)", type: "date" },
    { key: "interventionStatus", label: "Intervention Status", type: "select", options: ["No Intervention Required", "Monitoring Required", "Supplement Provided", "CMAM Enrolled", "Referral to Health Facility", "Treatment Ongoing"], required: true },
    { key: "fieldObservations", label: "Field Observations", type: "textarea", placeholder: "Describe the child's condition and home environment observed during the visit...", colSpan: 2 },
    { key: "recommendations", label: "Recommendations", type: "textarea", placeholder: "Suggested actions: dietary changes, medical attention, follow-up visits...", colSpan: 2 },
    { key: "referredToHospital", label: "Referred to Hospital?", type: "checkbox" },
    { key: "enrolledInPoshan", label: "Enrolled in POSHAN?", type: "checkbox" },
    { key: "priorityCase", label: "Priority Case?", type: "checkbox" },
  ],
};

export default function AddChildPage() {
  const { villages, currentCoordinator, children, addChild } = useAppContext();
  const navigate = useNavigate();
  const myVillages = villages.filter(v => v.coordinatorId === currentCoordinator?.id);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize and preserve form state at page level
  const [formData, setFormData] = useState<Record<string, any>>({
    // Step 1
    fullName: "",
    age: "",
    gender: "",
    dob: "",
    aadhaar: "",
    schoolStatus: "Enrolled",
    educationLevel: "None",
    village: "",
    // Step 2
    fatherName: "",
    motherName: "",
    guardianName: "",
    mobileNumber: "",
    familyMembersCount: "",
    fatherAadhaar: "",
    motherAadhaar: "",
    address: "",
    // Step 3
    occupation: "Daily Wage Labour",
    monthlyIncome: "",
    familyEconomyLevel: "Poor",
    houseType: "Semi-Pucca",
    waterAvailability: "Hand Pump/Borewell",
    electricity: "Available (Limited)",
    toiletFacility: "Shared Community Toilet",
    govSchemeBenefits: [],
    parentalDiseases: "",
    // Step 4
    height: "",
    weight: "",
    muac: "",
    vaccinationStatus: "Unknown",
    vaccinationsReceived: [],
    currentHealthStatus: "Healthy",
    disabilityInfo: "None",
    knownHealthConditions: "",
    medicalHistorySummary: "",
    // Step 5
    nutritionCategory: "Normal (WHZ > -2)",
    nutritionRiskLevel: "Low",
    mealsPerDay: "3 Meals",
    foodAvailability: "Adequate",
    supplementReceived: "No",
    milletSupportReceived: "No",
    dietaryDiversityScore: "5-6 (Moderate)",
    breastfeedingStatus: "Not Applicable",
    // Step 6
    lastVisitDate: new Date().toISOString().split('T')[0],
    nextVisitDate: "",
    interventionStatus: "No Intervention Required",
    fieldObservations: "",
    recommendations: "",
    referredToHospital: false,
    enrolledInPoshan: false,
    priorityCase: false,
  });

  // Patch village options into step 1 dynamically
  const villageList = myVillages.length > 0 ? myVillages : villages;
  stepFields[1][7].options = villageList.map(v => v.name);

  // Set first village as default if not selected
  if (!formData.village && villageList.length > 0) {
    setFormData(f => ({ ...f, village: villageList[0].name }));
  }

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(s => s + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Find matching village object
      const matchedVillage = villages.find(v => v.name === formData.village) || villages[0];

      // Perform calculations
      const heightVal = parseFloat(formData.height) || 100;
      const weightVal = parseFloat(formData.weight) || 15;
      const bmiVal = parseFloat((weightVal / Math.pow(heightVal / 100, 2)).toFixed(1)) || 15;

      // Map vaccinations status structure
      const vaccineList: Child["vaccinations"] = ["BCG", "OPV", "DPT", "Measles", "Polio"].map((vName) => {
        const received = formData.vaccinationsReceived.some((v: string) => v.toLowerCase().includes(vName.toLowerCase()));
        return {
          name: vName as any,
          status: received ? "Completed" : formData.vaccinationStatus === "Not Vaccinated" ? "Missed" : "Pending",
          date: received ? formData.lastVisitDate : undefined
        };
      });

      // Construct a new Child record
      const newChild: Child = {
        id: `CH${children.length + 101}`,
        name: formData.fullName || "Enrolled Child",
        photo: `https://i.pravatar.cc/150?u=${encodeURIComponent(formData.fullName || "child")}`,
        age: parseInt(formData.age) || 5,
        dob: formData.dob || new Date().toISOString().split('T')[0],
        gender: (formData.gender || "Male") as any,
        aadhaar: formData.aadhaar || "—",
        villageId: matchedVillage.id,
        coordinatorId: currentCoordinator?.id || matchedVillage.coordinatorId || "C1",
        fatherName: formData.fatherName || "—",
        motherName: formData.motherName || "—",
        fatherAadhaar: formData.fatherAadhaar || "—",
        motherAadhaar: formData.motherAadhaar || "—",
        phone: formData.mobileNumber || "—",
        address: formData.address || "—",
        health: {
          height: heightVal,
          weight: weightVal,
          muac: parseFloat(formData.muac) || 13,
          bmi: bmiVal,
          nutritionStatus: (formData.nutritionCategory.includes("Normal") 
            ? "Healthy" 
            : formData.nutritionCategory.includes("Moderate") 
            ? "Malnourished" 
            : "Severely Malnourished") as any,
          lastCheckup: formData.lastVisitDate,
        },
        healthHistory: [
          {
            date: formData.lastVisitDate,
            height: heightVal,
            weight: weightVal,
            muac: parseFloat(formData.muac) || 13,
            nutritionStatus: (formData.nutritionCategory.includes("Normal") 
              ? "Healthy" 
              : formData.nutritionCategory.includes("Moderate") 
              ? "Malnourished" 
              : "Severely Malnourished") as any,
          }
        ],
        vaccinations: vaccineList,
        milestones: [
          { name: "Walking", status: "Achieved", date: formData.dob },
          { name: "Speaking", status: "Achieved", date: formData.dob },
          { name: "Learning Skills", status: "Pending" },
          { name: "Social Skills", status: "Pending" }
        ],
        interventions: formData.interventionStatus && formData.interventionStatus !== "No Intervention Required" ? [
          {
            id: `INT${Date.now()}`,
            type: (formData.interventionStatus.includes("Supplement") ? "Supplement" : "Activity") as any,
            date: formData.lastVisitDate,
            description: `Intervention: ${formData.interventionStatus}. Recommendations: ${formData.recommendations || "none"}`,
            result: "Ongoing"
          }
        ] : [],
        visits: [
          {
            id: `VST${Date.now()}`,
            date: formData.lastVisitDate,
            type: "Checkup",
            observation: formData.fieldObservations || "First visit profile registration.",
            status: "Completed"
          }
        ],
        riskLevel: (formData.nutritionRiskLevel === "Critical" ? "High" : formData.nutritionRiskLevel || "Low") as any,
        status: "Active"
      };

      // Mutate global store
      addChild(newChild);

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate("/coordinator/children"), 2500);
    }, 1200);
  };

  if (showSuccess) {
    return (
      <div className="h-full flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full p-10 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 20px 60px rgba(11,108,196,0.15)'
          }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}
          >
            <Check size={44} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">Registration Complete!</h2>
          <p className="text-slate-500 mb-6">The child has been successfully enrolled in the Karma program.</p>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-3">Redirecting to Children list...</p>
        </motion.div>
      </div>
    );
  }

  const currentStepData = steps[currentStep - 1];
  const fields = stepFields[currentStep] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/coordinator/children")}
          className="h-10 w-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(93,188,235,0.12)', color: '#0B6CC4' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Register New Child
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Complete all steps to enrol a child in the NGO program.</p>
        </div>
      </div>

      {/* Stepper */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 4px 20px rgba(11,108,196,0.06)'
        }}
      >
        <div className="flex items-center gap-1">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-1 flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="stepper-dot"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    transition: "all 0.3s",
                    ...(currentStep === step.id
                      ? { background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`, color: 'white', boxShadow: `0 4px 12px ${step.color}55` }
                      : currentStep > step.id
                      ? { background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white' }
                      : { background: '#f1f5f9', color: '#94a3b8', border: '2px solid #e2e8f0' })
                  }}
                >
                  {currentStep > step.id ? <Check size={16} strokeWidth={3} /> : step.id}
                </div>
                <span
                  className="text-[10px] font-semibold hidden md:block"
                  style={{ color: currentStep === step.id ? step.color : '#94a3b8' }}
                >
                  {step.title}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 rounded-full"
                  style={{
                    background: currentStep > step.id
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : '#e2e8f0',
                    margin: '0 8px'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 4px 24px rgba(11,108,196,0.07)'
              }}
            >
              {/* Step Header */}
              <div
                className="px-6 py-5 flex items-center gap-4"
                style={{
                  background: `linear-gradient(135deg, ${currentStepData.color}12, ${currentStepData.color}06)`,
                  borderBottom: `1px solid ${currentStepData.color}20`
                }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentStepData.color}25, ${currentStepData.color}10)`,
                    border: `1px solid ${currentStepData.color}30`
                  }}
                >
                  <currentStepData.icon size={22} style={{ color: currentStepData.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Step {currentStep}: {currentStepData.title}
                  </h3>
                  <p className="text-sm text-slate-500">{currentStepData.desc}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-xs font-semibold text-slate-400">{currentStep} / {steps.length}</span>
                  <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(currentStep / steps.length) * 100}%`,
                        background: `linear-gradient(90deg, ${currentStepData.color}, ${currentStepData.color}aa)`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, idx) => (
                    <FieldInput
                      key={idx}
                      field={field}
                      value={formData[field.key]}
                      onChange={(val) => handleFieldChange(field.key, val)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="rounded-xl px-5 h-11 font-semibold"
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </Button>

          <div className="flex items-center gap-1">
            {steps.map(s => (
              <div
                key={s.id}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: currentStep === s.id ? '24px' : '6px',
                  background: currentStep >= s.id ? s.color : '#e2e8f0'
                }}
              />
            ))}
          </div>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="rounded-xl px-6 h-11 font-semibold text-white border-none"
              style={{ background: `linear-gradient(135deg, ${currentStepData.color}, ${currentStepData.color}cc)` }}
            >
              Next <ChevronRight size={18} className="ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-6 h-11 font-semibold text-white border-none"
              style={{ background: 'linear-gradient(135deg, #0B6CC4, #5DBCEB)', boxShadow: '0 4px 16px rgba(11,108,196,0.35)' }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={18} /> Register Child
                </span>
              )}
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
