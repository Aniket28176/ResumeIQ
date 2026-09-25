import React, { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams } from "react-router-dom";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: "</>",
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: "💬",
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: "➤",
  },
];

// Question Card
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#383838] bg-[#202020] transition hover:border-lime-500/40">
      {/* Question Header */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 sm:p-5 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-sm font-bold text-lime-400">
          Q{index + 1}
        </span>

        <p className="flex-1 text-sm sm:text-base font-medium leading-relaxed text-white">
          {item.question}
        </p>

        <span
          className={`text-lime-400 text-lg transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      {/* Expanded Content */}
      {open && (
        <div className="space-y-5 border-t border-[#383838] p-4 sm:p-5">
          {/* Intention */}
          <div>
            <span className="mb-3 inline-block rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              Intention
            </span>

            <p className="text-sm leading-7 text-gray-400">
              {item.intention}
            </p>
          </div>

          {/* Model Answer */}
          <div>
            <span className="mb-3 inline-block rounded-lg bg-lime-500/10 px-3 py-1 text-xs font-semibold text-lime-400">
              Model Answer
            </span>

            <p className="text-sm leading-7 text-gray-300 whitespace-pre-line">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Roadmap Day Card
const RoadMapDay = ({ day }) => (
  <div className="rounded-2xl border border-[#383838] bg-[#202020] p-5 transition hover:border-lime-500/40">
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <span className="rounded-lg bg-lime-500/10 px-3 py-1.5 text-xs font-bold text-lime-400">
        Day {day.day}
      </span>

      <h3 className="text-sm sm:text-base font-semibold text-white">
        {day.focus}
      </h3>
    </div>

    <ul className="space-y-3">
      {day.tasks.map((task, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-sm leading-6 text-gray-400"
        >
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-400" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

// Main Interview Component
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");

  const { report, getReportById, loading, getResumePdf } =
    useInterview();

  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // Loading Screen
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111111] px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#383838] border-t-lime-400" />

          <h1 className="text-lg font-semibold text-white">
            Loading your interview plan...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we prepare your report.
          </p>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111111] px-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white">
            Interview report unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We could not find a report for this interview.
          </p>
        </div>
      </main>
    );
  }

  const matchScore = report.matchScore ?? report.mathScore ?? 0;
  const technicalQuestions = report.technicalQuestions ?? [];
  const behavioralQuestions = report.behavioralQuestions ?? [];
  const preparationPlans = report.preparationPlans ?? report.preparationPlan ?? [];
  const skillGaps = report.skillGaps ?? [];

  const scoreColor =
    matchScore >= 80
      ? "text-lime-400 border-lime-400"
      : matchScore >= 60
      ? "text-yellow-400 border-yellow-400"
      : "text-red-400 border-red-400";

  const currentQuestions =
    activeNav === "technical"
      ? technicalQuestions
      : behavioralQuestions;

  return (
    <main className="min-h-screen bg-[#111111] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-lime-400">
            ResumeIQ
          </h1>

          <p className="mt-2 text-center text-sm sm:text-base text-gray-400">
            Your personalized AI interview preparation report
          </p>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]">

          {/* Left Navigation */}
          <aside className="h-fit rounded-2xl border border-[#303030] bg-[#181818] p-4 sm:p-5">
            <p className="mb-4 px-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Sections
            </p>

            <nav className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    activeNav === item.id
                      ? "bg-lime-500 text-black shadow-lg shadow-lime-500/10"
                      : "text-gray-400 hover:bg-[#252525] hover:text-white"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/10 text-xs font-bold">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Download Resume */}
            {/* Download Resume */}
<button
  type="button"
  onClick={() => getResumePdf(interviewId)}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-lime-500 to-emerald-600 px-4 py-3 text-sm font-bold text-black transition hover:scale-[1.02] hover:shadow-lg hover:shadow-lime-500/20 active:scale-[0.98]"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>

  <span className="ml-2">Download Resume</span>
</button>
          </aside>

          {/* Center Content */}
          <section className="min-w-0 rounded-2xl border border-[#303030] bg-[#181818] p-4 sm:p-6 lg:p-7">

            {/* Technical / Behavioral Questions */}
            {(activeNav === "technical" ||
              activeNav === "behavioral") && (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {activeNav === "technical"
                        ? "Technical Questions"
                        : "Behavioral Questions"}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Expand a question to view its intention and model answer.
                    </p>
                  </div>

                  <span className="rounded-xl border border-lime-500/20 bg-lime-500/10 px-3 py-2 text-xs font-semibold text-lime-400">
                    {currentQuestions.length} Questions
                  </span>
                </div>

                <div className="space-y-4">
                  {currentQuestions.map((question, index) => (
                    <QuestionCard
                      key={index}
                      item={question}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Preparation Roadmap */}
            {activeNav === "roadmap" && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Preparation Road Map
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Follow this personalized plan to prepare for your interview.
                  </p>

                  <span className="mt-4 inline-block rounded-xl border border-lime-500/20 bg-lime-500/10 px-3 py-2 text-xs font-semibold text-lime-400">
                    {preparationPlans.length}-Day Plan
                  </span>
                </div>

                <div className="space-y-4">
                  {preparationPlans.map((day) => (
                    <RoadMapDay key={day.day} day={day} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Right Sidebar */}
          <aside className="h-fit rounded-2xl border border-[#303030] bg-[#181818] p-5 sm:p-6">

            {/* Match Score */}
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Match Score
              </p>

              <div className="my-5 flex justify-center">
                <div
                  className={`flex h-36 w-36 flex-col items-center justify-center rounded-3xl border-8 bg-[#202020] ${scoreColor}`}
                >
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {matchScore}
                    </span>

                    <span className="text-lg font-semibold">%</span>
                  </div>

                  <span className="mt-1 text-xs text-gray-500">
                    Match
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-300">
                {matchScore >= 80
                  ? "Strong match for this role"
                  : matchScore >= 60
                  ? "Moderate match for this role"
                  : "Keep improving your skills"}
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-[#383838]" />

            {/* Skill Gaps */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Skill Gaps
                </h3>

                <span className="rounded-lg bg-[#252525] px-2 py-1 text-xs text-gray-400">
                  {skillGaps.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillGaps.map((gap, index) => {
                  const severityStyle = {
                    high: "border-red-500/30 bg-red-500/10 text-red-400",
                    medium:
                      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
                    low: "border-lime-500/30 bg-lime-500/10 text-lime-400",
                  };

                  const tagStyle =
                    severityStyle[gap.severity?.toLowerCase()] ||
                    "border-[#383838] bg-[#202020] text-gray-400";

                  return (
                    <span
                      key={index}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${tagStyle}`}
                    >
                      {gap.skill}
                    </span>
                  );
                })}
              </div>

              {skillGaps.length === 0 && (
                <p className="text-sm text-gray-500">
                  No skill gaps identified.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-600">
          Powered by ResumeIQ AI
        </footer>
      </div>
    </main>
  );
};

export default Interview;
