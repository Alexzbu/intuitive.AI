Parse.Cloud.define('getEditorDoc', async (req) => {
  const { courseId } = req.params
  const query = new Parse.Query('EditorDocument')
  query.equalTo('courseId', courseId)
  const doc = await query.first({ useMasterKey: true })
  if (!doc) return null
  return doc.toJSON()
})

Parse.Cloud.define('saveEditorDoc', async (req) => {
  const { courseId, content } = req.params
  const query = new Parse.Query('EditorDocument')
  query.equalTo('courseId', courseId)
  let doc = await query.first({ useMasterKey: true })
  if (!doc) {
    const EditorDocument = Parse.Object.extend('EditorDocument')
    doc = new EditorDocument()
    doc.set('courseId', courseId)
  }
  doc.set('content', content)
  await doc.save(null, { useMasterKey: true })
  return doc.toJSON()
})
