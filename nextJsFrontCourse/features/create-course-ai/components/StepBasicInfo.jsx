import { VStack, HStack, Input, Textarea, Button, Box } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { NativeSelect } from "@chakra-ui/react";
import { BackButton } from "./BackButton";
import { LANGUAGES } from "../api/courseMutations";

export function StepBasicInfo({ formData, update, next, router }) {
  return (
    <>
      <Box mb={7}>
        <BackButton label="Basic Information" onClick={() => router.back()} />
      </Box>
      <VStack align="stretch" gap={5} maxW="860px">
        <Field.Root>
          <Field.Label>Language</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={formData.language}
              onChange={(e) => update("language", e.target.value)}
            >
              <option value="">Choose language</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>Target Audience</Field.Label>
          <Input
            value={formData.targetAudience}
            onChange={(e) => update("targetAudience", e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Goal of the Training / Course</Field.Label>
          <Input
            value={formData.goal}
            onChange={(e) => update("goal", e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Course Duration</Field.Label>
          <Input
            type="number"
            placeholder="No. of hours"
            value={formData.duration}
            onChange={(e) => update("duration", e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Course Description</Field.Label>
          <Textarea
            minH="100px"
            resize="vertical"
            placeholder="Course description"
            value={formData.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field.Root>

        <HStack justify="flex-end" gap={3} mt={5}>
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button colorPalette="blue" onClick={next}>
            Next
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
