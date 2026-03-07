"use client"

import { useState, useEffect, useRef, useCallback } from "react"

let blockSuiteEffectsRegistered = false
import { useMutation, useLazyQuery } from "@apollo/client"
import apolloClient from "@/utils/apolloClient"
import { GET_EDITOR_DOC, SAVE_EDITOR_DOC } from "../api/editorQueries"

export function useBlockSuiteEditor(courseId) {
  const containerRef = useRef(null)
  const docRef = useRef(null)
  const collectionRef = useRef(null)
  const saveTimerRef = useRef(null)

  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [getEditorDoc] = useLazyQuery(GET_EDITOR_DOC, { client: apolloClient })
  const [saveEditorDoc] = useMutation(SAVE_EDITOR_DOC, { client: apolloClient })

  const save = useCallback(async () => {
    if (!docRef.current || !collectionRef.current) return
    setSaving(true)
    try {
      const { Job } = await import("@blocksuite/store")
      const job = new Job({ collection: collectionRef.current })
      const snapshot = await job.docToSnapshot(docRef.current)
      await saveEditorDoc({
        variables: { courseId, content: JSON.stringify(snapshot) },
      })
    } catch (err) {
      console.error("BlockSuite save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [courseId, saveEditorDoc])

  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(save, 3000)
  }, [save])

  useEffect(() => {
    if (!courseId || !containerRef.current) return

    let mounted = true
    let editor = null

    async function init() {
      try {
        const { AffineSchemas } = await import("@blocksuite/blocks")
        const { Schema, DocCollection, Job, Text } = await import("@blocksuite/store")

        // BlockSuite separates type exports from element registration.
        // Both packages have sideEffects:false, so effects() must be called explicitly.
        // Use a module-level flag to guard against React StrictMode double-invocation.
        if (!blockSuiteEffectsRegistered) {
          blockSuiteEffectsRegistered = true
          const { effects: blocksEffects } = await import("@blocksuite/blocks/effects")
          const { effects: presetsEffects } = await import("@blocksuite/presets/effects")
          blocksEffects()
          presetsEffects()
        }

        const schema = new Schema().register(AffineSchemas)
        const collection = new DocCollection({ schema })
        collection.meta.initialize()
        collectionRef.current = collection

        // Try loading existing snapshot
        const { data } = await getEditorDoc({ variables: { courseId } })
        const savedContent = data?.getEditorDoc?.content

        let doc
        if (savedContent) {
          const job = new Job({ collection })
          doc = await job.snapshotToDoc(JSON.parse(savedContent))
        } else {
          doc = collection.createDoc()
          await doc.load(() => {
            const pageBlockId = doc.addBlock("affine:page", {
              title: new Text("Course Notes"),
            })
            doc.addBlock("affine:surface", {}, pageBlockId)
            const noteId = doc.addBlock("affine:note", {}, pageBlockId)
            doc.addBlock("affine:paragraph", {}, noteId)
          })
        }

        docRef.current = doc

        // Auto-save on changes
        doc.slots.blockUpdated.on(scheduleSave)

        if (!mounted) return

        // Use document.createElement instead of new — Lit registers the custom
        // element as a side effect of import, so the tag is always available.
        editor = document.createElement("affine-editor-container")
        editor.doc = doc
        editor.style.cssText = "width:100%;height:100%;display:block;"
        containerRef.current.appendChild(editor)
        setInitialized(true)
      } catch (err) {
        console.error("BlockSuite init failed:", err)
        if (mounted) setError(err.message)
      }
    }

    init()

    return () => {
      mounted = false
      clearTimeout(saveTimerRef.current)
      if (editor && containerRef.current?.contains(editor)) {
        containerRef.current.removeChild(editor)
      }
    }
  }, [courseId])

  return { containerRef, save, saving, initialized, error }
}
