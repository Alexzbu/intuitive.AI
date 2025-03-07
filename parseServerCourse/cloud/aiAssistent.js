const OpenAI = require("openai")


Parse.Cloud.define('getAiAssistentHistory', async (req) => {
   const { prompt } = req.params
   const query = new Parse.Query('AI_Assistent')
   if (prompt) {
      query.contains("request", prompt.toLowerCase())
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

Parse.Cloud.define('addAiAssistentHistory', async (req) => {
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
   } catch (error) {
      console.error(error);
      throw new Error(`Error saving assistent ${error.message}`)
   }

})

Parse.Cloud.define('aiAssistent', async (req) => {
   const openai = new OpenAI({
      // apiKey: process.env.OPENAI_API_KEY,
   })
   const { prompt, inputId } = req.params

   const preparedCourseQuestion = `
      I want to create a course.
      I need an answer in the following format:
      Do not change the name key
      {
         "name": must remain "course title",
         content: "course title",
      },
      {
         "name": must remain  "course subtitle",
         "content": "course subtitle",
      },
      {
         "name": must remain  "course objective",
         "content": "course objective",
      },
      {
         "name":  must remain "course target_group",
         "content": "course target_group",
      },
      {
         "name": must remain  "course recommendation",
         "content": "course recommendation",
      },
      {
         "name": must remain  "course key_words",
         "content": "course key_words",
      },
      {
         "name": must remain  "course description",
         "content": "course description",
      }`

   const preparedInputQuestion = `
      I want to improve ${inputId}
      I need an answer in the following format
      
      Do not change the name key
      {
         "name": must remain course ${inputId}",
         "content": "course ${inputId}",
      }`
   let preparedQuestion = ''

   if (inputId) {
      preparedQuestion = preparedInputQuestion
   } else {
      preparedQuestion = preparedCourseQuestion
   }
   const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
         { role: "system", content: "You are a helpful assistant." },
         {
            role: "user",
            content: preparedQuestion + prompt,
         },
      ],
      store: true,
   })
   // const aiResponse = {
   //    role: 'assistant',
   //    content: '```json\n' +
   //       '{\n' +
   //       '   "name": "course title",\n' +
   //       '   "content": "JavaScript Fundamentals"\n' +
   //       '},\n' +
   //       '{\n' +
   //       '   "name": "course subtitle",\n' +
   //       '   "content": "Master the Basics of JavaScript Programming"\n' +
   //       '},\n' +
   //       '{\n' +
   //       '   "name": "course objective",\n' +
   //       '   "content": "To equip learners with foundational knowledge in JavaScript, enabling them to understand and write basic code."\n' +
   //       '},\n' +
   //       '{\n' +
   //       '   "name": "course target_group",\n' +
   //       '   "content": "Beginners interested in web development and programming."\n' +
   //       '},\n' +
   //       '{\n' +
   //       '   "name": "course recommendation",\n' +
   //       '   "content": "No prior programming experience is required, but familiarity with HTML and CSS will be helpful."\n' +
   //       '},\n' +
   //       '{\n' +
   //       '   "name": "course key_words",\n' +
   //       '   "content": "JavaScript, programming, web development, coding, beginner"\n' +
   //       '},\n' +
   //       '{\n' +
   //       '   "name": "course description",\n' +
   //       '   "content": "This course provides an introduction to JavaScript, covering core concepts, syntax, and best practices. Students will engage in hands-on coding exercises to reinforce their understanding and build interactive web applications."\n' +
   //       '}\n' +
   //       '```',
   //    refusal: null
   // }

   console.log(completion.choices[0].message.content)
   const content = completion.choices[0].message.content
   const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/)
   let jsonString
   // const jsonMatch = aiResponse.content.match(/```json\n([\s\S]+?)\n```/)
   if (jsonMatch) {
      jsonString = jsonMatch[1]
   } else {
      jsonString = content
   }
   jsonString = jsonString.replace(/\n/g, "")
   jsonString = jsonString.replace(/,\s*}/g, "}")

   try {
      const jsonData = JSON.parse(`[${jsonString}]`)
      if (Array.isArray(jsonData)) {
         return jsonData
      } else {
         return [
            {
               name: "",
               content: `${jsonString}`
            }
         ]
      }

   } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error(`Error parsing JSON: ${error.message}`)

   }
   // } else {
   //    console.error("JSON content not found.");
   //    throw new Error(`JSON content not found: ${error.message}`)
   // }




   // const responseJSON = [
   //    {
   //       name: "course title",
   //       content: `Correct title for ${prompt}`,
   //    },
   //    {
   //       name: "course subtitle",
   //       content: `Correct subtitle for ${prompt}`,
   //    },
   //    {
   //       name: "course objective",
   //       content: `Correct objective for ${prompt}`,
   //    },
   //    {
   //       name: "course target_group",
   //       content: `Correct target_group for ${prompt}`,
   //    },
   //    {
   //       name: "course recommendation",
   //       content: `Correct recommendation for ${prompt}`,
   //    },
   //    {
   //       name: "course key_words",
   //       content: `Correct key_words for ${prompt}`,
   //    },
   //    {
   //       name: "course description",
   //       content: `Correct description for ${prompt}`,
   //    },
   // ]

   // return responseJSON
})