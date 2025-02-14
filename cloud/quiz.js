Parse.Cloud.define('getQuizes', async (req) => {
   const query = new Parse.Query('Quiz')

   try {
      const quizList = await query.find()
      return quizList.map(quiz => ({
         objectId: quiz.id,
         quiz_name: quiz.get('quiz_name')
      }))
   } catch (error) {
      throw new Error(`Failed to fetch quizs: ${error.message}`)
   }
})
Parse.Cloud.define('addQuiz', async (req) => {
   const { id, quiz_name } = req.params
   const query = new Parse.Query('Section')
   const quiz = new Parse.Object('Quiz')
   try {
      const section = await query.get(id)
      console.log(section)
      const sectionRelation = quiz.relation('section')
      quiz.set('quiz_name', quiz_name)
      sectionRelation.add(section)
      const savedQuiz = await quiz.save()
      return savedQuiz.toJSON()
   } catch (error) {
      console.error('Failed to save Quiz:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Quiz')
   }
})
Parse.Cloud.define("upQuiz", async (req) => {
   const { id, quiz_name } = req.params

   if (!id) {
      throw new Error("Quiz ID is required.")
   }
   const quiz = Parse.Object.extend("Quiz")
   const query = new Parse.Query(quiz)

   try {
      const quiz = await query.get(id)

      if (!quiz) {
         throw new Error("Quiz not found.")
      }
      quiz.set("quiz_name", quiz_name);

      const updatedQuiz = await quiz.save()
      return updatedQuiz.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Quiz: ${error.message}`)
   }
});

Parse.Cloud.define("delQuiz", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Quiz ID is required.")
   }
   const quiz = Parse.Object.extend("Quiz")
   const query = new Parse.Query(quiz)

   try {
      const quiz = await query.get(id)
      await quiz.destroy()
      return quiz.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Quiz: ${error.message}`)
   }
});


