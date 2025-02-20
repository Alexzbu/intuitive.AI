module.exports = async function deleteSectionById(id) {
   if (!id) {
      throw new Error("Section ID is required.")
   }

   const query = new Parse.Query("Section")

   try {
      const section = await query.get(id)

      const questionsRelation = section.relation("questions");
      const sectionQuestions = await questionsRelation.query().find();

      let quizQuestionsToDelete = []
      let quizAnswersToDelete = []

      for (let question of sectionQuestions) {
         const quizQuestionsRelation = question.relation("quiz_questions");
         const quizQuestions = await quizQuestionsRelation.query().find();
         quizQuestionsToDelete = quizQuestionsToDelete.concat(quizQuestions);
      }

      for (let quizQuestion of quizQuestionsToDelete) {
         const quizAnswersRelation = quizQuestion.relation("answers");
         const quizAnswers = await quizAnswersRelation.query().find();
         quizAnswersToDelete = quizAnswersToDelete.concat(quizAnswers);
      }

      await Parse.Object.destroyAll(quizAnswersToDelete);

      await Parse.Object.destroyAll(quizQuestionsToDelete)

      await Parse.Object.destroyAll(sectionQuestions)

      await section.destroy()

      return section.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Section: ${error.message}`)
   }
}
