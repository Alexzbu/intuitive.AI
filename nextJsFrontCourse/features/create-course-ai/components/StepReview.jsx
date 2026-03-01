import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { BackButton } from "./BackButton";
import { Edit } from "lucide-react";

function ReviewField({ label, value }) {
  return (
    <VStack align="stretch" gap={0.5} mb={3.5}>
      <Text fontSize="0.8rem" color="gray.400">
        {label}
      </Text>
      <Text fontSize="0.95rem" fontWeight="600" color="gray.900" lineHeight="1.5">
        {value || "—"}
      </Text>
    </VStack>
  );
}

export function StepReview({ formData, back, next, goTo }) {
  return (
    <>
      <Box mb={7}>
        <BackButton label="Review & Edit" onClick={back} />
      </Box>
      <VStack align="stretch" gap={5} maxW="860px">
        <Box borderWidth="1.5px" borderColor="gray.200" borderRadius="xl" p={6}>
          <HStack justify="space-between" mb={5}>
            <Text fontWeight="700" color="gray.900">
              Basic Information
            </Text>
            <Button
              variant="ghost"
              colorPalette="blue"
              size="sm"
              px={0}
              gap={1}
              onClick={() => goTo(0)}
            >
              <Edit /> Edit Details
            </Button>
          </HStack>
          <ReviewField label="Language" value={formData.language} />
          <ReviewField label="Audience" value={formData.targetAudience} />
          <ReviewField label="Goal" value={formData.goal} />
          <ReviewField
            label="Duration"
            value={formData.duration ? `${formData.duration} Hours` : ""}
          />
          <ReviewField label="Course Description" value={formData.description} />
        </Box>

        <Box borderWidth="1.5px" borderColor="gray.200" borderRadius="xl" p={6}>
          <HStack justify="space-between" mb={5}>
            <Text fontWeight="700" color="gray.900">
              Detailed Information
            </Text>
            <Button
              variant="ghost"
              colorPalette="blue"
              size="sm"
              px={0}
              gap={1}
              onClick={() => goTo(1)}
            >
              <Edit /> Edit Details
            </Button>
          </HStack>
          <ReviewField label="Experience Level" value={formData.expertiseLevel} />
          <ReviewField label="Style / Tone" value={formData.styleTone} />
          <ReviewField label="Topics to be included" value={formData.topics} />
          <ReviewField
            label="Price"
            value={formData.price ? `€${formData.price}` : ""}
          />
          <ReviewField
            label="Additional constraints or Requirements"
            value={formData.additionalConstraints}
          />
        </Box>

        <HStack justify="flex-end" gap={3} mt={5}>
          <Button variant="outline" colorPalette="gray" onClick={back}>
            Back
          </Button>
          <Button colorPalette="blue" onClick={next}>
            Generate Course Title &amp; Outline
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
