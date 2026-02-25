"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useRef, useEffect, useState } from "react";
import { useWhiteboardCollab } from "@/hooks/useWhiteboardCollab";

function ParticipantsPanel({ users, permissions, onGrant, onRevoke }) {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const currentUserId = stored ? JSON.parse(stored).objectId : null;

    return (
        <div style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: 10,
            padding: "12px 14px",
            minWidth: 210,
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            fontFamily: "sans-serif",
            fontSize: 14,
        }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: "#333" }}>Participants</div>
            {users.length === 0 && (
                <div style={{ color: "#999", fontSize: 12 }}>No viewers yet</div>
            )}
            {users.map((user) => {
                const isYou = user.userId === currentUserId;
                const isPermitted = permissions.has(user.userId);

                return (
                    <div key={user.userId} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px 0",
                        borderBottom: "1px solid #f0f0f0",
                    }}>
                        <span style={{ color: "#444" }}>
                            {user.firstName}
                            {user.role === "host" && (
                                <span style={{ marginLeft: 6, fontSize: 11, color: "#6366f1", fontWeight: 600 }}>host</span>
                            )}
                            {isYou && (
                                <span style={{ marginLeft: 4, fontSize: 11, color: "#999" }}>(you)</span>
                            )}
                        </span>
                        {user.role !== "host" && !isYou && (
                            isPermitted ? (
                                <button
                                    onClick={() => onRevoke(user.userId)}
                                    style={{
                                        fontSize: 11,
                                        padding: "2px 8px",
                                        borderRadius: 5,
                                        border: "1px solid #f87171",
                                        background: "#fff1f1",
                                        color: "#dc2626",
                                        cursor: "pointer",
                                    }}
                                >
                                    Revoke
                                </button>
                            ) : (
                                <button
                                    onClick={() => onGrant(user.userId)}
                                    style={{
                                        fontSize: 11,
                                        padding: "2px 8px",
                                        borderRadius: 5,
                                        border: "1px solid #6366f1",
                                        background: "#eff6ff",
                                        color: "#4f46e5",
                                        cursor: "pointer",
                                    }}
                                >
                                    Allow Draw
                                </button>
                            )
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const ExcalidrawWrapper = ({ courseId = "global-room" }) => {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const isRemoteUpdate = useRef(false);

    const {
        role,
        canDraw,
        users,
        permissions,
        remoteElements,
        sendUpdate,
        grantPermission,
        revokePermission,
    } = useWhiteboardCollab(courseId);

    // Apply incoming remote canvas state without echoing it back
    useEffect(() => {
        if (remoteElements && excalidrawAPI) {
            isRemoteUpdate.current = true;
            excalidrawAPI.updateScene({ elements: remoteElements });
        }
    }, [remoteElements, excalidrawAPI]);

    const handleChange = (elements) => {
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }
        if (canDraw) {
            sendUpdate(elements);
        }
    };

    return (
        <div style={{ height: "600px", width: "100%", position: "relative" }}>
            {role === "host" && (
                <ParticipantsPanel
                    users={users}
                    permissions={permissions}
                    onGrant={grantPermission}
                    onRevoke={revokePermission}
                />
            )}
            {!canDraw && role !== "host" && (
                <div style={{
                    position: "absolute",
                    top: 12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "rgba(0,0,0,0.55)",
                    color: "white",
                    borderRadius: 8,
                    padding: "5px 14px",
                    fontSize: 13,
                    pointerEvents: "none",
                }}>
                    View only — waiting for host to grant draw access
                </div>
            )}
            <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={handleChange}
                viewModeEnabled={!canDraw}
            />
        </div>
    );
};

export default ExcalidrawWrapper;
