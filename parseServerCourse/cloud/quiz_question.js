Parse.Cloud.define('getQuiz_Question', async (req) => {
   const { id } = req.params

   const query = new Parse.Query('Quiz_Question')

   const quiz_question = await query.get(id)

   query.include('answers')
   return {
      objectId: quiz_question.id,
      name: quiz_question.get('name'),
      answer_explenetion: quiz_question.get('answer_explenetion'),
      answers: quiz_question.get('answers') || []
   }
})

Parse.Cloud.define('getQuiz_Questions', async (req) => {
   const query = new Parse.Query('Quiz_Question')
   query.include('answers')

   try {
      const quiz_questionList = await query.find()
      const allQuiz_questions = quiz_questionList.map((quiz_question) => {
         return {
            objectId: quiz_question.id,
            name: quiz_question.get('name'),
            answer_explenetion: quiz_question.get('answer_explenetion'),
            answers: quiz_question.get('answers') || []
         }
      })
      return allQuiz_questions
   } catch (error) {
      throw new Error(`Failed to fetch quiz_questions: ${error.message}`)
   }
})

Parse.Cloud.define('addQuiz_Question', async (req) => {
   const { question_id, name, answer_explenetion } = req.params
   const query = new Parse.Query('Question')
   const quiz_question = new Parse.Object('Quiz_Question')
   try {
      quiz_question.set('name', name)
      quiz_question.set('answer_explenetion', answer_explenetion)
      const savedQuizQuestion = await quiz_question.save()
      const question = await query.get(question_id)
      const questionRelation = question.relation('quiz_questions')
      questionRelation.add(savedQuizQuestion)
      await question.save()
      return savedQuizQuestion.toJSON()
   } catch (error) {
      console.error('Failed to save Quiz_question:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Quiz_Question')
   }
})
Parse.Cloud.define("upQuiz_Question", async (req) => {
   const { id, name, answer_explenetion } = req.params

   if (!id) {
      throw new Error("Quiz_question ID is required.")
   }
   const query = new Parse.Query("Quiz_Question")

   try {
      const quiz_question = await query.get(id)

      if (!quiz_question) {
         throw new Error("Quiz_question not found.")
      }
      quiz_question.set("name", name)
      quiz_question.set('answer_explenetion', answer_explenetion)

      const updatedQuiz_question = await quiz_question.save()
      return updatedQuiz_question.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Quiz_Question: ${error.message}`)
   }
});

Parse.Cloud.define("delQuiz_Question", async (req) => {
   const { id } = req.params;

   if (!id) {
      throw new Error("Quiz_question ID is required.");
   }
   const query = new Parse.Query("Quiz_Question")

   try {
      const quiz_question = await query.get(id)
      const answers = quiz_question.relation('answers')
      const quiz_questionAnswers = await answers.query().find()
      quiz_questionAnswers.forEach(async (antwort) => {
         quiz_question.relation('answers').remove(antwort)
         await quiz_question.save()
      })
      await Parse.Object.destroyAll(quiz_questionAnswers)
      await quiz_question.save()
      await quiz_question.destroy()
      return quiz_question.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Quiz_question: ${error.message}`)
   }
})



