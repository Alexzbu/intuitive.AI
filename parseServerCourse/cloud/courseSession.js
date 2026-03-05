Parse.Cloud.define('addCourseSession', async (req) => {
   const { courseId, start_date, end_date, schedule, spots_available, max_spots } = req.params

   if (!courseId) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'courseId is required')
   }

   const coursePtr = Parse.Object.extend('Course').createWithoutData(courseId)
   const session = new Parse.Object('CourseSession')
   session.set('course', coursePtr)
   session.set('start_date', start_date)
   session.set('end_date', end_date)
   session.set('schedule', schedule)
   session.set('spots_available', spots_available ?? null)
   session.set('max_spots', max_spots ?? null)
   session.set('is_active', true)

   try {
      const saved = await session.save(null, { useMasterKey: true })
      return saved.toJSON()
   } catch (error) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to save CourseSession: ${error.message}`)
   }
})

Parse.Cloud.define('getCourseSessionsByCourse', async (req) => {
   const { courseId } = req.params

   if (!courseId) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'courseId is required')
   }

   const coursePtr = Parse.Object.extend('Course').createWithoutData(courseId)
   const query = new Parse.Query('CourseSession')
   query.equalTo('course', coursePtr)
   query.ascending('start_date')

   try {
      const sessions = await query.find({ useMasterKey: true })
      return sessions.map(s => s.toJSON())
   } catch (error) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to fetch sessions: ${error.message}`)
   }
})

Parse.Cloud.define('upCourseSession', async (req) => {
   const { id, start_date, end_date, schedule, spots_available, max_spots, is_active } = req.params

   if (!id) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'id is required')
   }

   const query = new Parse.Query('CourseSession')

   try {
      const session = await query.get(id, { useMasterKey: true })
      if (start_date !== undefined) session.set('start_date', start_date)
      if (end_date !== undefined) session.set('end_date', end_date)
      if (schedule !== undefined) session.set('schedule', schedule)
      if (spots_available !== undefined) session.set('spots_available', spots_available)
      if (max_spots !== undefined) session.set('max_spots', max_spots)
      if (is_active !== undefined) session.set('is_active', is_active)

      const updated = await session.save(null, { useMasterKey: true })
      return updated.toJSON()
   } catch (error) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to update CourseSession: ${error.message}`)
   }
})

Parse.Cloud.define('delCourseSession', async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'id is required')
   }

   const query = new Parse.Query('CourseSession')

   try {
      const session = await query.get(id, { useMasterKey: true })
      const json = session.toJSON()
      await session.destroy({ useMasterKey: true })
      return json
   } catch (error) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to delete CourseSession: ${error.message}`)
   }
})
