Parse.Cloud.define('getAnswers', async (req) => {
   const query = new Parse.Query('Answer')
   try {
      const answerList = await query.find()
      const allAnswers = answerList.map((answer) => {
         return {
            objectId: answer.id,
            name: answer.get('name'),
            isCorrect: answer.get('isCorrect')
         }
      })
      return allAnswers
   } catch (error) {
      throw new Error(`Failed to fetch answers: ${error.message}`)
   }
})

Parse.Cloud.define('addAnswer', async (req) => {
   const { quiz_question_id, name, isCorrect = false } = req.params
   const query = new Parse.Query('Quiz_Question')
   const answer = new Parse.Object('Answer')
   try {
      answer.set('name', name)
      answer.set('isCorrect', isCorrect)
      const savedAnwer = await answer.save()
      const quiz_question = await query.get(quiz_question_id)
      const quiz_questionRelation = quiz_question.relation('answers')
      quiz_questionRelation.add(savedAnwer)
      await quiz_question.save()
      return savedAnwer.toJSON()
   } catch (error) {
      console.error('Failed to save Answer:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Answer')
   }
})
Parse.Cloud.define("upAnswer", async (req) => {
   const { id, name, isCorrect = false } = req.params

   if (!id) {
      throw new Error("Answer ID is required.")
   }
   const query = new Parse.Query("Answer")

   try {
      const answer = await query.get(id)

      if (!answer) {
         throw new Error("Answer not found.")
      }
      answer.set("name", name)
      answer.set('isCorrect', isCorrect)
      const updatedAnswer = await answer.save()
      return updatedAnswer.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Answer: ${error.message}`)
   }
});

Parse.Cloud.define("delAnswer", async (req) => {
   const { id } = req.params;

   if (!id) {
      throw new Error("Answer ID is required.");
   }
   const query = new Parse.Query("Answer")

   try {
      const answer = await query.get(id)
      await answer.destroy()
      return answer.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Answer: ${error.message}`)
   }
})



