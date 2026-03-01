import { VStack, HStack, Text, Button, Input, Spinner, Box } from "@chakra-ui/react";
import { Separator } from "@chakra-ui/react";
import { BackButton } from "./BackButton";

export function StepTitleSelection({
  titles,
  titlesLoading,
  selectedTitle,
  setSelectedTitle,
  showCustomInput,
  setShowCustomInput,
  customTitle,
  setCustomTitle,
  back,
  handleGenerateOutline,
}) {
  const canProceed = selectedTitle || (showCustomInput && customTitle.trim());

  return (
    <>
      <Box mb={7}>
        <BackButton label="Course Outline" onClick={back} />
      </Box>
      <VStack align="stretch" gap={5} maxW="860px">
        <Box>
          <Text fontSize="1.3rem" fontWeight="700" color="gray.900">
            Select Course Title
          </Text>
          <Text fontSize="0.9rem" color="gray.500" mt={1.5}>
            Choose from AI generated titles or create your own
          </Text>
        </Box>

        <Separator />

        {titlesLoading ? (
          <VStack gap={4} py={16}>
            <Spinner size="xl" color="blue.500" borderWidth="4px" />
            <Text fontWeight="600" textAlign="center">
              AI Assistant is generating course Titles......
            </Text>
            <Text fontSize="0.85rem" color="gray.400" textAlign="center">
              This will take just a moment.
            </Text>
          </VStack>
        ) : (
          <>
            {titles.map((title, i) => {
              const isSelected = selectedTitle === title && !showCustomInput;
              return (
                <HStack
                  key={i}
                  borderWidth="1.5px"
                  borderColor={isSelected ? "blue.500" : "gray.200"}
                  borderRadius="lg"
                  px={4}
                  py={3.5}
                  cursor="pointer"
                  _hover={{ borderColor: "blue.400" }}
                  onClick={() => {
                    setSelectedTitle(title);
                    setShowCustomInput(false);
                  }}
                  transition="border-color 0.2s"
                >
                  <input
                    type="radio"
                    name="courseTitle"
                    checked={isSelected}
                    onChange={() => {
                      setSelectedTitle(title);
                      setShowCustomInput(false);
                    }}
                    style={{
                      accentColor: "#2b7ab7",
                      width: 18,
                      height: 18,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <Text fontSize="0.95rem" color="gray.700">
                    {title}
                  </Text>
                </HStack>
              );
            })}

            <Button
              variant="ghost"
              colorPalette="blue"
              size="sm"
              px={0}
              mt={2}
              alignSelf="flex-start"
              onClick={() => {
                setShowCustomInput((s) => !s);
                setSelectedTitle("");
              }}
            >
              + Write your own Title
            </Button>

            {showCustomInput && (
              <Input
                placeholder="Enter your course title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                mt={2.5}
              />
            )}

            <HStack justify="flex-end" gap={3} mt={5}>
              <Button variant="outline" colorPalette="gray" onClick={back}>
                Back
              </Button>
              <Button
                colorPalette="blue"
                disabled={!canProceed}
                onClick={handleGenerateOutline}
              >
                Generate Outline
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </>
  );
}
