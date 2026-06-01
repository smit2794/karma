import { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Save, ChevronLeft, MapPin, Activity, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AddChildPage.css";

export default function AddChildPage() {
  const { villages, currentCoordinator } = useAppContext();
  const navigate = useNavigate();

  // Coordinator can only add children to their assigned villages
  const myVillages = villages.filter(v => v.coordinatorId === currentCoordinator?.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock save delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/coordinator/children");
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-border shadow-xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 k-bg-primary-soft k-text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Successful</h2>
          <p className="k-text-muted mb-6">The child has been successfully registered in the system. Redirecting you to the children list...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/coordinator/children")} className="h-8 w-8">
              <ChevronLeft size={18} />
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">Register New Child</h2>
          </div>
          <p className="k-text-muted ml-10">Enter complete details to onboard a new child into the program.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Details */}
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus size={18} className="k-text-primary" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input required type="text" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Rahul Kumar" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
                  <input required type="number" min="0" max="15" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Years" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
                  <input required type="date" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                <select required className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Location & Parent Details */}
          <Card className="border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users size={18} className="k-text-accent" /> Family & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Village</label>
                <select required className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Select Village</option>
                  {myVillages.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Father's Name</label>
                  <input type="text" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Father's Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mother's Name</label>
                  <input type="text" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Mother's Name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Family Aadhaar / ID</label>
                <input type="text" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="XXXX-XXXX-XXXX" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Initial Health Metrics */}
        <Card className="border-none shadow-md dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity size={18} className="k-text-secondary" /> Initial Health Metrics
            </CardTitle>
            <CardDescription>Record baseline measurements for tracking nutritional progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Height (cm)</label>
                <input required type="number" step="0.1" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 110.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weight (kg)</label>
                <input required type="number" step="0.1" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 15.2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">MUAC (cm)</label>
                <input required type="number" step="0.1" className="w-full p-2.5 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 12.5" />
                <p className="text-xs k-text-muted mt-1">Mid-Upper Arm Circumference</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/coordinator/children")} className="rounded-xl px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-xl px-6 k-bg-primary hover:opacity-90 text-white shadow-lg">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={18} /> Register Child
              </span>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
