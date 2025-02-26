module.exports = async function deleteSectionById(id) {
   if (!id) {
      throw new Error("Section ID is required.")
   }

   const query = new Parse.Query("Section")

   try {
      const section = await query.get(id)
      const course = section.get("course")
      course.relation('sections').remove(section)
      await course.save()
      const questionsRelation = section.relation("questions");
      const sectionQuestions = await questionsRelation.query().find()

      let quizQuestionsToDelete = []
      let quizAnswersToDelete = []

      for (let question of sectionQuestions) {
         if (question.get("question_type") === "File") {
            question.get('file').destroy()
         }
         const quizQuestionsRelation = question.relation("quiz_questions")
         const quizQuestions = await quizQuestionsRelation.query().find()
         quizQuestionsToDelete = quizQuestionsToDelete.concat(quizQuestions)
         quizQuestions.forEach(async (quiz_question) => {
            question.relation('quiz_questions').remove(quiz_question)
            await question.save()
         })
         section.relation("questions").remove(question)
      }

      for (let quizQuestion of quizQuestionsToDelete) {
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

      await Parse.Object.destroyAll(sectionQuestions)

      await section.save()

      await section.destroy()

      return section.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Section: ${error.message}`)
   }
}
