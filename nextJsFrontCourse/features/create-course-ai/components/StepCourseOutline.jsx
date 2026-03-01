import { useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Spinner,
  Box,
  Separator,
} from "@chakra-ui/react";
import { Plus, Trash2, ChevronUp, ChevronDown, Edit, X } from "lucide-react";
import { BackButton } from "./BackButton";

export function StepCourseOutline({
  formData,
  outline,
  outlineLoading,
  outlineError,
  generateAIOutline,
  updateModuleTitle,
  updateChapterTitle,
  addModule,
  deleteModule,
  addChapter,
  deleteChapter,
  moveModuleUp,
  moveModuleDown,
  moveChapterUp,
  moveChapterDown,
  handleGenerateCourse,
  back,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const startEdit = (id, currentValue) => {
    setEditingId(id);
    setEditingValue(currentValue);
  };

  const commitModuleEdit = (moduleId) => {
    if (editingValue.trim()) updateModuleTitle(moduleId, editingValue.trim());
    setEditingId(null);
  };

  const commitChapterEdit = (moduleId, chapterId) => {
    if (editingValue.trim()) updateChapterTitle(moduleId, chapterId, editingValue.trim());
    setEditingId(null);
  };

  const handleKeyDown = (e, commitFn) => {
    if (e.key === "Enter") commitFn();
    if (e.key === "Escape") setEditingId(null);
  };

  if (outlineLoading) {
    return (
      <>
        <Box mb={7}>
          <BackButton label="Course Outline" onClick={back} />
        </Box>
        <VStack gap={4} py={16} maxW="860px">
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontWeight="600" textAlign="center">
            AI Assistant is generating your course outline...
          </Text>
          <Text fontSize="0.85rem" color="gray.400" textAlign="center">
            This will take just a moment.
          </Text>
        </VStack>
      </>
    );
  }

  if (outlineError || outline.length === 0) {
    return (
      <>
        <Box mb={7}>
          <BackButton label="Course Outline" onClick={back} />
        </Box>
        <VStack gap={5} py={10} maxW="860px" align="stretch">
          <Box
            borderWidth="1.5px"
            borderStyle="dashed"
            borderColor="gray.300"
            borderRadius="xl"
            py={12}
            textAlign="center"
            color="gray.400"
          >
            <Text fontSize="0.95rem" mb={4}>
              {outlineError
                ? "Failed to generate outline. Please try again."
                : "No outline generated yet."}
            </Text>
            <Button colorPalette="blue" onClick={generateAIOutline}>
              Generate Outline
            </Button>
          </Box>
        </VStack>
      </>
    );
  }

  return (
    <>
      <Box mb={7}>
        <BackButton label="Course Outline" onClick={back} />
      </Box>

      <VStack align="stretch" gap={5} maxW="860px">
        <HStack justify="space-between" align="flex-end">
          <Box>
            <Text fontSize="1.3rem" fontWeight="700" color="gray.900">
              Course Qverview
            </Text>
            <Text fontSize="0.9rem" fontWeight="700" color="gray.500" mt={1}>
              {formData.courseTitle}
            </Text>
          </Box>
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            gap={1.5}
            onClick={generateAIOutline}
          >
            <Edit size={14} />
            Regenerate Outline
          </Button>
        </HStack>

        <Separator />

        {outline.map((mod, modIdx) => (
          <Box
            key={mod.id}
            borderWidth="1.5px"
            borderColor="gray.200"
            borderRadius="xl"
            p={5}
          >
            <HStack justify="space-between" mb={4} gap={2}>
              {editingId === mod.id ? (
                <Input
                  value={editingValue}
                  autoFocus
                  fontWeight="700"
                  fontSize="0.95rem"
                  flex={1}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => commitModuleEdit(mod.id)}
                  onKeyDown={(e) => handleKeyDown(e, () => commitModuleEdit(mod.id))}
                />
              ) : (
                <Text fontWeight="700" fontSize="0.95rem" color="gray.900" flex={1}>
                  Module {modIdx + 1}: {mod.title}
                </Text>
              )}

              <HStack gap={0.5} flexShrink={0}>
                <Button
                  variant="ghost"
                  colorPalette="gray"
                  size="xs"
                  p={1}
                  onClick={() =>
                    editingId === mod.id
                      ? setEditingId(null)
                      : startEdit(mod.id, mod.title)
                  }
                  aria-label="Edit module title"
                >
                  {editingId === mod.id ? <X size={14} /> : <Edit size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  colorPalette="gray"
                  size="xs"
                  p={1}
                  disabled={modIdx === 0}
                  onClick={() => moveModuleUp(mod.id)}
                  aria-label="Move module up"
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  colorPalette="gray"
                  size="xs"
                  p={1}
                  disabled={modIdx === outline.length - 1}
                  onClick={() => moveModuleDown(mod.id)}
                  aria-label="Move module down"
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  variant="ghost"
                  colorPalette="red"
                  size="xs"
                  p={1}
                  onClick={() => deleteModule(mod.id)}
                  aria-label="Delete module"
                >
                  <Trash2 size={14} />
                </Button>
              </HStack>
            </HStack>

            <VStack align="stretch" gap={1.5} pl={4}>
              {mod.chapters.map((ch, chIdx) => {
                const chKey = `${mod.id}__${ch.id}`;
                return (
                  <HStack
                    key={ch.id}
                    borderWidth="1px"
                    borderColor="gray.100"
                    borderRadius="lg"
                    px={3}
                    py={2}
                    gap={2}
                    _hover={{ borderColor: "gray.300" }}
                    transition="border-color 0.15s"
                  >
                    {editingId === chKey ? (
                      <Input
                        value={editingValue}
                        autoFocus
                        size="sm"
                        flex={1}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => commitChapterEdit(mod.id, ch.id)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => commitChapterEdit(mod.id, ch.id))
                        }
                      />
                    ) : (
                      <Text fontSize="0.9rem" color="gray.700" flex={1}>
                        {chIdx + 1}. {ch.title}
                      </Text>
                    )}

                    <HStack gap={0.5} flexShrink={0}>
                      <Button
                        variant="ghost"
                        colorPalette="gray"
                        size="xs"
                        p={1}
                        onClick={() =>
                          editingId === chKey
                            ? setEditingId(null)
                            : startEdit(chKey, ch.title)
                        }
                        aria-label="Edit chapter"
                      >
                        {editingId === chKey ? <X size={12} /> : <Edit size={12} />}
                      </Button>
                      <Button
                        variant="ghost"
                        colorPalette="gray"
                        size="xs"
                        p={1}
                        disabled={chIdx === 0}
                        onClick={() => moveChapterUp(mod.id, ch.id)}
                        aria-label="Move chapter up"
                      >
                        <ChevronUp size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        colorPalette="gray"
                        size="xs"
                        p={1}
                        disabled={chIdx === mod.chapters.length - 1}
                        onClick={() => moveChapterDown(mod.id, ch.id)}
                        aria-label="Move chapter down"
                      >
                        <ChevronDown size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        colorPalette="red"
                        size="xs"
                        p={1}
                        onClick={() => deleteChapter(mod.id, ch.id)}
                        aria-label="Delete chapter"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </HStack>
                  </HStack>
                );
              })}

              <Button
                variant="ghost"
                colorPalette="blue"
                size="sm"
                px={0}
                alignSelf="flex-start"
                gap={1}
                onClick={() => addChapter(mod.id)}
              >
                <Plus size={14} />
                Add Sub-topic
              </Button>
            </VStack>
          </Box>
        ))}

        <Button
          variant="outline"
          colorPalette="blue"
          size="sm"
          alignSelf="flex-start"
          gap={1.5}
          onClick={addModule}
        >
          <Plus size={14} />
          Add Module
        </Button>

        <HStack justify="flex-end" gap={3} mt={5}>
          <Button variant="outline" colorPalette="gray" onClick={back}>
            Back
          </Button>
          <Button colorPalette="blue" onClick={handleGenerateCourse}>
            Generate Course
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
