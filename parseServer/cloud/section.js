const deleteSectionById = require("./deleteSection")

Parse.Cloud.define('getSections', async (req) => {
   const { name } = req.params

   const query = new Parse.Query('Section')
   if (name) {
      query.equalTo("name", name);
   }
   query.include('questions')
   try {
      const sectionList = await query.find()
      const allSections = sectionList.map((section) => {
         return {
            objectId: section.id,
            name: section.get('name'),
            questions: section.get('questions') || []
         }
      })
      return allSections
   } catch (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`)
   }
})

Parse.Cloud.define('addSection', async (req) => {
   const { course_id, name } = req.params
   const query = new Parse.Query('Course')
   const section = new Parse.Object('Section')
   try {
      section.set('name', name)
      const savedSection = await section.save()
      const course = await query.get(course_id)
      const courseRelation = course.relation('sections')
      courseRelation.add(savedSection)
      await course.save()
      return savedSection.toJSON()
   } catch (error) {
      console.error('Failed to save Section:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Section')
   }
})
Parse.Cloud.define("upSection", async (req) => {
   const { id, name } = req.params

   if (!id) {
      throw new Error("Section ID is required.")
   }
   const query = new Parse.Query("Section")

   try {
      const section = await query.get(id)

      if (!section) {
         throw new Error("Section not found.")
      }
      section.set("name", name);

      const updatedSection = await section.save()
      return updatedSection.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Section: ${error.message}`)
   }
});

Parse.Cloud.define("delSection", async (req) => {
   return await deleteSectionById(req.params.id);
})


