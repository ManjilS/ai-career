"use client";

import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { Clock, BookOpen, Code2, ChevronDown, ChevronUp } from "lucide-react";

const stageColors = [
    { bg: "from-violet-600 to-purple-700", light: "bg-violet-50", border: "border-violet-300", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
    { bg: "from-blue-600 to-cyan-700", light: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    { bg: "from-emerald-600 to-teal-700", light: "bg-emerald-50", border: "border-emerald-300", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    { bg: "from-orange-600 to-amber-700", light: "bg-orange-50", border: "border-orange-300", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
    { bg: "from-rose-600 to-pink-700", light: "bg-rose-50", border: "border-rose-300", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
    { bg: "from-indigo-600 to-blue-700", light: "bg-indigo-50", border: "border-indigo-300", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
    { bg: "from-teal-600 to-green-700", light: "bg-teal-50", border: "border-teal-300", badge: "bg-teal-100 text-teal-700", dot: "bg-teal-500" },
    { bg: "from-fuchsia-600 to-purple-700", light: "bg-fuchsia-50", border: "border-fuchsia-300", badge: "bg-fuchsia-100 text-fuchsia-700", dot: "bg-fuchsia-500" },
];

export default function RoadmapNode({ data }) {
    const [expanded, setExpanded] = useState(false);
    const colorIndex = data.index % stageColors.length;
    const colors = stageColors[colorIndex];

    return (
        <div
            className={`roadmap-node relative rounded-2xl shadow-lg border-2 ${colors.border} bg-white overflow-hidden transition-all duration-300`}
            style={{ width: 280, minHeight: 120 }}
        >
            {/* Top gradient header */}
            <div className={`bg-gradient-to-r ${colors.bg} px-4 py-3`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                            {data.index + 1}
                        </div>
                        <h3 className="text-white font-semibold text-sm leading-tight">{data.label}</h3>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <Clock size={11} className="text-white/70" />
                    <span className="text-white/70 text-xs">{data.duration}</span>
                </div>
            </div>

            {/* Body */}
            <div className={`px-4 py-3 ${colors.light}`}>
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{data.description}</p>

                {/* Skills preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {data.skills?.slice(0, expanded ? undefined : 3).map((skill, i) => (
                        <span
                            key={i}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}
                        >
                            {skill}
                        </span>
                    ))}
                    {!expanded && data.skills?.length > 3 && (
                        <span className="text-xs text-gray-400 px-1">+{data.skills.length - 3} more</span>
                    )}
                </div>

                {/* Expanded content */}
                {expanded && (
                    <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <Code2 size={12} className="text-gray-500" />
                                <span className="text-xs font-semibold text-gray-600">All Skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {data.skills?.map((skill, i) => (
                                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {data.resources?.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <BookOpen size={12} className="text-gray-500" />
                                    <span className="text-xs font-semibold text-gray-600">Resources</span>
                                </div>
                                <ul className="space-y-1">
                                    {data.resources.map((res, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`} />
                                            <span className="text-xs text-gray-600">{res}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* React Flow handles */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !border-2 !border-white !bg-gray-400"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !border-2 !border-white !bg-gray-400"
            />
        </div>
    );
}
