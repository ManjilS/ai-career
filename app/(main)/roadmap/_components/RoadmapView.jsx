"use client";

import { useState, useTransition } from "react";
import { generateCareerRoadmap } from "@/actions/roadmap";
import RoadmapFlow from "./RoadmapFlow";
import {
    Sparkles,
    Map,
    Loader2,
    Search,
    ChevronRight,
    BookOpen,
    Clock,
    Target,
    Lightbulb,
} from "lucide-react";
import { toast } from "sonner";

const EXAMPLE_GOALS = [
    "Frontend Developer",
    "Data Scientist",
    "AI Engineer",
    "DevOps Engineer",
    "Full Stack Developer",
    "Cybersecurity Analyst",
    "Product Manager",
    "Cloud Architect",
];

export default function RoadmapView() {
    const [careerGoal, setCareerGoal] = useState("");
    const [roadmapData, setRoadmapData] = useState(null);
    const [isPending, startTransition] = useTransition();

    const handleGenerate = (goal) => {
        const target = goal || careerGoal;
        if (!target.trim()) {
            toast.error("Please enter a career goal first.");
            return;
        }

        startTransition(async () => {
            try {
                const data = await generateCareerRoadmap(target.trim());
                setRoadmapData(data);
                setCareerGoal(target.trim());
                toast.success("Roadmap generated successfully!");
            } catch (err) {
                console.error(err);
                toast.error("Failed to generate roadmap. Please try again.");
            }
        });
    };

    const totalSkills = roadmapData?.stages?.reduce(
        (acc, s) => acc + (s.skills?.length || 0),
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-20 right-1/4 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute -bottom-10 left-1/2 w-96 h-48 bg-violet-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 px-4 pt-12 pb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-6">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span className="text-white/90 text-sm font-medium">AI-Powered Career Roadmap</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Your Career{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                            Roadmap
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Enter your dream career and get an interactive, AI-generated learning path with skills, resources, and milestones.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative z-10 max-w-2xl mx-auto px-4 pb-8">
                    <div className="flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl">
                        <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-xl px-4">
                            <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={careerGoal}
                                onChange={(e) => setCareerGoal(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                placeholder="e.g. Frontend Developer, Data Scientist..."
                                className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm py-3 outline-none"
                            />
                        </div>
                        <button
                            onClick={() => handleGenerate()}
                            disabled={isPending}
                            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-violet-500/30 hover:scale-105 active:scale-95"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            <span className="hidden sm:block">
                                {isPending ? "Generating..." : "Generate"}
                            </span>
                        </button>
                    </div>

                    {/* Example chips */}
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {EXAMPLE_GOALS.map((goal) => (
                            <button
                                key={goal}
                                onClick={() => {
                                    setCareerGoal(goal);
                                    handleGenerate(goal);
                                }}
                                disabled={isPending}
                                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-all duration-150 disabled:opacity-40"
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 pb-12">
                {/* Loading State */}
                {isPending && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-violet-400" />
                        </div>
                        <p className="text-slate-400 text-lg font-medium">Crafting your personalized roadmap...</p>
                        <p className="text-slate-500 text-sm">This may take a few seconds</p>
                    </div>
                )}

                {/* Empty State */}
                {!isPending && !roadmapData && (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Map className="h-12 w-12 text-slate-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-white text-xl font-semibold mb-2">No Roadmap Yet</h3>
                            <p className="text-slate-400 max-w-sm">
                                Enter a career goal above or click one of the example chips to generate your interactive roadmap.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mt-4">
                            {[
                                { icon: Target, title: "Goal-Oriented", desc: "Structured stages from beginner to expert" },
                                { icon: BookOpen, title: "Curated Resources", desc: "Hand-picked courses, books & platforms" },
                                { icon: Lightbulb, title: "Skill Mapping", desc: "Know exactly what skills to learn at each step" },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <Icon className="h-6 w-6 text-violet-400 mx-auto mb-2" />
                                    <p className="text-white text-sm font-semibold">{title}</p>
                                    <p className="text-slate-400 text-xs mt-1">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Roadmap Result */}
                {!isPending && roadmapData && (
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Result Header */}
                        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{roadmapData.title}</h2>
                                    <p className="text-slate-400 mt-1 text-sm">{roadmapData.description}</p>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl px-4 py-2 text-center">
                                        <p className="text-violet-300 text-xs">Stages</p>
                                        <p className="text-white font-bold text-lg">{roadmapData.stages?.length}</p>
                                    </div>
                                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2 text-center">
                                        <p className="text-blue-300 text-xs">Skills</p>
                                        <p className="text-white font-bold text-lg">{totalSkills}</p>
                                    </div>
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-center">
                                        <p className="text-emerald-300 text-xs">Resources</p>
                                        <p className="text-white font-bold text-lg">
                                            {roadmapData.stages?.reduce((a, s) => a + (s.resources?.length || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="flex items-center gap-2 text-slate-400 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                            <Lightbulb className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                            <span>Click the <strong className="text-slate-300">▼ arrow</strong> on any node to expand skills and resources. Use scroll to zoom, drag to pan.</span>
                        </div>

                        {/* React Flow Canvas */}
                        <div style={{ height: "70vh" }} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <RoadmapFlow roadmapData={roadmapData} />
                        </div>

                        {/* Stage List Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {roadmapData.stages?.map((stage, idx) => (
                                <div
                                    key={stage.id}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">{stage.label}</h4>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-slate-500" />
                                                <span className="text-slate-500 text-xs">{stage.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-3">{stage.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {stage.skills?.slice(0, 4).map((skill) => (
                                            <span key={skill} className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                        {stage.skills?.length > 4 && (
                                            <span className="text-xs text-slate-500">+{stage.skills.length - 4}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Regenerate */}
                        <div className="text-center">
                            <button
                                onClick={() => handleGenerate()}
                                disabled={isPending}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl transition-all duration-200"
                            >
                                <Sparkles className="h-4 w-4" />
                                Regenerate Roadmap
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
