import { Box, Flex, Text } from "@chakra-ui/react";
import { STEPS } from "../api/courseMutations";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8l3.5 3.5L13 4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function WizardSidebar({ currentStep, getCircleState }) {
  return (
    <Box
      as="aside"
      w="130px"
      flexShrink={0}
      py={10}
      px={5}
      display="flex"
      flexDirection="column"
      alignItems="center"
      borderRight="1px solid"
      borderColor="gray.100"
    >
      {STEPS.map((step, index) => {
        const state = getCircleState(index);
        return (
          <Flex key={step.num} direction="column" align="center">
            {index > 0 && (
              <Box
                w="2px"
                h="36px"
                bg={index <= currentStep ? "green.500" : "gray.200"}
                transition="background 0.2s"
              />
            )}
            <Flex
              w="40px"
              h="40px"
              borderRadius="full"
              align="center"
              justify="center"
              fontSize="sm"
              fontWeight="600"
              bg={
                state === "active"
                  ? "blue.500"
                  : state === "completed"
                  ? "green.500"
                  : "gray.200"
              }
              color={state === "pending" ? "gray.500" : "white"}
              transition="background 0.2s, color 0.2s"
            >
              {state === "completed" ? <CheckIcon /> : step.num}
            </Flex>
            <Text
              fontSize="0.72rem"
              color={index === currentStep ? "gray.900" : "gray.400"}
              fontWeight={index === currentStep ? "600" : "normal"}
              mt={1.5}
              textAlign="center"
              lineHeight="1.3"
            >
              {step.label}
            </Text>
          </Flex>
        );
      })}
    </Box>
  );
}
