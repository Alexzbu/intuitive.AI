Parse.Cloud.define('getCourses', async (req) => {
   const query = new Parse.Query('Course');
   try {
      const courseList = await query.find();
      const courses = await Promise.all(
         courseList.map(async (course) => {
            const videosRelation = course.relation('sections')
            const videos = await videosRelation.query().find()
            return {
               objectId: course.id,
               course_name: course.get('name'),
               videos: videos.map(video => ({
                  objectId: video.id,
                  video_name: video.get('video_name'),
                  video_link: video.get('video_link')
               }))
            }
         })
      )
      return courses;
   } catch (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`)
   }
})
Parse.Cloud.define('addCourse', async (req) => {
   const { course_name } = req.params
   const course = new Parse.Object('Course')
   course.set('name', course_name)
   try {
      const savedCourse = await course.save()
      return savedCourse.toJSON()
   } catch (error) {
      console.error('Failed to save Course:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Course')
   }
})
Parse.Cloud.define("upCourse", async (req) => {
   const { id, name } = req.params

   if (!id) {
      throw new Error("Course ID is required.")
   }
   const course = Parse.Object.extend("Course")
   const query = new Parse.Query(course)

   try {
      const course = await query.get(id)

      if (!course) {
         throw new Error("Course not found.")
      }
      course.set("course_name", course_name);

      const updatedCourse = await course.save()
      return updatedCourse.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Course: ${error.message}`)
   }
});

Parse.Cloud.define("delCourse", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Course ID is required.")
   }
   const course = Parse.Object.extend("Course")
   const query = new Parse.Query(course)

   try {
      const course = await query.get(id)
      await course.destroy()
      return course.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Course: ${error.message}`)
   }
});


