import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { BackButton } from "./BackButton";

export function StepAppointment({ back, handleFinish }) {
  return (
    <>
      <Box mb={7}>
        <BackButton label="Appointment" onClick={back} />
      </Box>
      <VStack align="stretch" gap={5} maxW="860px">
        <Box
          borderWidth="1.5px"
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="xl"
          py={16}
          px={7}
          textAlign="center"
          color="gray.400"
          fontSize="0.95rem"
        >
          <Text>Schedule your course appointment here.</Text>
        </Box>
        <HStack justify="flex-end" gap={3} mt={5}>
          <Button variant="outline" colorPalette="gray" onClick={back}>
            Back
          </Button>
          <Button colorPalette="blue" onClick={handleFinish}>
            Finish
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
