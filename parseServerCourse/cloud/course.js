const deleteSectionById = require("./deleteSection")

Parse.Cloud.define('getCourses', async (req) => {
   const { name } = req.params

   const query = new Parse.Query('Course')
   if (name) {
      query.equalTo("name", name);
   }
   query.include('sections')
   try {
      const courseList = await query.find()
      const allCourses = courseList.map((course) => {
         return {
            objectId: course.id,
            name: course.get('name'),
            sections: course.get('sections') || []
         }
      })
      return allCourses
   } catch (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`)
   }
})

Parse.Cloud.define('addCourse', async (req) => {
   const { name, subtitle, objective, target_group, entry_requirements, self_assessment, target_profile,
      participants_number, recommendation, trainer_skills, qualifications, description, categories,
      technology, language, key_words, isFree, price } = req.params

   const course = new Parse.Object('Course')
   course.set('name', name)
   course.set('subtitle', subtitle)
   course.set('objective', objective)
   course.set('target_group', target_group)
   course.set('entry_requirements', entry_requirements)
   course.set('self_assessment', self_assessment)
   course.set('target_profile', target_profile)
   course.set('participants_number', participants_number)
   course.set('recommendation', recommendation)
   course.set('trainer_skills', trainer_skills)
   course.set('qualifications', qualifications)
   course.set('description', description)
   course.set('categories', categories)
   course.set('technology', technology)
   course.set('language', language)
   course.set('key_words', key_words)
   course.set('isFree', isFree)
   course.set('price', price)

   try {
      const savedCourse = await course.save()
      return savedCourse.toJSON()
   } catch (error) {
      console.error('Failed to save Course:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Course')
   }
})
Parse.Cloud.define("upCourse", async (req) => {
   const { id, name, subtitle, objective, target_group, entry_requirements, self_assessment, target_profile,
      participants_number, recommendation, trainer_skills, qualifications, description, categories,
      technology, language, key_words, isFree, price } = req.params

   if (!id) {
      throw new Error("Course ID is required.")
   }
   const query = new Parse.Query("Course")

   try {
      const course = await query.get(id)

      if (!course) {
         throw new Error("Course not found.")
      }
      course.set('name', name)
      course.set('subtitle', subtitle)
      course.set('objective', objective)
      course.set('target_group', target_group)
      course.set('entry_requirements', entry_requirements)
      course.set('self_assessment', self_assessment)
      course.set('target_profile', target_profile)
      course.set('participants_number', participants_number)
      course.set('recommendation', recommendation)
      course.set('trainer_skills', trainer_skills)
      course.set('qualifications', qualifications)
      course.set('description', description)
      course.set('categories', categories)
      course.set('technology', technology)
      course.set('language', language)
      course.set('key_words', key_words)
      course.set('isFree', isFree)
      course.set('price', price)

      const updatedCourse = await course.save()
      return updatedCourse.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Course: ${error.message}`)
   }
});

Parse.Cloud.define("delCourse", async (req) => {
   const { id } = req.params;

   if (!id) {
      throw new Error("Course ID is required.");
   }
   const query = new Parse.Query("Course")

   try {
      const course = await query.get(id)
      const sections = course.relation('sections')
      const courseSections = await sections.query().find()
      for (let section of courseSections) {
         await deleteSectionById(section.id)
      }
      await course.save()

      await course.destroy()
      return course.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Course: ${error.message}`)
   }
})



