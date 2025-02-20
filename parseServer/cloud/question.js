Parse.Cloud.define('getQuestions', async (req) => {
   const query = new Parse.Query('Question')
   query.include('quiz_questions')
   try {
      const questionList = await query.find()
      return questionList.map(question => ({
         objectId: question.id,
         name: question.get('name'),
         video_name: question.get('video_name'),
         video_link: question.get('video_link'),
         file_name: question.get('file_name'),
         quiz_name: question.get('quiz_name'),
         quiz_questions: question.get('quiz_questions') || []
      }))
   } catch (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`)
   }
})
Parse.Cloud.define('addQuestion', async (req) => {
   const { section_id, name, question_type, video_name, video_link, pdf_file_name, pdf_file, quiz_name } = req.params
   console.log(pdf_file)
   const query = new Parse.Query('Section')
   const question = new Parse.Object('Question')
   try {
      question.set('name', name)
      question.set('question_type', question_type)
      if (question_type === 'Video') {
         question.set('video_name', video_name)
         question.set('video_link', video_link)
      }
      if (question_type === 'File') {
         question.set('pdf_file_name', pdf_file_name)
         question.set('pdf_file', pdf_file)
      }
      if (question_type === 'Quiz') {
         question.set('quiz_name', quiz_name)
      }
      const savedQuestion = await question.save()
      const section = await query.get(section_id)
      const sectionRelation = section.relation('questions')
      sectionRelation.add(savedQuestion)
      await section.save()
      return savedQuestion.toJSON()
   } catch (error) {
      console.error('Failed to save Question:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Question')
   }
})
Parse.Cloud.define("upQuestion", async (req) => {
   const { id, name, question_type, video_name, video_link, pdf_file_name, pdf_file, quiz_name } = req.params

   if (!id) {
      throw new Error("Question ID is required.")
   }
   const query = new Parse.Query("Question")

   try {
      const question = await query.get(id)

      if (!question) {
         throw new Error("Question not found.")
      }
      question.set("name", name)
      if (question_type === 'Video') {
         question.set('video_name', video_name)
         question.set('video_link', video_link)
      }
      if (question_type === 'File') {
         question.set('pdf_file_name', pdf_file_name)
         question.set('pdf_file', pdf_file)
      }
      if (question_type === 'Quiz') {
         question.set('quiz_name', quiz_name)
      }

      const updatedQuestion = await question.save()
      return updatedQuestion.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Question: ${error.message}`)
   }
});

Parse.Cloud.define("delQuestion", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Question ID is required.")
   }
   const query = new Parse.Query("Question")

   try {
      const question = await query.get(id)
      let quizQuestionsToDelete = []
      let quizAnswersToDelete = []

      if (question.get("question_type") === "Quiz") {
         const quizQuestionsRelation = question.relation("quiz_questions")
         const quizQuestions = await quizQuestionsRelation.query().find()
         quizQuestionsToDelete = quizQuestionsToDelete.concat(quizQuestions)

         for (let quizQuestion of quizQuestions) {
            const quizAnswersRelation = quizQuestion.relation("answers")
            const quizAnswers = await quizAnswersRelation.query().find()
            quizAnswersToDelete = quizAnswersToDelete.concat(quizAnswers)
         }

         await Parse.Object.destroyAll(quizAnswersToDelete)

         await Parse.Object.destroyAll(quizQuestionsToDelete)
      }
      return question.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Question: ${error.message}`)
   }
})


