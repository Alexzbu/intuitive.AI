"use client"

import { useRouter } from "next/navigation"

export default function CreateCourse() {
  const router = useRouter()

  return (
    <div className="create-course">
      <div className="create-course__header">
        <button className="create-course__back" onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      <h1 className="create-course__title">Create New Course</h1>

      <div className="create-course__selection">
        <h2 className="create-course__heading">How would you like to create your course?</h2>
        <p className="create-course__subtitle">Choose the method that best fits your needs.</p>

        <div className="create-course__options">
          <div className="create-course__option create-course__option--ai" onClick={() => router.push('/add-course')}>
            <div className="create-course__icon create-course__icon--ai">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="white" strokeWidth="1.8"/>
                <circle cx="9" cy="11" r="1.5" fill="white"/>
                <circle cx="15" cy="11" r="1.5" fill="white"/>
                <path d="M9 14.5c.8.8 2.2.8 3 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 6V4M16 6V4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M2 10h2M20 10h2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="create-course__option-title">Create Course with AI</h3>
            <p className="create-course__option-desc">Let AI guide you through the entire course creation process</p>
          </div>

          <div className="create-course__option create-course__option--manual" onClick={() => router.push('/add-course?noai=true')}>
            <div className="create-course__icon create-course__icon--manual">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="white"/>
              </svg>
            </div>
            <h3 className="create-course__option-title">Create Course without AI</h3>
            <p className="create-course__option-desc">Create your course manually with full control</p>
          </div>
        </div>
      </div>
    </div>
  )
}
