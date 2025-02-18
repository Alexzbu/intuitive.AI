Parse.Cloud.define('getVideos', async (req) => {
   const query = new Parse.Query('Video')

   try {
      const videoList = await query.find()
      return videoList.map(video => ({
         objectId: video.id,
         video_name: video.get('video_name'),
         video_link: video.get('video_link')
      }))
   } catch (error) {
      throw new Error(`Failed to fetch videos: ${error.message}`)
   }
})
Parse.Cloud.define('addVideo', async (req) => {
   const { id, video_name, video_link } = req.params
   const query = new Parse.Query('Section')
   const video = new Parse.Object('Video')
   try {
      const section = await query.get(id)
      video.set('video_name', video_name)
      video.set('video_link', video_link)
      const savedVideo = await video.save()
      const videoRelation = section.relation('videos')
      videoRelation.add(savedVideo)
      await section.save()
      return savedVideo.toJSON()
   } catch (error) {
      console.error('Failed to save Video:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Video')
   }
})
Parse.Cloud.define("upVideo", async (req) => {
   const { id, video_name } = req.params

   if (!id) {
      throw new Error("Video ID is required.")
   }
   const video = Parse.Object.extend("Video")
   const query = new Parse.Query(video)

   try {
      const video = await query.get(id)

      if (!video) {
         throw new Error("Video not found.")
      }
      video.set("video_name", video_name);

      const updatedVideo = await video.save()
      return updatedVideo.toJSON()
   } catch (error) {
      throw new Error(`Failed to update Video: ${error.message}`)
   }
});

Parse.Cloud.define("delVideo", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Video ID is required.")
   }
   const video = Parse.Object.extend("Video")
   const query = new Parse.Query(video)

   try {
      const video = await query.get(id)
      await video.destroy()
      return video.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete Video: ${error.message}`)
   }
});


