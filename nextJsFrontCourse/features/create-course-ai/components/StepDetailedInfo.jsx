import { VStack, HStack, Input, Textarea, Button, Box } from "@chakra-ui/react";
import { Field, NativeSelect } from "@chakra-ui/react";
import { BackButton } from "./BackButton";
import { EXPERTISE_LEVELS, STYLE_TONES } from "../api/courseMutations";

export function StepDetailedInfo({ formData, update, next, back }) {
  return (
    <>
      <Box mb={7}>
        <BackButton label="Detailed Information" onClick={back} />
      </Box>
      <VStack align="stretch" gap={5} maxW="860px">
        <Field.Root>
          <Field.Label>Audience level of expertise</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={formData.expertiseLevel}
              onChange={(e) => update("expertiseLevel", e.target.value)}
            >
              <option value="">Beginner, Intermediate, Advance</option>
              {EXPERTISE_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>Preferred Style / Tone</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={formData.styleTone}
              onChange={(e) => update("styleTone", e.target.value)}
            >
              <option value="">Modern, Professional, Playful, Conversational</option>
              {STYLE_TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>What topics or content should be included?</Field.Label>
          <Textarea
            minH="100px"
            resize="vertical"
            placeholder="Topics to include"
            value={formData.topics}
            onChange={(e) => update("topics", e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Price for the Course</Field.Label>
          <Input
            type="number"
            placeholder="Add price in euros"
            value={formData.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Additional Constraints or Requirements</Field.Label>
          <Textarea
            minH="100px"
            resize="vertical"
            placeholder="Any additional constraints"
            value={formData.additionalConstraints}
            onChange={(e) => update("additionalConstraints", e.target.value)}
          />
        </Field.Root>

        <HStack justify="flex-end" gap={3} mt={5}>
          <Button variant="outline" colorPalette="gray" onClick={back}>
            Back
          </Button>
          <Button colorPalette="blue" onClick={next}>
            Next
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
