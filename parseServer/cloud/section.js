Parse.Cloud.define('getSections', async (req) => {
   const query = new Parse.Query('Section');
   try {
      const sectionList = await query.find();
      const sections = await Promise.all(
         sectionList.map(async (section) => {
            const videosRelation = section.relation('videos')
            const videos = await videosRelation.query().find()
            return {
               objectId: section.id,
               section_name: section.get('section_name'),
               videos: videos.map(video => ({
                  objectId: video.id,
                  video_name: video.get('video_name'),
                  video_link: video.get('video_link')
               }))
            }
         })
      )
      return sections;
   } catch (error) {
      throw new Error(`Failed to fetch sections: ${error.message}`)
   }
})
Parse.Cloud.define('addSection', async (req) => {
   const { section_name } = req.params
   const section = new Parse.Object('Section')
   section.set('section_name', section_name)
   try {
      const savedSection = await section.save()
      return savedSection.toJSON()
   } catch (error) {
      console.error('Failed to save Section:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Section')
   }
})
Parse.Cloud.define("upSection", async (req) => {
   const { id, section_name } = req.params

   if (!id) {
      throw new Error("Section ID is required.")
   }
   const section = Parse.Object.extend("Section")
   const query = new Parse.Query(section)

   try {
      const section = await query.get(id)

      if (!section) {
         throw new Error("Section not found.")
      }
      section.set("section_name", section_name);

      const updatedSection = await section.save()
      return updatedSection.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Section: ${error.message}`)
   }
});

Parse.Cloud.define("delSection", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Section ID is required.")
   }
   const section = Parse.Object.extend("Section")
   const query = new Parse.Query(section)

   try {
      const section = await query.get(id)
      await section.destroy()
      return section.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Section: ${error.message}`)
   }
});


