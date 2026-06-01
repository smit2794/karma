import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./store";
import { ThemeProvider } from "./components/theme-provider";
import RoleSelection from "./pages/public/RoleSelection";
import MainLayout from "./layouts/MainLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import ChildrenPage from "./pages/admin/ChildrenPage";
import InventoryPage from "./pages/admin/InventoryPage";
import ProgramsPage from "./pages/admin/ProgramsPage";
import FoodDistributionPage from "./pages/admin/FoodDistributionPage";
import CoordinatorsPage from "./pages/admin/CoordinatorsPage";
import WorkersPage from "./pages/admin/WorkersPage";
import EventsPage from "./pages/admin/EventsPage";
import AddChildPage from "./pages/coordinator/AddChildPage";

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: "admin" | "coordinator" }) => {
  const { role } = useAppContext();
  
  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><MainLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="food" element={<FoodDistributionPage />} />
        <Route path="coordinators" element={<CoordinatorsPage />} />
        <Route path="workers" element={<WorkersPage />} />
        <Route path="events" element={<EventsPage />} />
      </Route>

      {/* Coordinator Routes */}
      <Route path="/coordinator" element={<ProtectedRoute allowedRole="coordinator"><MainLayout /></ProtectedRoute>}>
        <Route index element={<CoordinatorDashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="add-child" element={<AddChildPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="food" element={<FoodDistributionPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="workers" element={<WorkersPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="flex h-screen items-center justify-center text-xl">404 - Page Not Found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="karma-ui-theme">
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
