Parse.Cloud.define('getQuestion', async (req) => {
   const { id } = req.params

   const query = new Parse.Query('Question')

   const question = await query.get(id)

   query.include('quiz_questions')
   return {
      objectId: question.id,
      name: question.get('name'),
      question_type: question.get('question_type'),
      video_name: question.get('video_name'),
      video_link: question.get('video_link'),
      file_name: question.get('file_name'),
      file: question.get('file'),
      quiz_name: question.get('quiz_name'),
      quiz_questions: question.get('quiz_questions') || [],
      section: question.get('section')
   }
})

Parse.Cloud.define('getQuestions', async (req) => {
   const { name } = req.params

   const query = new Parse.Query('Question')
   if (name) {
      query.equalTo("name", name);
   }
   query.include('quiz_questions')
   try {
      const questionList = await query.find()
      return questionList.map(question => ({
         objectId: question.id,
         name: question.get('name'),
         question_type: question.get('question_type'),
         video_name: question.get('video_name'),
         video_link: question.get('video_link'),
         file_name: question.get('file_name'),
         file: question.get('file'),
         quiz_name: question.get('quiz_name'),
         quiz_questions: question.get('quiz_questions') || [],
         section: question.get('section')
      }))
   } catch (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`)
   }
})
Parse.Cloud.define("addQuestion", async (req) => {
   const { section_id, name, question_type, video_name, video_link, file_name, file, quiz_name } = req.params
   const query = new Parse.Query("Section")
   const question = new Parse.Object("Question")

   try {
      question.set("name", name);
      question.set("question_type", question_type);

      if (question_type === "Video") {
         question.set("video_name", video_name);
         question.set("video_link", video_link);
      }
      if (question_type === 'File') {
         question.set('file_name', file_name)
         const parseFile = new Parse.File(file_name, { base64: file })
         question.set('file', parseFile)
      }


      if (question_type === "Quiz") {
         question.set("quiz_name", quiz_name)
      }
      const section = await query.get(section_id)

      question.set('section', section)
      const savedQuestion = await question.save()


      const sectionRelation = section.relation("questions")
      sectionRelation.add(savedQuestion)
      await section.save()

      return savedQuestion.toJSON();
   } catch (error) {
      console.error("Failed to save Question:", error);
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, "Failed to save Question");
   }
})

Parse.Cloud.define("upQuestion", async (req) => {
   const { id, name, question_type, video_name, video_link, file_name, file, quiz_name } = req.params

   if (!id) {
      throw new Error("Question ID is required.")
   }
   const query = new Parse.Query("Question")

   try {
      const question = await query.get(id)

      if (!question) {
         throw new Error("Question not found.")
      }
      const type = question.get('question_type')
      question.set("name", name)
      if (type === 'Video') {
         question.set('video_name', video_name)
         question.set('video_link', video_link)
      }
      if (type === 'File') {
         question.set('file_name', file_name)
         if (file) {
            question.get('file').destroy()
            const parseFile = new Parse.File(file_name, { base64: file })
            question.set('file', parseFile)
         }
      }
      if (type === 'Quiz') {
         question.set('quiz_name', quiz_name)
      }

      const updatedQuestion = await question.save()
      return updatedQuestion.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Question: ${error.message}`)
   }
})

Parse.Cloud.define("delQuestion", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Question ID is required.")
   }
   const query = new Parse.Query("Question")
   query.include('section')

   try {
      const question = await query.get(id)
      const section = question.get("section")
      section.relation('questions').remove(question)
      await section.save()
      if (question.get("question_type") === "File") {
         question.get('file').destroy()
      }

      let quizQuestionsToDelete = []
      let quizAnswersToDelete = []
      if (question.get("question_type") === "Quiz") {
         const quizQuestionsRelation = question.relation("quiz_questions")
         const quizQuestions = await quizQuestionsRelation.query().find()
         quizQuestionsToDelete = quizQuestionsToDelete.concat(quizQuestions)
         quizQuestions.forEach(async (quiz_question) => {
            question.relation('quiz_questions').remove(quiz_question)
         })

         for (let quizQuestion of quizQuestions) {
            const quizAnswersRelation = quizQuestion.relation("answers")
            const quizAnswers = await quizAnswersRelation.query().find()
            quizAnswersToDelete = quizAnswersToDelete.concat(quizAnswers)
            quizAnswers.forEach(async (antwort) => {
               quizQuestion.relation('answers').remove(antwort)
               await quizQuestion.save()
            })
         }

         await Parse.Object.destroyAll(quizAnswersToDelete)

         await Parse.Object.destroyAll(quizQuestionsToDelete)
      }
      await question.save()
      await question.destroy()
      return question.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Question: ${error.message}`)
   }
})


