import axios from "axios";
import * as mock from "./mock-data";
import { getUser } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// HTTP client
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
});

/**
 * Helper to execute API calls with automatic fallback to high-fidelity mock data.
 * This guarantees the frontend NEVER crashes during live demos, even if the backend is down.
 */
async function apiCall<T>(call: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await call();
  } catch (error) {
    const user = getUser();
    if (user?.id === "demo") {
      console.warn("Backend API call failed, falling back to mock data (demo mode):", error);
      return fallbackData;
    }
    console.error("Backend API call failed:", error);
    throw error; // REAL users get real errors
  }
}

// ─── Auth API ────────────────────────────────────────────────────────
export async function signup(payload: { email: string; password: string; name: string; company?: string }) {
  const res = await client.post("/users/", payload);
  return res.data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await client.post("/users/login", payload);
  return res.data;
}

// ─── Case Portfolio API ──────────────────────────────────────────────────────
export async function deleteCase(caseId: string) {
  const res = await client.delete(`/cases/${caseId}`);
  return res.data;
}

export async function getCases() {
  const user = getUser();
  const userId = user?.id === "demo" ? null : user?.id;
  
  return apiCall(async () => {
    const params = userId ? { user_id: userId } : {};
    const res = await client.get("/cases/", { params });
    // If it's a real user and we got a 200, don't fallback to demo data even if empty
    return res.data;
  }, user?.id === "demo" ? mock.casesList : []);
}

export async function getCase(caseId: string) {
  return apiCall(async () => {
    const res = await client.get(`/cases/${caseId}`);
    return res.data;
  }, mock.casesList.find((c) => c.id === caseId) || mock.casesList[0]);
}


// ─── Document Upload & Extraction API ────────────────────────────────────────
export async function getCaseDocuments(caseId: string) {
  return apiCall(async () => {
    const res = await client.get(`/cases/${caseId}/documents`);
    return res.data;
  }, mock.inboxDocuments.filter((d) => d.caseCreated === `Case #${caseId}`));
}

export async function getAllDocuments() {
  const user = getUser();
  const userId = user?.id === "demo" ? null : user?.id;

  return apiCall(async () => {
    const params = userId ? { user_id: userId } : {};
    const res = await client.get("/documents/", { params });
    return res.data;
  }, user?.id === "demo" ? mock.inboxDocuments : []);
}

export async function uploadDocument(file: File, caseId?: string, userId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (caseId) formData.append("case_id", caseId);
  if (userId) formData.append("user_id", userId);

  // No fallback here since file processing must happen on server
  const res = await client.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// ─── AI Analysis & Cross-Document Intelligence ──────────────────────────────
export async function getCaseAnalysis(caseId: string) {
  return apiCall(async () => {
    const res = await client.get(`/cases/${caseId}/analysis`);
    return res.data;
  }, {
    brief: "Policyholder filed a consumer complaint after claim rejection under exclusion clause 4.2. Accident details are missing.",
    timeline: mock.caseTimeline,
    missing_docs: mock.evidenceItems.filter((e) => e.status === "Missing").map((e) => e.name),
    recommendations: mock.recommendations,
    cross_doc: mock.crossDocComparisons,
    risk_reason: "Critical date and coverage inconsistencies detected.",
    confidence: 91,
  });
}

// ─── Case Notes API ──────────────────────────────────────────────────────────
export async function getCaseNotes(caseId: string) {
  return apiCall(async () => {
    const res = await client.get(`/cases/${caseId}/notes`);
    return res.data;
  }, [
    {
      author: "Anita Nair",
      role: "Legal Ops Manager",
      time: "2 hours ago",
      message: "Called panel surveyor — will send report by EOD tomorrow.",
      created_at: new Date().toISOString(),
    },
  ]);
}

export async function addCaseNote(caseId: string, author: string, message: string) {
  return apiCall(async () => {
    const res = await client.post(`/cases/${caseId}/notes`, { author, message });
    return res.data;
  }, {
    case_id: caseId,
    author,
    message,
    created_at: new Date().toISOString(),
  });
}

// ─── User Management API ─────────────────────────────────────────────────────
export async function getUsers() {
  return apiCall(async () => {
    const res = await client.get("/users/");
    return res.data;
  }, mock.settingsUsers);
}

// ─── Direct Chat API ──────────────────────────────────────────────────────────
export async function queryChat(messages: {role: string, text: string}[]) {
  try {
    const res = await client.post("/chat", { messages });
    return res.data;
  } catch (error) {
    console.error("Chat request failed:", error);
    return { response: "Unable to reach AI assistant. Please ensure backend is running." };
  }
}

