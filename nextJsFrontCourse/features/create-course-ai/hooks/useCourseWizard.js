"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import client from "@/utils/apolloClient";
import {
  GENERATE_COURSE_TITLES,
  GENERATE_COURSE_OUTLINE,
  defaultFormData,
} from "../api/courseMutations";

// Maps wizard step → sidebar index (steps 3 and 4 both map to sidebar 3 "Course Outline")
const STEP_TO_SIDEBAR = [0, 1, 2, 3, 3, 4];

const genId = () => crypto.randomUUID();

export function useCourseWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);

  const [titles, setTitles] = useState([]);
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const [outline, setOutline] = useState([]);
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [outlineError, setOutlineError] = useState(false);

  const [generateTitlesMutation] = useMutation(GENERATE_COURSE_TITLES, { client });
  const [generateOutlineMutation] = useMutation(GENERATE_COURSE_OUTLINE, { client });

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentStep === 4 && outline.length === 0 && !outlineLoading) {
      generateAIOutline();
    }
  }, [currentStep]);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const goTo = (step) => setCurrentStep(step);
  const next = () => setCurrentStep((s) => s + 1);
  const back = () => setCurrentStep((s) => s - 1);

  const getCircleState = (sidebarIndex) => {
    const effective = STEP_TO_SIDEBAR[currentStep] ?? currentStep;
    if (sidebarIndex < effective) return "completed";
    if (sidebarIndex === effective) return "active";
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

  const generateAIOutline = async () => {
    setOutlineLoading(true);
    setOutlineError(false);
    setOutline([]);
    try {
      const { data } = await generateOutlineMutation({
        variables: { ...formData },
      });
      const raw = data.generateCourseOutline || [];
      const hydrated = raw.map((mod) => ({
        id: genId(),
        title: mod.title || "Untitled Module",
        chapters: (mod.chapters || []).map((ch) => ({
          id: genId(),
          title: typeof ch === "string" ? ch : ch.title || "Untitled Chapter",
        })),
      }));
      setOutline(hydrated);
    } catch (e) {
      console.error(e);
      setOutlineError(true);
    } finally {
      setOutlineLoading(false);
    }
  };

  // ── Outline CRUD handlers ──────────────────────────────────────────────────

  const updateModuleTitle = (moduleId, newTitle) => {
    setOutline((prev) =>
      prev.map((mod) => (mod.id === moduleId ? { ...mod, title: newTitle } : mod))
    );
  };

  const updateChapterTitle = (moduleId, chapterId, newTitle) => {
    setOutline((prev) =>
      prev.map((mod) =>
        mod.id !== moduleId
          ? mod
          : {
              ...mod,
              chapters: mod.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, title: newTitle } : ch
              ),
            }
      )
    );
  };

  const addModule = () => {
    setOutline((prev) => [
      ...prev,
      { id: genId(), title: "New Module", chapters: [] },
    ]);
  };

  const deleteModule = (moduleId) => {
    setOutline((prev) => prev.filter((mod) => mod.id !== moduleId));
  };

  const addChapter = (moduleId) => {
    setOutline((prev) =>
      prev.map((mod) =>
        mod.id !== moduleId
          ? mod
          : {
              ...mod,
              chapters: [...mod.chapters, { id: genId(), title: "New Chapter" }],
            }
      )
    );
  };

  const deleteChapter = (moduleId, chapterId) => {
    setOutline((prev) =>
      prev.map((mod) =>
        mod.id !== moduleId
          ? mod
          : { ...mod, chapters: mod.chapters.filter((ch) => ch.id !== chapterId) }
      )
    );
  };

  const moveModuleUp = (moduleId) => {
    setOutline((prev) => {
      const idx = prev.findIndex((m) => m.id === moduleId);
      if (idx <= 0) return prev;
      const reordered = [...prev];
      [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
      return reordered;
    });
  };

  const moveModuleDown = (moduleId) => {
    setOutline((prev) => {
      const idx = prev.findIndex((m) => m.id === moduleId);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const reordered = [...prev];
      [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
      return reordered;
    });
  };

  const moveChapterUp = (moduleId, chapterId) => {
    setOutline((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const idx = mod.chapters.findIndex((c) => c.id === chapterId);
        if (idx <= 0) return mod;
        const chs = [...mod.chapters];
        [chs[idx - 1], chs[idx]] = [chs[idx], chs[idx - 1]];
        return { ...mod, chapters: chs };
      })
    );
  };

  const moveChapterDown = (moduleId, chapterId) => {
    setOutline((prev) =>
      prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const idx = mod.chapters.findIndex((c) => c.id === chapterId);
        if (idx === -1 || idx >= mod.chapters.length - 1) return mod;
        const chs = [...mod.chapters];
        [chs[idx], chs[idx + 1]] = [chs[idx + 1], chs[idx]];
        return { ...mod, chapters: chs };
      })
    );
  };

  const handleGenerateCourse = () => next();

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
    handleFinish,
    router,
  };
}
