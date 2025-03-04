const OpenAI = require("openai")

Parse.Cloud.define('aiAssistent', async (req) => {
   const { course_id, questionsHistory, resObjectsHistory } = req.params

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
            content: "Correct title",
         },
         {
            name: "course subtitle",
            content: "Correct subtitle",
         },
         {
            name: "course objective",
            content: "Correct objective",
         },
         {
            name: "course target_group",
            content: "Correct target_group",
         },
         {
            name: "course recommendation",
            content: "Correct recommendation",
         },
         {
            name: "course key_words",
            content: "Correct key_words",
         },
         {
            name: "course description",
            content: "Correct description",
         },

      ]

      return response
      // return json({ result: response.choices[0].message.content })
   } catch (error) {
      console.error(error);
      throw new Error(`Error calling OpenAI API ${error.message}`)
   }
})