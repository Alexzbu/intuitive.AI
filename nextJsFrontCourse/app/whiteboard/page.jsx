"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner, AbsoluteCenter } from "@chakra-ui/react"
import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(() => import("@/features/whiteboard/components/Excalidrow"), {
    ssr: false,
    loading: () => {
        return (
            <AbsoluteCenter h="full">
                <Spinner color="blue.500" size="xl" />
            </AbsoluteCenter>
        )
    },
});

function WhiteboardContent() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id") ?? "global-room";

    return <ExcalidrawWrapper courseId={courseId} />;
}

export default function WhiteboardPage() {
    return (
        <Suspense fallback={<Spinner color="blue.500" size="xl" />}>
            <WhiteboardContent />
        </Suspense>
    );
}
