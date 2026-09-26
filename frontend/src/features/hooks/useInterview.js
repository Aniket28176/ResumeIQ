import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../interview/services/interview.api.js";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview/interview.context.jsx";
import { useParams } from "react-router-dom";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resume }) => {
        setLoading(true);
        let response = null;

        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resume });
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error generating interview report:", error);
            throw error;
        } finally {
            setLoading(false);
        }

        return response?.interviewReport;
    };

    const getReportById = async (value) => {
        const id = typeof value === "string" ? value : value?.interviewId;

        if (!id) {
            return null;
        }

        setLoading(true);
        let response = null;

        try {
            response = await getInterviewReportById(id);
            setReport(response?.interviewReport ?? response);
        } catch (error) {
            console.error("Error fetching interview report:", error);
        } finally {
            setLoading(false);
        }

        return response?.interviewReport ?? response;
    };

    const getReports = async () => {
        setLoading(true);
        let response = null;

        try {
            response = await getAllInterviewReports();
            setReports(response?.interviewReports ?? []);
        } catch (error) {
            console.error("Error fetching interview reports:", error);
        } finally {
            setLoading(false);
        }

        return response?.interviewReports ?? [];
    };

    const getResumePdf = async (value) => {
        const interviewReportId = typeof value === "string" ? value : value?.interviewReportId ?? value?.interviewId;

        if (!interviewReportId) {
            return null;
        }

        setLoading(true);
        let response = null;

        try {
            response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error generating resume PDF:", error);
        } finally {
            setLoading(false);
        }

        return response;
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return { loading, report, reports, generateReport, getReports, getResumePdf, getReportById };
};