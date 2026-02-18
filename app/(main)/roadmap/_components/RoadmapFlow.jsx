"use client";

import { useCallback, useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RoadmapNode from "./RoadmapNode";

const nodeTypes = {
    roadmapNode: RoadmapNode,
};

// Layout: arrange nodes in a vertical tree
function layoutNodes(stages) {
    if (!stages || stages.length === 0) return { nodes: [], edges: [] };

    // Group stages by level
    const levelMap = {};
    stages.forEach((stage) => {
        const lvl = stage.level ?? 0;
        if (!levelMap[lvl]) levelMap[lvl] = [];
        levelMap[lvl].push(stage);
    });

    const NODE_WIDTH = 280;
    const NODE_GAP_X = 60;
    const NODE_HEIGHT = 160;
    const NODE_GAP_Y = 80;

    const nodes = [];
    const edges = [];

    const levels = Object.keys(levelMap).map(Number).sort((a, b) => a - b);

    levels.forEach((lvl) => {
        const stagesAtLevel = levelMap[lvl];
        const totalWidth = stagesAtLevel.length * NODE_WIDTH + (stagesAtLevel.length - 1) * NODE_GAP_X;
        const startX = -totalWidth / 2;

        stagesAtLevel.forEach((stage, idx) => {
            const x = startX + idx * (NODE_WIDTH + NODE_GAP_X);
            const y = lvl * (NODE_HEIGHT + NODE_GAP_Y);

            nodes.push({
                id: stage.id,
                type: "roadmapNode",
                position: { x, y },
                data: {
                    label: stage.label,
                    description: stage.description,
                    duration: stage.duration,
                    skills: stage.skills || [],
                    resources: stage.resources || [],
                    index: stages.indexOf(stage),
                },
            });

            // Create edges from children
            if (stage.children && stage.children.length > 0) {
                stage.children.forEach((childId) => {
                    edges.push({
                        id: `edge-${stage.id}-${childId}`,
                        source: stage.id,
                        target: childId,
                        type: "smoothstep",
                        animated: true,
                        style: { stroke: "#8b5cf6", strokeWidth: 2 },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: "#8b5cf6",
                        },
                    });
                });
            }
        });
    });

    return { nodes, edges };
}

export default function RoadmapFlow({ roadmapData }) {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => layoutNodes(roadmapData?.stages || []),
        [roadmapData]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.3}
                maxZoom={1.5}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    animated: true,
                }}
            >
                <Background color="#e2e8f0" gap={20} size={1} />
                <Controls className="!bottom-4 !left-4" />
                <MiniMap
                    className="!bottom-4 !right-4 !rounded-xl !border !border-gray-200"
                    nodeColor={(node) => {
                        const colors = [
                            "#7c3aed", "#2563eb", "#059669", "#d97706",
                            "#e11d48", "#4f46e5", "#0d9488", "#c026d3",
                        ];
                        return colors[node.data.index % colors.length];
                    }}
                    maskColor="rgba(255,255,255,0.7)"
                />
            </ReactFlow>
        </div>
    );
}
