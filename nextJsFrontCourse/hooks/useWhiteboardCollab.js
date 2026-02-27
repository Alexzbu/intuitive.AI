"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

export function useWhiteboardCollab(roomId) {
    const socketRef = useRef(null);
    const updateTimerRef = useRef(null);
    // Maps elementId → highest version received from server
    // Used by Excalidrow to skip re-emitting server-sourced updates
    const remoteVersionsRef = useRef(new Map());

    const [role, setRole] = useState("viewer");
    const [canDraw, setCanDraw] = useState(false);
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState(new Set());
    const [remoteElements, setRemoteElements] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : {};

        const socket = io("http://localhost:3000", {
            auth: {
                userId: user.objectId,
                position: user.position,
                firstName: user.firstName,
            },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join-room", roomId);
        });

        socket.on("room-state", ({ elements, role: assignedRole, permissions: perms }) => {
            setRole(assignedRole);
            const permSet = new Set(perms);
            setPermissions(permSet);
            const isHost = assignedRole === "host";
            const isPermitted = permSet.has(user.objectId);
            setCanDraw(isHost || isPermitted);
            if (elements && elements.length > 0) {
                elements.forEach(el => remoteVersionsRef.current.set(el.id, el.version));
                setRemoteElements(elements);
            }
        });

        socket.on("whiteboard-update", (elements) => {
            elements.forEach(el => remoteVersionsRef.current.set(el.id, el.version));
            setRemoteElements(elements);
        });

        socket.on("users-updated", (updatedUsers) => {
            setUsers(updatedUsers);
        });

        socket.on("permission-updated", ({ userId, canDraw: draw }) => {
            const stored = localStorage.getItem("user");
            const currentUser = stored ? JSON.parse(stored) : {};
            if (userId === currentUser.objectId) {
                setCanDraw(draw);
            }
            setPermissions((prev) => {
                const next = new Set(prev);
                if (draw) next.add(userId);
                else next.delete(userId);
                return next;
            });
        });

        return () => {
            if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
            socket.disconnect();
        };
    }, [roomId]);

    const sendUpdate = useCallback(
        (elements) => {
            if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
            updateTimerRef.current = setTimeout(() => {
                socketRef.current?.emit("whiteboard-update", { roomId, elements });
            }, 50);
        },
        [roomId]
    );

    const grantPermission = useCallback(
        (targetUserId) => {
            socketRef.current?.emit("grant-permission", { roomId, targetUserId });
        },
        [roomId]
    );

    const revokePermission = useCallback(
        (targetUserId) => {
            socketRef.current?.emit("revoke-permission", { roomId, targetUserId });
        },
        [roomId]
    );

    return { role, canDraw, users, permissions, remoteElements, remoteVersionsRef, sendUpdate, grantPermission, revokePermission };
}
