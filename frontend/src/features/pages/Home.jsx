import React,{useState,useRef} from "react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

const Home = () => {

const {loading,generateReport,reports} = useInterview()
const { user, handleLogout } = useAuth();
const [jobDescription,setJobDescription] = useState("")
const [selfDescription,setSelfDescription] = useState("")
const resumeInputRef = useRef()
const navigate = useNavigate()

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleGenerateReport = async() => {
    const resumeFile = resumeInputRef.current.files[0];

    if (!resumeFile) {
      alert("Please upload your resume PDF before generating the report.");
      return;
    }

    const isPdf = resumeFile.type === "application/pdf" || resumeFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Only PDF resume files are supported.");
      return;
    }

    const data = await generateReport({jobDescription, selfDescription, resume: resumeFile});
    if (data?._id) {
      navigate(`/interview/${data._id}`);
    }
  }

  if(loading){
    return (
      <main>
        <h1>Loading your interview plan ....</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#111111] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-[#181818] rounded-xl p-6 sm:p-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="text-lime-400 font-semibold">{user?.username || user?.email || "User"}</p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-lime-500/60 bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-lime-300 transition hover:bg-lime-500 hover:text-black"
          >
            Logout
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-lime-400 text-2xl sm:text-3xl font-bold text-center mb-2">
          ResumeIQ
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
          Generate your personalized AI interview report
        </p>

        {/* Main Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Section */}
          <div className="flex flex-col">
            <label
              htmlFor="jobDescription"
              className="text-lime-400 text-sm font-semibold mb-3"
            >
              Job Description
            </label>

            <textarea
              onChange={(e)=>setJobDescription(e.target.value)}
              name="jobDescription"
              id="jobDescription"
              placeholder="Enter job description..."
              className="w-full min-h-[250px] md:min-h-[400px] p-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition resize-none"
            />
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-6">

            {/* Upload Resume */}
            <div className="input-group">
              <label
                htmlFor="resume"
                className="block text-lime-400 text-sm font-semibold mb-3"
              >
                Upload Resume
              </label>
              <input
              ref={resumeInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.doc,.docx"
                className="w-full p-3 rounded-2xl bg-[#202020] border-2 border-[#383838] text-gray-400 text-sm
                file:mr-4 file:py-2 file:px-4 file:rounded-xl
                file:border-0 file:bg-lime-500 file:text-black
                file:font-semibold hover:file:bg-emerald-500
                transition cursor-pointer"
              />
            </div>

            {/* Self Description */}
            <div className="input-group flex flex-col flex-1">
              <label
                htmlFor="selfDescription"
                className="text-lime-400 text-sm font-semibold mb-3"
              >
                Self Description
              </label>

              <textarea
              onChange={(e)=>setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Tell us about yourself, your skills, experience, and career goals..."
                className="w-full min-h-[180px] md:min-h-[250px] p-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition resize-none"
              />
            </div>

          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8">
          <button
          onClick={handleGenerateReport}
            type="button"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 text-white text-base font-bold hover:scale-[1.01] hover:shadow-xl hover:shadow-lime-500/20 transition disabled:opacity-50"
          >
            Generate Interview Report →
          </button>
        </div>

      </div>
    </main>
  );
};

export default Home;
