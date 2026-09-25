import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api/ai",
  withCredentials: true,
})

export async function generateInterviewReport(payload) {
  const response = await api.post("/interview-report", payload)
  return response.data
}
