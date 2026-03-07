"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react"
import { ChevronLeft } from "lucide-react"

const BlockSuiteEditorComponent = dynamic(
  () =>
    import("@/features/blocksuite-editor").then(
      (m) => m.BlockSuiteEditorComponent
    ),
  { ssr: false, loading: () => <Spinner size="xl" color="blue.500" /> }
)

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    router.replace("/")
    return null
  }

  return (
    <Flex direction="column" h="100vh">
      {/* Header */}
      <Flex
        px="4"
        py="3"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        gap="3"
        bg="white"
        flexShrink={0}
      >
        <Button
          variant="ghost"
          size="sm"
          px="0"
          color="gray.600"
          _hover={{ color: "gray.900" }}
          onClick={() => router.back()}
        >
          <ChevronLeft size={18} />
        </Button>
        <Heading size="sm" color="gray.700">Course Notes</Heading>
      </Flex>

      {/* Editor */}
      <Box flex="1" overflow="hidden">
        <BlockSuiteEditorComponent courseId={courseId} />
      </Box>
    </Flex>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<Flex justify="center" pt="20"><Spinner size="xl" color="blue.500" /></Flex>}>
      <EditorContent />
    </Suspense>
  )
}
