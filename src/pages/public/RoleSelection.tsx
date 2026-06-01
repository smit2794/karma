import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserCircle, ArrowRight } from "lucide-react";
import { useAppContext } from "@/store";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const { setRole, setCurrentCoordinator, coordinators } = useAppContext();
  const navigate = useNavigate();
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string>("");

  const handleAdminLogin = () => {
    setRole("admin");
    navigate("/admin");
  };

  const handleCoordinatorLogin = () => {
    if (!selectedCoordinatorId) return;
    const coordinator = coordinators.find(c => c.id === selectedCoordinatorId);
    if (coordinator) {
      setRole("coordinator");
      setCurrentCoordinator(coordinator);
      navigate("/coordinator");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-3xl mix-blend-multiply pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative z-10"
      >
        <div className="flex flex-col justify-center mb-8 md:mb-0">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg mb-6">
            K
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Karma Foundation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
            Child Nutrition, Health Monitoring, Vaccination Tracking, and Intervention Management Platform.
          </p>
        </div>

        <div className="space-y-4">
          {/* Admin Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-border cursor-pointer overflow-hidden transition-all hover:border-primary"
            onClick={handleAdminLogin}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Admin Portal</h3>
                <p className="text-sm text-muted-foreground">Full organizational monitoring & oversight</p>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </motion.div>

          {/* Coordinator Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full" />
            <div className="flex items-center gap-4 relative z-10 mb-6">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <UserCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Coordinator Portal</h3>
                <p className="text-sm text-muted-foreground">Field operations & child monitoring</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <label className="text-sm font-medium">Select Coordinator Persona</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCoordinatorId}
                onChange={(e) => setSelectedCoordinatorId(e.target.value)}
              >
                <option value="" disabled>Choose a coordinator...</option>
                {coordinators.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.district}</option>
                ))}
              </select>
              
              <button 
                onClick={handleCoordinatorLogin}
                disabled={!selectedCoordinatorId}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Enter Field Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
