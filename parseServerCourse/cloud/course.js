import deleteSectionById from "./deleteSection.js"

Parse.Cloud.define('getCourse', async (req) => {
   const { id } = req.params

   const query = new Parse.Query('Course')

   const course = await query.get(id)

   return course
})

Parse.Cloud.define('getCourses', async (req) => {
   const { name, limit = 6, page = 0 } = req.params
   const query = new Parse.Query('Course')
   if (name) {
      query.equalTo("name", name)
   }
   try {
      const totalCourses = await query.count()

      query.limit(limit).skip(limit * page)
      const courseList = await query.find()
      return { totalCourses, courses: courseList }
   } catch (error) {
      return { error: `Failed to fetch courses: ${error.message}` }
   }
})


Parse.Cloud.define('addCourse', async (req) => {
   const { course, creatorId } = req.params

   const item = new Parse.Object('Course')
   item.set(course)

   if (creatorId) {
      const userPtr = Parse.Object.extend('_User').createWithoutData(creatorId)
      item.set('createdBy', userPtr)
   }

   try {
      const savedCourse = await item.save(null, { useMasterKey: true })
      return savedCourse.toJSON()
   } catch (error) {
      console.error('Failed to save Course:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Course')
   }
})

Parse.Cloud.define('getCoursesByCreator', async (req) => {
   const { creatorId, limit = 6, page = 0 } = req.params

   if (!creatorId) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'creatorId is required')
   }

   const userPtr = Parse.Object.extend('_User').createWithoutData(creatorId)
   const query = new Parse.Query('Course')
   query.equalTo('createdBy', userPtr)

   try {
      const totalCourses = await query.count({ useMasterKey: true })
      query.limit(limit).skip(limit * page)
      const courseList = await query.find({ useMasterKey: true })
      return { totalCourses, courses: courseList }
   } catch (error) {
      return { error: `Failed to fetch courses: ${error.message}` }
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

Parse.Cloud.define('enrollInCourse', async (req) => {
   const { courseId, userId } = req.params
   const course = await new Parse.Query('Course').get(courseId, { useMasterKey: true })
   const userPtr = Parse.Object.extend('_User').createWithoutData(userId)
   course.relation('participants').add(userPtr)
   await course.save(null, { useMasterKey: true })
   return { success: true }
})

Parse.Cloud.define('isEnrolledInCourse', async (req) => {
   const { courseId, userId } = req.params
   const course = await new Parse.Query('Course').get(courseId, { useMasterKey: true })
   const query = course.relation('participants').query()
   query.equalTo('objectId', userId)
   const count = await query.count({ useMasterKey: true })
   return count > 0
})



