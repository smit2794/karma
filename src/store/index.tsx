import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Role,
  Coordinator,
  Worker,
  Village,
  Child,
  InventoryItem,
  FoodDistribution,
  Activity,
  Program,
  NgoEvent,
  mockCoordinators,
  mockWorkers,
  mockVillages,
  mockChildren,
  mockInventory,
  mockFoodDistribution,
  mockActivities,
  mockPrograms,
  mockEvents,
} from "@/data/mockData";

interface AppState {
  role: Role | null;
  currentCoordinator: Coordinator | null;
  setRole: (role: Role | null) => void;
  setCurrentCoordinator: (coordinator: Coordinator | null) => void;
  
  // Data
  coordinators: Coordinator[];
  workers: Worker[];
  villages: Village[];
  children: Child[];
  inventory: InventoryItem[];
  foodDistribution: FoodDistribution[];
  activities: Activity[];
  programs: Program[];
  events: NgoEvent[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [currentCoordinator, setCurrentCoordinator] = useState<Coordinator | null>(null);

  const [coordinators] = useState<Coordinator[]>(mockCoordinators);
  const [workers] = useState<Worker[]>(mockWorkers);
  const [villages] = useState<Village[]>(mockVillages);
  const [childrenData] = useState<Child[]>(mockChildren);
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [foodDistribution] = useState<FoodDistribution[]>(mockFoodDistribution);
  const [activities] = useState<Activity[]>(mockActivities);
  const [programs] = useState<Program[]>(mockPrograms);
  const [events] = useState<NgoEvent[]>(mockEvents);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentCoordinator,
        setCurrentCoordinator,
        coordinators,
        workers,
        villages,
        children: childrenData,
        inventory,
        foodDistribution,
        activities,
        programs,
        events,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
