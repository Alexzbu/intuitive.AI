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
   const { prompt, inputId, questionsHistory, resObjectsHistory } = req.params

   const preparedCourseQuestion = `
      ${questionsHistory ? `${prompt} preliminary data` : `${prompt} I want to create a course.`}
       ${questionsHistory} ${resObjectsHistory}
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
      I want to improve ${inputId} ${prompt}
      preliminary data ${questionsHistory} ${resObjectsHistory}
      I need an answer in the following format
      Preliminary data remains unchanged
      Change only ${inputId}
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
   const aiResponse = {
      role: 'assistant',
      content: 'Here is the updated structure with the changed subtitle:\n' +
         '\n' +
         '```json\n' +
         '[\n' +
         '    {\n' +
         '        "name": "course title",\n' +
         '        "content": "JavaScript and AI Integration"\n' +
         '    },\n' +
         '    {\n' +
         '        "name": "course subtitle",\n' +
         '        "content": "Leveraging AI to Enhance JavaScript Applications"\n' +
         '    },\n' +
         '    {\n' +
         '        "name": "course objective",\n' +
         '        "content": "To equip students with the skills to integrate artificial intelligence APIs and libraries into JavaScript applications, enhancing functionality and user interaction."\n' +
         '    },\n' +
         '    {\n' +
         '        "name": "course target_group",\n' +
         '        "content": "Web developers, software engineers, and AI enthusiasts looking to expand their JavaScript skills with AI integration."\n' +
         '    },\n' +
         '    {\n' +
         '        "name": "course recommendation",\n' +
         '        "content": "Participants should have a basic understanding of JavaScript and web development concepts. Familiarity with APIs is beneficial."\n' +
         '    },\n' +
         '    {\n' +
         '        "name": "course key_words",\n' +
         '        "content": "JavaScript, AI, machine learning, integration, web development, APIs, TensorFlow.js, OpenAI, neural networks"\n' +
         '    },\n' +
         '    {\n' +
         '        "name": "course description",\n' +
         `        "content": "This course provides a comprehensive guide to integrating artificial intelligence into JavaScript applications. Students will learn to work with popular AI frameworks and libraries such as TensorFlow.js and OpenAI's APIs. The curriculum covers essential concepts of AI, practical coding examples, and project-based learning to create intelligent web applications. By the end of the course, students will be able to build applications that leverage machine learning for functionalities like image recognition, natural language processing, and recommendation systems."\n` +
         '    }\n' +
         ']\n' +
         '```',
      refusal: null
   }

   console.log(completion.choices[0].message)
   const content = completion.choices[0].message.content
   // const content = aiResponse.content
   const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/)
   let jsonString
   if (jsonMatch) {
      jsonString = jsonMatch[1]
   } else {
      jsonString = content
   }
   jsonString = jsonString.replace(/\n/g, "")
   jsonString = jsonString.replace(/\[/g, "").replace(/\]/g, "");
   jsonString = jsonString.replace(/,\s*}/g, "}")

   try {
      const jsonData = JSON.parse(`[${jsonString}]`)
      console.log(jsonData)
      return jsonData


   } catch (error) {
      console.error("Error parsing JSON:", error);
      return [
         {
            name: "AI",
            content: content
         }
      ]
   }

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