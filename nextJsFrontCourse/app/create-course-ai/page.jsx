"use client";

import { Flex } from "@chakra-ui/react";
import {
  useCourseWizard,
  WizardSidebar,
  StepBasicInfo,
  StepDetailedInfo,
  StepReview,
  StepTitleSelection,
  StepCourseOutline,
  StepAppointment,
} from "@/features/create-course-ai";

const STEP_MAP = {
  0: StepBasicInfo,
  1: StepDetailedInfo,
  2: StepReview,
  3: StepTitleSelection,
  4: StepCourseOutline,
  5: StepAppointment,
};

export default function CreateCourseAI() {
  const wizard = useCourseWizard();
  const ActiveStep = STEP_MAP[wizard.currentStep];

  return (
    <Flex minH="100vh" bg="white">
      <WizardSidebar
        currentStep={wizard.currentStep}
        getCircleState={wizard.getCircleState}
      />
      <Flex
        flex={1}
        direction="column"
        px={{ base: 6, md: 12 }}
        py={8}
        overflowY="auto"
      >
        <ActiveStep {...wizard} />
      </Flex>
    </Flex>
  );
}
