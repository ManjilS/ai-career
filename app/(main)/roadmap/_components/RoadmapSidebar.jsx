"use client";

import { Trash2, Clock, ChevronLeft, ChevronRight, History, Map } from "lucide-react";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RoadmapSidebar({ history, onSelect, onDelete, isOpen, onToggle, activeId }) {
    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                title={isOpen ? "Close history" : "Open history"}
                className="fixed top-24 left-0 z-50 flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-2 rounded-r-xl shadow-lg transition-all duration-200 hover:shadow-violet-500/40 hover:scale-105"
            >
                <History className="h-3.5 w-3.5" />
                {isOpen ? (
                    <ChevronLeft className="h-3.5 w-3.5" />
                ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                )}
            </button>

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
                    }`}
            >
                {/* Glass backdrop */}
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl border-r border-white/10" />

                <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 pt-6 pb-4 border-b border-white/10">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
                            <History className="h-4 w-4 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-sm">Roadmap History</h2>
                            <p className="text-slate-500 text-xs">{history.length} saved roadmap{history.length !== 1 ? "s" : ""}</p>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Map className="h-7 w-7 text-slate-600" />
                                </div>
                                <p className="text-slate-500 text-xs leading-relaxed px-4">
                                    No roadmaps yet. Generate one to see it here!
                                </p>
                            </div>
                        ) : (
                            history.map((item) => {
                                const isActive = item.id === activeId;
                                return (
                                    <div
                                        key={item.id}
                                        className={`group relative rounded-xl border transition-all duration-150 cursor-pointer ${isActive
                                                ? "bg-violet-600/20 border-violet-500/50 shadow-lg shadow-violet-500/10"
                                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <button
                                            onClick={() => onSelect(item)}
                                            className="w-full text-left px-3 py-3 pr-10"
                                        >
                                            <p className={`text-sm font-medium leading-tight mb-1 ${isActive ? "text-violet-200" : "text-white"}`}>
                                                {item.careerGoal}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-slate-500" />
                                                <span className="text-slate-500 text-xs">{formatDate(item.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1.5">
                                                <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                                                    {item.roadmapData?.stages?.length || 0} stages
                                                </span>
                                            </div>
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item.id);
                                            }}
                                            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-lg bg-red-500/0 hover:bg-red-500/20 text-slate-600 hover:text-red-400 flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100"
                                            title="Delete roadmap"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-white/10">
                        <p className="text-slate-600 text-xs text-center">
                            Roadmaps are saved automatically
                        </p>
                    </div>
                </div>
            </div>

            {/* Overlay when open on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    );
}
