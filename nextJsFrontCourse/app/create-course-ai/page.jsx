"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Detailed Info' },
  { num: 4, label: 'Review & Edit' },
  { num: 5, label: 'Course Outline' },
  { num: 6, label: 'Appointment' },
]

const LANGUAGES = ['English', 'German', 'French', 'Spanish', 'Italian', 'Portuguese', 'Arabic', 'Chinese']
const EXPERTISE_LEVELS = ['Beginner', 'Intermediate', 'Advance']
const STYLE_TONES = ['Modern', 'Professional', 'Playful', 'Conversational']

const defaultFormData = {
  language: '',
  targetAudience: '',
  goal: '',
  duration: '',
  description: '',
  expertiseLevel: '',
  styleTone: '',
  topics: '',
  price: '',
  additionalConstraints: '',
}

export default function CreateCourseAI() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(defaultFormData)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('course_ai_draft')
      if (saved) setFormData(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('course_ai_draft', JSON.stringify(formData))
    } catch {}
  }, [formData])

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const goTo = (step) => setCurrentStep(step)
  const next = () => setCurrentStep(s => s + 1)
  const back = () => setCurrentStep(s => s - 1)

  const getCircleState = (index) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className="ai-wizard">
      {/* Sidebar */}
      <aside className="ai-wizard__sidebar">
        {STEPS.map((step, index) => (
          <div key={step.num} className="ai-wizard__step-item">
            {index > 0 && (
              <div className={`ai-wizard__step-connector${index <= currentStep ? ' ai-wizard__step-connector--done' : ''}`} />
            )}
            <div className={`ai-wizard__step-circle ai-wizard__step-circle--${getCircleState(index)}`}>
              {getCircleState(index) === 'completed' ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : step.num}
            </div>
            <span className={`ai-wizard__step-label${index === currentStep ? ' ai-wizard__step-label--active' : ''}`}>
              {step.label}
            </span>
          </div>
        ))}
      </aside>

      {/* Content */}
      <div className="ai-wizard__content">
        {currentStep === 0 && (
          <>
            <div className="ai-wizard__header">
              <button className="ai-wizard__back" onClick={() => router.back()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Basic Information
              </button>
            </div>

            <div className="ai-wizard__form">
              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Language</label>
                <div className="ai-wizard__select-wrapper">
                  <select
                    className="ai-wizard__select"
                    value={formData.language}
                    onChange={e => update('language', e.target.value)}
                  >
                    <option value="">Choose language</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <span className="ai-wizard__select-arrow">&#8964;</span>
                </div>
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Target Audience</label>
                <input
                  className="ai-wizard__input"
                  type="text"
                  value={formData.targetAudience}
                  onChange={e => update('targetAudience', e.target.value)}
                />
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Goal of the Training/ Course</label>
                <input
                  className="ai-wizard__input"
                  type="text"
                  value={formData.goal}
                  onChange={e => update('goal', e.target.value)}
                />
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Course Duration</label>
                <input
                  className="ai-wizard__input"
                  type="number"
                  placeholder="No. of hours"
                  value={formData.duration}
                  onChange={e => update('duration', e.target.value)}
                />
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Course Description</label>
                <textarea
                  className="ai-wizard__textarea"
                  placeholder="Course description"
                  value={formData.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>

              <div className="ai-wizard__actions">
                <button className="ai-wizard__btn-cancel" onClick={() => router.push('/dashboard')}>Cancel</button>
                <button className="ai-wizard__btn-next" onClick={next}>Next</button>
              </div>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <div className="ai-wizard__header">
              <button className="ai-wizard__back" onClick={back}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Detailed Information
              </button>
            </div>

            <div className="ai-wizard__form">
              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Audience level of expertise</label>
                <div className="ai-wizard__select-wrapper">
                  <select
                    className="ai-wizard__select"
                    value={formData.expertiseLevel}
                    onChange={e => update('expertiseLevel', e.target.value)}
                  >
                    <option value="">Beginner, Intermediate , Advance</option>
                    {EXPERTISE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <span className="ai-wizard__select-arrow">&#8964;</span>
                </div>
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Preferred Style/Tone</label>
                <div className="ai-wizard__select-wrapper">
                  <select
                    className="ai-wizard__select"
                    value={formData.styleTone}
                    onChange={e => update('styleTone', e.target.value)}
                  >
                    <option value="">Modern , Professional, Playful , Conversational</option>
                    {STYLE_TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="ai-wizard__select-arrow">&#8964;</span>
                </div>
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">What topics or content should be included?</label>
                <textarea
                  className="ai-wizard__textarea"
                  placeholder="Course description"
                  value={formData.topics}
                  onChange={e => update('topics', e.target.value)}
                />
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Price for the Course</label>
                <input
                  className="ai-wizard__input"
                  type="number"
                  placeholder="Add price in euros"
                  value={formData.price}
                  onChange={e => update('price', e.target.value)}
                />
              </div>

              <div className="ai-wizard__field-group">
                <label className="ai-wizard__label">Additional Constraints or Requirements</label>
                <textarea
                  className="ai-wizard__textarea"
                  placeholder="Course description"
                  value={formData.additionalConstraints}
                  onChange={e => update('additionalConstraints', e.target.value)}
                />
              </div>

              <div className="ai-wizard__actions">
                <button className="ai-wizard__btn-back" onClick={back}>Back</button>
                <button className="ai-wizard__btn-next" onClick={next}>Next</button>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="ai-wizard__header">
              <button className="ai-wizard__back" onClick={back}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Review & Edit
              </button>
            </div>

            <div className="ai-wizard__form">
              {/* Basic Information card */}
              <div className="ai-wizard__review-card">
                <div className="ai-wizard__review-card-header">
                  <span>Basic Information</span>
                  <button className="ai-wizard__review-edit-btn" onClick={() => goTo(0)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#2b7ab7"/>
                    </svg>
                    Edit Details
                  </button>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Language</span>
                  <span className="ai-wizard__review-field-value">{formData.language || '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Audience</span>
                  <span className="ai-wizard__review-field-value">{formData.targetAudience || '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Goal</span>
                  <span className="ai-wizard__review-field-value">{formData.goal || '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Duration</span>
                  <span className="ai-wizard__review-field-value">{formData.duration ? `${formData.duration} Hours` : '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Course Description</span>
                  <span className="ai-wizard__review-field-value">{formData.description || '—'}</span>
                </div>
              </div>

              {/* Detailed Information card */}
              <div className="ai-wizard__review-card">
                <div className="ai-wizard__review-card-header">
                  <span>Detailed Information</span>
                  <button className="ai-wizard__review-edit-btn" onClick={() => goTo(1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#2b7ab7"/>
                    </svg>
                    Edit Details
                  </button>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Experience Level</span>
                  <span className="ai-wizard__review-field-value">{formData.expertiseLevel || '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Style/ Tone</span>
                  <span className="ai-wizard__review-field-value">{formData.styleTone || '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Topics to be included</span>
                  <span className="ai-wizard__review-field-value">{formData.topics || '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Price</span>
                  <span className="ai-wizard__review-field-value">{formData.price ? `€${formData.price}` : '—'}</span>
                </div>
                <div className="ai-wizard__review-field">
                  <span className="ai-wizard__review-field-label">Additional constraints or Requirements</span>
                  <span className="ai-wizard__review-field-value">{formData.additionalConstraints || '—'}</span>
                </div>
              </div>

              <div className="ai-wizard__actions">
                <button className="ai-wizard__btn-back" onClick={back}>Back</button>
                <button className="ai-wizard__btn-generate" onClick={next}>Generate Course Title &amp; Outline</button>
              </div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="ai-wizard__header">
              <button className="ai-wizard__back" onClick={back}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Course Outline
              </button>
            </div>

            <div className="ai-wizard__form">
              <div className="ai-wizard__placeholder-card">
                <p>Your AI-generated course outline will appear here.</p>
              </div>
              <div className="ai-wizard__actions">
                <button className="ai-wizard__btn-back" onClick={back}>Back</button>
                <button className="ai-wizard__btn-next" onClick={next}>Next</button>
              </div>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <div className="ai-wizard__header">
              <button className="ai-wizard__back" onClick={back}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Appointment
              </button>
            </div>

            <div className="ai-wizard__form">
              <div className="ai-wizard__placeholder-card">
                <p>Schedule your course appointment here.</p>
              </div>
              <div className="ai-wizard__actions">
                <button className="ai-wizard__btn-back" onClick={back}>Back</button>
                <button className="ai-wizard__btn-next" onClick={() => {
                  localStorage.removeItem('course_ai_draft')
                  router.push('/dashboard')
                }}>Finish</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
