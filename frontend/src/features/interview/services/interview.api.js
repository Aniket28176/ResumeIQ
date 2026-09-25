import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/+$/, '')

const api = axios.create({
    baseURL: `${apiBaseUrl}/interview`,
    withCredentials: true,
})


export const generateInterviewReport = async ({jobDescription, selfDescription, resume})=>{
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resume);
    const response = await api.post("/", formData,{ 
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export const getAllInterviewReports = async ()=>{
    const response = await api.get("/")
    return response.data
}

export const getInterviewReportById = async (interviewId)=>{
    const response = await api.get(`/report/${interviewId}`)
    return response.data
}

export const generateResumePdf = async ({interviewReportId})=>{
    const response = await api.post(`/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })
    return response.data
}