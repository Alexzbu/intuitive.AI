import { GoogleGenAI } from "@google/genai"

Parse.Cloud.define('generateCourseOutline', async (req) => {
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
   const {
      language,
      targetAudience,
      goal,
      duration,
      description,
      expertiseLevel,
      styleTone,
      topics,
      additionalConstraints,
      courseTitle,
   } = req.params

   const preparedPrompt = `
You are a professional course designer.
Generate a structured course outline for the course titled "${courseTitle || 'Untitled Course'}".
Return ONLY a valid JSON array of modules. Each module has a "title" (string) and "chapters" (array of strings).
No other text, no markdown, no explanation.

Course details:
- Language: ${language || 'Not specified'}
- Target Audience: ${targetAudience || 'Not specified'}
- Goal: ${goal || 'Not specified'}
- Duration: ${duration ? duration + ' hours' : 'Not specified'}
- Description: ${description || 'Not specified'}
- Expertise Level: ${expertiseLevel || 'Not specified'}
- Style/Tone: ${styleTone || 'Not specified'}
- Topics to include: ${topics || 'Not specified'}
- Additional Requirements: ${additionalConstraints || 'None'}

Generate between 4 and 8 modules, each with 3 to 6 chapters.
Scale the number of modules and chapters proportionally to the course duration.

Required format:
[
  {
    "title": "Module Title Here",
    "chapters": ["Chapter 1 title", "Chapter 2 title", "Chapter 3 title"]
  }
]
`

   const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: preparedPrompt,
   })

   const content = response.text

   try {
      const cleaned = content.replace(/```json\n?|```/g, '').trim()
      const outline = JSON.parse(cleaned)
      if (Array.isArray(outline)) return outline
      throw new Error('Not an array')
   } catch {
      return []
   }
})
