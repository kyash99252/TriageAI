export interface User {
  _id: string;
  email: string;
  role: "user" | "moderator" | "admin";
  skills?: string[];
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status?: "Open" | "In Progress" | "Closed" | "New" | "Resolved";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  relatedSkills?: string[];
  helpfulNotes?: string;
  assignedTo?: {
    _id: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}