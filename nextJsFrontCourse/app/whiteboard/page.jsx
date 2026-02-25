"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ExcalidrawWrapper from "@/components/Excalidrow";

function WhiteboardContent() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id") ?? "global-room";

    return <ExcalidrawWrapper courseId={courseId} />;
}

export default function WhiteboardPage() {
    return (
        <Suspense fallback={<div>Loading whiteboard...</div>}>
            <WhiteboardContent />
        </Suspense>
    );
}
