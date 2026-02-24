import { GoogleGenAI } from "@google/genai"

Parse.Cloud.define('generateCourseTitles', async (req) => {
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
      additionalConstraints
   } = req.params

   const preparedPrompt = `
You are a professional course creator.
Generate exactly 5 creative and engaging course title options based on the following information.
Return ONLY a valid JSON array of 5 strings, no other text, no markdown.

- Language: ${language || 'Not specified'}
- Target Audience: ${targetAudience || 'Not specified'}
- Goal: ${goal || 'Not specified'}
- Duration: ${duration ? duration + ' hours' : 'Not specified'}
- Description: ${description || 'Not specified'}
- Expertise Level: ${expertiseLevel || 'Not specified'}
- Style/Tone: ${styleTone || 'Not specified'}
- Topics: ${topics || 'Not specified'}
- Additional Requirements: ${additionalConstraints || 'None'}

Format: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]
`

   const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: preparedPrompt,
   })

   const content = response.text
   console.log('AI Response:', content) // For debugging

   try {
      const cleaned = content.replace(/```json\n?|```/g, '').trim()
      const titles = JSON.parse(cleaned)
      if (Array.isArray(titles)) return titles
      throw new Error('Not an array')
   } catch {
      const matches = content.match(/"([^"]+)"/g)
      return matches ? matches.slice(0, 5).map(s => s.replace(/"/g, '')) : []
   }
})
