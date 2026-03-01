import { gql } from "@apollo/client";

export const GENERATE_COURSE_TITLES = gql`
  mutation generateCourseTitles(
    $language: String, $targetAudience: String, $goal: String,
    $duration: String, $description: String, $expertiseLevel: String,
    $styleTone: String, $topics: String, $additionalConstraints: String
  ) {
    generateCourseTitles(
      language: $language, targetAudience: $targetAudience, goal: $goal,
      duration: $duration, description: $description, expertiseLevel: $expertiseLevel,
      styleTone: $styleTone, topics: $topics, additionalConstraints: $additionalConstraints
    )
  }
`;

export const STEPS = [
  { num: 1, label: "Basic Info" },
  { num: 2, label: "Detailed Info" },
  { num: 4, label: "Review & Edit" },
  { num: 5, label: "Course Outline" },
  { num: 6, label: "Appointment" },
];

export const LANGUAGES = ["English", "German"];
export const EXPERTISE_LEVELS = ["Beginner", "Intermediate", "Advance"];
export const STYLE_TONES = ["Modern", "Professional", "Playful", "Conversational"];

export const defaultFormData = {
  language: "",
  targetAudience: "",
  goal: "",
  duration: "",
  description: "",
  expertiseLevel: "",
  styleTone: "",
  topics: "",
  price: "",
  additionalConstraints: "",
  courseTitle: "",
};
