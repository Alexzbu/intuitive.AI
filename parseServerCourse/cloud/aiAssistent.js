const OpenAI = require("openai")

Parse.Cloud.define('getAiAssistentHistory', async (req) => {
   const { request } = req.params
   const query = new Parse.Query('AI_Assistent')
   if (request) {
      query.contains("request", request.toLowerCase())
   }
   try {
      const aIAssistentList = await query.find()
      const allAssistens = aIAssistentList.map((assistent) => {
         return assistent
      })
      return allAssistens
   } catch (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`)
   }

})

Parse.Cloud.define('aiAssistent', async (req) => {
   const { course_id, request, questionsHistory, resObjectsHistory } = req.params

   const query = new Parse.Query('Course')
   const aiAssistent = new Parse.Object('AI_Assistent')

   try {
      if (questionsHistory) {
         aiAssistent.set('request', questionsHistory)
         aiAssistent.set('response', resObjectsHistory)
         const savedAiAssistent = await aiAssistent.save()
         const course = await query.get(course_id)
         course.set('ai_assistent', savedAiAssistent)
         await course.save()
      }

      const response = [
         {
            name: "course title",
            content: `Correct title for ${request}`,
         },
         {
            name: "course subtitle",
            content: `Correct subtitle for ${request}`,
         },
         {
            name: "course objective",
            content: `Correct objective for ${request}`,
         },
         {
            name: "course target_group",
            content: `Correct target_group for ${request}`,
         },
         {
            name: "course recommendation",
            content: `Correct recommendation for ${request}`,
         },
         {
            name: "course key_words",
            content: `Correct key_words for ${request}`,
         },
         {
            name: "course description",
            content: `Correct description for ${request}`,
         },
      ]

      return response
      // return json({ result: response.choices[0].message.content })
   } catch (error) {
      console.error(error);
      throw new Error(`Error calling OpenAI API ${error.message}`)
   }
})