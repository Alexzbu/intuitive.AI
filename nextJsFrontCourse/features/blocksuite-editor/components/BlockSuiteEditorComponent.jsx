"use client"

import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react"
import { Save } from "lucide-react"
import { useBlockSuiteEditor } from "../hooks/useBlockSuiteEditor"

export function BlockSuiteEditorComponent({ courseId }) {
  const { containerRef, save, saving, initialized, error } = useBlockSuiteEditor(courseId)

  if (error) {
    return (
      <Flex align="center" justify="center" h="full">
        <Text color="red.500" fontSize="sm">Failed to load editor: {error}</Text>
      </Flex>
    )
  }

  return (
    <Flex direction="column" h="full">
      {/* Toolbar */}
      <Flex
        px="4"
        py="2"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        gap="3"
        bg="white"
        flexShrink={0}
      >
        {!initialized && <Spinner size="sm" color="blue.500" />}
        {initialized && (
          <Text fontSize="xs" color="gray.500">Auto-saves every 3s</Text>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={save}
          loading={saving}
          loadingText="Saving..."
          ml="auto"
          disabled={!initialized}
        >
          <Save size={14} />
          Save
        </Button>
      </Flex>

      {/* Editor container */}
      <Box
        ref={containerRef}
        flex="1"
        overflow="auto"
        bg="white"
        position="relative"
      />
    </Flex>
  )
}
