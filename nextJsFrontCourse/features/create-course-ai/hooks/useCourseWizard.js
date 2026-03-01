"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import client from "@/utils/apolloClient";
import { GENERATE_COURSE_TITLES, defaultFormData } from "../api/courseMutations";

export function useCourseWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);

  const [titles, setTitles] = useState([]);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const [generateTitlesMutation] = useMutation(GENERATE_COURSE_TITLES, { client });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("course_ai_draft");
      if (saved) setFormData(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("course_ai_draft", JSON.stringify(formData));
    } catch {}
  }, [formData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentStep === 3 && titles.length === 0 && !titlesLoading) {
      handleGenerateTitles();
    }
  }, [currentStep]);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const goTo = (step) => setCurrentStep(step);
  const next = () => setCurrentStep((s) => s + 1);
  const back = () => setCurrentStep((s) => s - 1);

  const getCircleState = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const handleGenerateTitles = async () => {
    setTitlesLoading(true);
    setTitles([]);
    setSelectedTitle("");
    try {
      const { data } = await generateTitlesMutation({ variables: { ...formData } });
      setTitles(data.generateCourseTitles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setTitlesLoading(false);
    }
  };

  const handleGenerateOutline = () => {
    const chosen = showCustomInput ? customTitle : selectedTitle;
    update("courseTitle", chosen);
    next();
  };

  const handleFinish = () => {
    localStorage.removeItem("course_ai_draft");
    router.push("/dashboard");
  };

  return {
    currentStep,
    goTo,
    next,
    back,
    getCircleState,
    formData,
    update,
    titles,
    titlesLoading,
    selectedTitle,
    setSelectedTitle,
    showCustomInput,
    setShowCustomInput,
    customTitle,
    setCustomTitle,
    handleGenerateTitles,
    handleGenerateOutline,
    handleFinish,
    router,
  };
}
