export type Role = "admin" | "coordinator";

export type RiskLevel = "High" | "Medium" | "Low";

export interface CoordinatorHistory {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Coordinator {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  district: string;
  status: "Active" | "On Leave";
  history: CoordinatorHistory[];
}

export type WorkerCategory = "Nutrition Worker" | "Education Worker" | "Slum Outreach Worker" | "Health Worker" | "Field Worker" | "Community Worker" | "Women & Child Development Worker";

export interface Worker {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  category: WorkerCategory;
  coordinatorId: string;
  villageId: string;
  status: "Active" | "Inactive";
}

export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinatorId: string;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
}

export interface Vaccination {
  name: "BCG" | "OPV" | "DPT" | "Measles" | "Polio";
  status: "Completed" | "Pending" | "Missed";
  date?: string;
}

export interface Milestone {
  name: "Walking" | "Speaking" | "Learning Skills" | "Social Skills";
  status: "Achieved" | "Pending" | "Delayed";
  date?: string;
}

export interface HealthRecord {
  date: string;
  height: number;
  weight: number;
  muac: number;
  nutritionStatus: "Healthy" | "Malnourished" | "Severely Malnourished";
}

export interface Intervention {
  id: string;
  date: string;
  type: "Supplement" | "Millet Distribution" | "Activity";
  description: string;
  result?: string;
}

export interface Visit {
  id: string;
  date: string;
  type: "Home Visit" | "Checkup";
  observation: string;
  status: "Completed" | "Scheduled" | "Missed";
}

export interface Child {
  id: string;
  name: string;
  photo: string;
  age: number;
  dob: string;
  gender: "Male" | "Female";
  aadhaar: string;
  villageId: string;
  coordinatorId: string;
  fatherName: string;
  motherName: string;
  fatherAadhaar: string;
  motherAadhaar: string;
  phone: string;
  address: string;
  health: {
    height: number;
    weight: number;
    muac: number;
    bmi: number;
    nutritionStatus: "Healthy" | "Malnourished" | "Severely Malnourished";
    lastCheckup: string;
  };
  healthHistory: HealthRecord[];
  vaccinations: Vaccination[];
  milestones: Milestone[];
  interventions: Intervention[];
  visits: Visit[];
  riskLevel: RiskLevel;
  status: "Active" | "Graduated";
}

export interface FoodDistribution {
  id: string;
  villageId: string;
  foodCategory: "Staples" | "Proteins" | "Oils" | "Supplements";
  foodItem: string;
  quantity: number;
  unit: "kg" | "L" | "kits";
  childrenServed: number;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Food" | "Medicine" | "Education Kits" | "Nutrition Kits";
  currentStock: number;
  usedStock: number;
  remainingStock: number;
  district: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "distribution" | "health_camp" | "visit" | "alert";
  coordinatorId?: string;
}

export interface Program {
  id: string;
  name: string;
  category: "Education" | "Nutrition" | "Health" | "Vaccination" | "Women Empowerment" | "Child Development" | "Skill Development";
  description: string;
  startDate: string;
  endDate: string;
  status: "Ongoing" | "Completed" | "Planned";
  coordinatorId: string;
  villageIds: string[];
  workerIds: string[];
}

export interface NgoEvent {
  id: string;
  name: string;
  location: string;
  district: string;
  villageId: string;
  date: string;
  description: string;
  coordinatorId: string;
  workerIds: string[];
  childrenAttended: number;
  status: "Upcoming" | "Completed" | "Ongoing";
  photos: string[];
  videos: string[];
}

// ---------------------------------------------------------
// STATIC MOCK DATA
// ---------------------------------------------------------

export const mockCoordinators: Coordinator[] = [
  { 
    id: "C1", name: "Vikram Desai", photo: "https://i.pravatar.cc/150?u=vikram", phone: "+91 9876543201", email: "vikram@karmafoundation.org", district: "Ahmedabad", status: "Active",
    history: [
      { id: "H1", date: "2024-01-10", title: "Assigned to Ahmedabad", description: "Began overseeing child welfare in Sanand village." },
      { id: "H2", date: "2024-03-05", title: "Managed Nutrition Drive", description: "Successfully distributed 50kg staples." }
    ]
  },
  { 
    id: "C2", name: "Neha Sharma", photo: "https://i.pravatar.cc/150?u=neha", phone: "+91 9876543202", email: "neha@karmafoundation.org", district: "Dahod", status: "Active",
    history: [
      { id: "H3", date: "2023-11-01", title: "Joined Foundation", description: "Started working as a field coordinator in Dahod." },
      { id: "H4", date: "2024-02-10", title: "Completed Child Survey", description: "Identified high risk malnutrition cases in Fatepura." }
    ]
  },
  { id: "C3", name: "Rahul Mehta", photo: "https://i.pravatar.cc/150?u=rahul", phone: "+91 9876543203", email: "rahul@karmafoundation.org", district: "Modasa", status: "Active", history: [] },
  { id: "C4", name: "Pooja Patel", photo: "https://i.pravatar.cc/150?u=pooja", phone: "+91 9876543204", email: "pooja@karmafoundation.org", district: "Mehsana", status: "Active", history: [] },
  { id: "C5", name: "Amit Shah", photo: "https://i.pravatar.cc/150?u=amit", phone: "+91 9876543205", email: "amit@karmafoundation.org", district: "Rajkot", status: "On Leave", history: [] },
];

export const mockVillages: Village[] = [
  { id: "V1", name: "Sanand", district: "Ahmedabad", state: "Gujarat", coordinatorId: "C1", lat: 22.9833, lng: 72.3833, riskLevel: "Low" },
  { id: "V2", name: "Fatepura", district: "Dahod", state: "Gujarat", coordinatorId: "C2", lat: 23.1667, lng: 74.2000, riskLevel: "High" },
  { id: "V3", name: "Meghraj", district: "Modasa", state: "Gujarat", coordinatorId: "C3", lat: 23.5000, lng: 73.4500, riskLevel: "Medium" },
  { id: "V4", name: "Visnagar", district: "Mehsana", state: "Gujarat", coordinatorId: "C4", lat: 23.7000, lng: 72.5500, riskLevel: "Low" },
  { id: "V5", name: "Gondal", district: "Rajkot", state: "Gujarat", coordinatorId: "C5", lat: 21.9667, lng: 70.8000, riskLevel: "Medium" },
];

export const mockWorkers: Worker[] = [
  { id: "W1", name: "Rajesh Parmar", photo: "https://i.pravatar.cc/150?u=rajesh", phone: "+91 9123456701", email: "rajesh@worker.org", category: "Nutrition Worker", coordinatorId: "C1", villageId: "V1", status: "Active" },
  { id: "W2", name: "Kajal Rathod", photo: "https://i.pravatar.cc/150?u=kajal", phone: "+91 9123456702", email: "kajal@worker.org", category: "Health Worker", coordinatorId: "C2", villageId: "V2", status: "Active" },
  { id: "W3", name: "Mahesh Bhil", photo: "https://i.pravatar.cc/150?u=mahesh", phone: "+91 9123456703", email: "mahesh@worker.org", category: "Education Worker", coordinatorId: "C3", villageId: "V3", status: "Active" },
  { id: "W4", name: "Geeta Solanki", photo: "https://i.pravatar.cc/150?u=geeta", phone: "+91 9123456704", email: "geeta@worker.org", category: "Women & Child Development Worker", coordinatorId: "C4", villageId: "V4", status: "Active" },
  { id: "W5", name: "Sanjay Koli", photo: "https://i.pravatar.cc/150?u=sanjay", phone: "+91 9123456705", email: "sanjay@worker.org", category: "Field Worker", coordinatorId: "C5", villageId: "V5", status: "Active" },
];

export const mockChildren: Child[] = [
  {
    id: "CH1", name: "Aarav Parmar", photo: "https://i.pravatar.cc/150?u=aarav", age: 5, dob: "2019-05-12", gender: "Male", aadhaar: "1234 5678 0001",
    villageId: "V1", coordinatorId: "C1", fatherName: "Rajesh Parmar", motherName: "Sita Parmar", fatherAadhaar: "9876 5432 0001", motherAadhaar: "8765 4321 0001",
    phone: "9876500001", address: "Plot 12, Sanand Market",
    health: { height: 105, weight: 16, muac: 14.5, bmi: 14.5, nutritionStatus: "Healthy", lastCheckup: "2024-01-15" },
    healthHistory: [
      { date: "2023-10-10", height: 102, weight: 15.5, muac: 14.2, nutritionStatus: "Healthy" },
      { date: "2024-01-15", height: 105, weight: 16, muac: 14.5, nutritionStatus: "Healthy" }
    ],
    vaccinations: [
      { name: "BCG", status: "Completed", date: "2019-06-01" },
      { name: "OPV", status: "Completed", date: "2019-07-01" },
      { name: "DPT", status: "Pending" }
    ],
    milestones: [
      { name: "Walking", status: "Achieved", date: "2020-05-12" },
      { name: "Speaking", status: "Achieved", date: "2021-02-10" }
    ],
    interventions: [],
    visits: [
      { id: "VS1", date: "2024-01-15", type: "Checkup", observation: "Normal growth", status: "Completed" }
    ],
    riskLevel: "Low", status: "Active"
  },
  {
    id: "CH2", name: "Diya Rathod", photo: "https://i.pravatar.cc/150?u=diya", age: 6, dob: "2018-08-20", gender: "Female", aadhaar: "1234 5678 0002",
    villageId: "V2", coordinatorId: "C2", fatherName: "Kishore Rathod", motherName: "Meena Rathod", fatherAadhaar: "9876 5432 0002", motherAadhaar: "8765 4321 0002",
    phone: "9876500002", address: "Lane 4, Fatepura",
    health: { height: 110, weight: 14, muac: 11.2, bmi: 11.6, nutritionStatus: "Severely Malnourished", lastCheckup: "2024-02-10" },
    healthHistory: [
      { date: "2023-11-05", height: 108, weight: 13.5, muac: 11.0, nutritionStatus: "Severely Malnourished" },
      { date: "2024-02-10", height: 110, weight: 14, muac: 11.2, nutritionStatus: "Severely Malnourished" }
    ],
    vaccinations: [
      { name: "BCG", status: "Completed", date: "2018-09-01" },
      { name: "Measles", status: "Missed" }
    ],
    milestones: [
      { name: "Walking", status: "Achieved", date: "2019-10-12" },
      { name: "Learning Skills", status: "Delayed" }
    ],
    interventions: [
      { id: "INT1", date: "2024-02-12", type: "Supplement", description: "Provided high-calorie protein mix", result: "Ongoing monitoring" }
    ],
    visits: [
      { id: "VS2", date: "2024-02-10", type: "Home Visit", observation: "Child appears weak. Counselled parents on diet.", status: "Completed" },
      { id: "VS3", date: "2024-03-20", type: "Home Visit", observation: "", status: "Scheduled" }
    ],
    riskLevel: "High", status: "Active"
  },
  {
    id: "CH3", name: "Karan Bhil", photo: "https://i.pravatar.cc/150?u=karan", age: 7, dob: "2017-11-05", gender: "Male", aadhaar: "1234 5678 0003",
    villageId: "V3", coordinatorId: "C3", fatherName: "Mahesh Bhil", motherName: "Leela Bhil", fatherAadhaar: "9876 5432 0003", motherAadhaar: "8765 4321 0003",
    phone: "9876500003", address: "Main Bazaar, Meghraj",
    health: { height: 118, weight: 20, muac: 13.5, bmi: 14.4, nutritionStatus: "Healthy", lastCheckup: "2024-03-05" },
    healthHistory: [
      { date: "2024-03-05", height: 118, weight: 20, muac: 13.5, nutritionStatus: "Healthy" }
    ],
    vaccinations: [
      { name: "BCG", status: "Completed", date: "2017-12-01" },
      { name: "Polio", status: "Completed", date: "2018-02-01" }
    ],
    milestones: [
      { name: "Social Skills", status: "Achieved", date: "2022-01-10" }
    ],
    interventions: [],
    visits: [],
    riskLevel: "Low", status: "Active"
  },
  {
    id: "CH4", name: "Priya Solanki", photo: "https://i.pravatar.cc/150?u=priya", age: 8, dob: "2016-02-14", gender: "Female", aadhaar: "1234 5678 0004",
    villageId: "V4", coordinatorId: "C4", fatherName: "Mohan Solanki", motherName: "Geeta Solanki", fatherAadhaar: "9876 5432 0004", motherAadhaar: "8765 4321 0004",
    phone: "9876500004", address: "Near Temple, Visnagar",
    health: { height: 125, weight: 22, muac: 12.5, bmi: 14.1, nutritionStatus: "Malnourished", lastCheckup: "2024-01-20" },
    healthHistory: [
      { date: "2023-09-10", height: 123, weight: 21, muac: 12.3, nutritionStatus: "Malnourished" },
      { date: "2024-01-20", height: 125, weight: 22, muac: 12.5, nutritionStatus: "Malnourished" }
    ],
    vaccinations: [
      { name: "Measles", status: "Pending" }
    ],
    milestones: [],
    interventions: [
      { id: "INT2", date: "2024-01-22", type: "Millet Distribution", description: "Given 5kg Ragi", result: "Slight weight improvement" }
    ],
    visits: [
      { id: "VS4", date: "2024-01-20", type: "Checkup", observation: "Underweight for age", status: "Completed" }
    ],
    riskLevel: "Medium", status: "Active"
  },
  {
    id: "CH5", name: "Ravi Koli", photo: "https://i.pravatar.cc/150?u=ravi", age: 9, dob: "2015-09-30", gender: "Male", aadhaar: "1234 5678 0005",
    villageId: "V5", coordinatorId: "C5", fatherName: "Sanjay Koli", motherName: "Kamla Koli", fatherAadhaar: "9876 5432 0005", motherAadhaar: "8765 4321 0005",
    phone: "9876500005", address: "Gondal Village Square",
    health: { height: 130, weight: 28, muac: 15.0, bmi: 16.6, nutritionStatus: "Healthy", lastCheckup: "2024-03-12" },
    healthHistory: [
      { date: "2024-03-12", height: 130, weight: 28, muac: 15.0, nutritionStatus: "Healthy" }
    ],
    vaccinations: [
      { name: "DPT", status: "Completed", date: "2016-01-10" }
    ],
    milestones: [],
    interventions: [],
    visits: [],
    riskLevel: "Low", status: "Active"
  }
];

export const mockInventory: InventoryItem[] = [
  { id: "INV1", name: "Rice Bag (50kg)", category: "Food", currentStock: 500, usedStock: 350, remainingStock: 150, district: "Ahmedabad", status: "In Stock" },
  { id: "INV2", name: "Dal Bag (30kg)", category: "Food", currentStock: 200, usedStock: 180, remainingStock: 20, district: "Dahod", status: "Low Stock" },
  { id: "INV3", name: "Cooking Oil (15L)", category: "Food", currentStock: 100, usedStock: 100, remainingStock: 0, district: "Modasa", status: "Out of Stock" },
  { id: "INV4", name: "Paracetamol", category: "Medicine", currentStock: 1000, usedStock: 400, remainingStock: 600, district: "Mehsana", status: "In Stock" },
  { id: "INV5", name: "Nutrition Protein Mix", category: "Nutrition Kits", currentStock: 300, usedStock: 290, remainingStock: 10, district: "Rajkot", status: "Low Stock" },
  { id: "INV6", name: "Millet Pack (5kg)", category: "Nutrition Kits", currentStock: 800, usedStock: 200, remainingStock: 600, district: "Ahmedabad", status: "In Stock" },
];

export const mockFoodDistribution: FoodDistribution[] = [
  { id: "FD1", villageId: "V1", foodCategory: "Staples", foodItem: "Rice", quantity: 50, unit: "kg", childrenServed: 25, date: "2024-03-01" },
  { id: "FD2", villageId: "V2", foodCategory: "Proteins", foodItem: "Dal", quantity: 15, unit: "kg", childrenServed: 20, date: "2024-03-05" },
  { id: "FD3", villageId: "V3", foodCategory: "Oils", foodItem: "Cooking Oil", quantity: 10, unit: "L", childrenServed: 30, date: "2024-03-10" },
  { id: "FD4", villageId: "V4", foodCategory: "Supplements", foodItem: "Nutrition Kits", quantity: 40, unit: "kits", childrenServed: 40, date: "2024-03-12" },
  { id: "FD5", villageId: "V5", foodCategory: "Staples", foodItem: "Wheat", quantity: 60, unit: "kg", childrenServed: 35, date: "2024-03-15" },
];

export const mockActivities: Activity[] = [
  { id: "ACT1", title: "Monthly Food Distribution", description: "Distributed rice and dal in Sanand.", date: "2024-03-01", type: "distribution", coordinatorId: "C1" },
  { id: "ACT2", title: "Health Checkup Camp", description: "Completed BMI checks for 20 children in Fatepura.", date: "2024-03-05", type: "health_camp", coordinatorId: "C2" },
  { id: "ACT3", title: "Coordinator Site Visit", description: "Rahul visited Meghraj village workers.", date: "2024-03-10", type: "visit", coordinatorId: "C3" },
  { id: "ACT4", title: "Low Inventory Alert", description: "Cooking oil out of stock at Modasa.", date: "2024-03-11", type: "alert" },
  { id: "ACT5", title: "New Children Enrollment", description: "Added 5 new children to Gondal program.", date: "2024-03-15", type: "visit", coordinatorId: "C5" },
];

export const mockPrograms: Program[] = [
  { id: "PRG1", name: "Sanand Nutrition Drive 2024", category: "Nutrition", description: "Intensive 3-month nutrition supplementation for under-5 children.", startDate: "2024-01-01", endDate: "2024-04-01", status: "Ongoing", coordinatorId: "C1", villageIds: ["V1"], workerIds: ["W1"] },
  { id: "PRG2", name: "Fatepura Health Camp", category: "Health", description: "Comprehensive health checkups and MUAC screenings.", startDate: "2024-02-10", endDate: "2024-02-15", status: "Completed", coordinatorId: "C2", villageIds: ["V2"], workerIds: ["W2"] },
  { id: "PRG3", name: "Meghraj Ed Support", category: "Education", description: "Providing early learning kits to preschool children.", startDate: "2024-03-01", endDate: "2024-06-01", status: "Ongoing", coordinatorId: "C3", villageIds: ["V3"], workerIds: ["W3"] },
  { id: "PRG4", name: "Visnagar Women Emp", category: "Women Empowerment", description: "Skill development for mothers of malnourished children.", startDate: "2024-04-01", endDate: "2024-10-01", status: "Planned", coordinatorId: "C4", villageIds: ["V4"], workerIds: ["W4"] },
  { id: "PRG5", name: "Gondal Vax Drive", category: "Vaccination", description: "Catch-up vaccination campaign for missed measles doses.", startDate: "2024-03-15", endDate: "2024-03-30", status: "Ongoing", coordinatorId: "C5", villageIds: ["V5"], workerIds: ["W5"] },
];

export const mockEvents: NgoEvent[] = [
  {
    id: "EVT1", name: "Nutrition Awareness Camp", location: "Sanand Community Hall", district: "Ahmedabad", villageId: "V1", date: "2024-03-20T10:00:00Z", description: "A camp to educate mothers on proper nutrition and locally available superfoods.", coordinatorId: "C1", workerIds: ["W1"], childrenAttended: 45, status: "Upcoming",
    photos: ["https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80", "https://images.unsplash.com/photo-1593113565694-c6f8716c0296?w=800&q=80"],
    videos: ["https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&q=80"]
  },
  {
    id: "EVT2", name: "Village Health Camp", location: "Fatepura Primary School", district: "Dahod", villageId: "V2", date: "2024-02-10T09:00:00Z", description: "Comprehensive health and weight checkups for toddlers.", coordinatorId: "C2", workerIds: ["W2"], childrenAttended: 120, status: "Completed",
    photos: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"],
    videos: []
  },
  {
    id: "EVT3", name: "Vaccination Drive", location: "Meghraj Panchayat Office", district: "Modasa", villageId: "V3", date: "2024-03-25T08:00:00Z", description: "Polio and Measles drop administration.", coordinatorId: "C3", workerIds: ["W3"], childrenAttended: 0, status: "Upcoming",
    photos: [], videos: []
  },
  {
    id: "EVT4", name: "Education Workshop", location: "Visnagar Girls School", district: "Mehsana", villageId: "V4", date: "2024-01-15T11:00:00Z", description: "Early childhood development and toy-based learning.", coordinatorId: "C4", workerIds: ["W4"], childrenAttended: 60, status: "Completed",
    photos: ["https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"], videos: []
  },
  {
    id: "EVT5", name: "Women Empowerment Program", location: "Gondal Village Square", district: "Rajkot", villageId: "V5", date: "2024-03-10T14:00:00Z", description: "Self-help group formation and micro-finance training for mothers.", coordinatorId: "C5", workerIds: ["W5"], childrenAttended: 30, status: "Completed",
    photos: ["https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?w=800&q=80"], videos: []
  }
];
