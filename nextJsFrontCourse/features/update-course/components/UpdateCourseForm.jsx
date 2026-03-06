import {
   Box, Flex, Heading, Input, Button, Text, Field, Stack
} from "@chakra-ui/react"
import { Plus, Trash2 } from "lucide-react"
import { CourseFormFields } from "@/features/course-form/CourseFormFields"

export function UpdateCourseForm({
   courseId,
   router,
   fields,
   handleChange,
   thumbnail,
   thumbnailUploading,
   handleThumbnailUpload,
   handleThumbnailUrlChange,
   clearThumbnail,
   learnItems,
   onLearnAdd,
   onLearnUpdate,
   onLearnRemove,
   saving,
   saveSuccess,
   handleSave,
   sessions,
   newSession,
   setNewSession,
   addingSession,
   handleAddSession,
   handleDeleteSession,
}) {
   return (
      <Box maxW="800px" mx="auto" px="6" py="8">
         <Heading size="lg" mb="6">Update Course</Heading>

         <CourseFormFields
            fields={fields}
            onChange={handleChange}
            thumbnail={thumbnail}
            thumbnailUploading={thumbnailUploading}
            onThumbnailUpload={handleThumbnailUpload}
            onThumbnailUrlChange={handleThumbnailUrlChange}
            clearThumbnail={clearThumbnail}
            learnItems={learnItems}
            onLearnAdd={onLearnAdd}
            onLearnUpdate={onLearnUpdate}
            onLearnRemove={onLearnRemove}
         />

         {/* Sessions */}
         <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" p="6" mb="6">
            <Heading size="sm" mb="4" color="gray.600">Course Sessions</Heading>

            {sessions.length > 0 && (
               <Stack gap="2" mb="4">
                  {sessions.map(s => (
                     <Flex
                        key={s.objectId}
                        align="center"
                        justify="space-between"
                        p="3"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        bg="gray.50"
                     >
                        <Box>
                           <Text fontSize="sm" fontWeight="medium">{s.start_date} – {s.end_date}</Text>
                           {s.schedule && <Text fontSize="xs" color="gray.500">{s.schedule}</Text>}
                           {s.spots_available != null && (
                              <Text fontSize="xs" color="teal.600">{s.spots_available} spots available</Text>
                           )}
                        </Box>
                        <Button size="xs" variant="ghost" color="red.500" onClick={() => handleDeleteSession(s.objectId)}>
                           <Trash2 size={14} />
                        </Button>
                     </Flex>
                  ))}
               </Stack>
            )}

            <Box border="1px dashed" borderColor="gray.300" borderRadius="md" p="4">
               <Text fontSize="sm" fontWeight="medium" mb="3" color="gray.600">Add New Session</Text>
               <Flex gap="3" wrap="wrap" mb="3">
                  <Box flex="1" minW="140px">
                     <Field.Root>
                        <Field.Label fontSize="xs">Start Date</Field.Label>
                        <Input
                           size="sm"
                           value={newSession.start_date}
                           onChange={e => setNewSession({ ...newSession, start_date: e.target.value })}
                           placeholder="19.1.2026"
                        />
                     </Field.Root>
                  </Box>
                  <Box flex="1" minW="140px">
                     <Field.Root>
                        <Field.Label fontSize="xs">End Date</Field.Label>
                        <Input
                           size="sm"
                           value={newSession.end_date}
                           onChange={e => setNewSession({ ...newSession, end_date: e.target.value })}
                           placeholder="18.5.2026"
                        />
                     </Field.Root>
                  </Box>
               </Flex>
               <Flex gap="3" wrap="wrap" mb="3">
                  <Box flex="2" minW="200px">
                     <Field.Root>
                        <Field.Label fontSize="xs">Schedule</Field.Label>
                        <Input
                           size="sm"
                           value={newSession.schedule}
                           onChange={e => setNewSession({ ...newSession, schedule: e.target.value })}
                           placeholder="Montags, 09:00 bis 12:00 Uhr"
                        />
                     </Field.Root>
                  </Box>
                  <Box flex="1" minW="100px">
                     <Field.Root>
                        <Field.Label fontSize="xs">Spots Available</Field.Label>
                        <Input
                           size="sm"
                           type="number"
                           value={newSession.spots_available}
                           onChange={e => setNewSession({ ...newSession, spots_available: e.target.value })}
                           placeholder="20"
                        />
                     </Field.Root>
                  </Box>
                  <Box flex="1" minW="100px">
                     <Field.Root>
                        <Field.Label fontSize="xs">Max Spots</Field.Label>
                        <Input
                           size="sm"
                           type="number"
                           value={newSession.max_spots}
                           onChange={e => setNewSession({ ...newSession, max_spots: e.target.value })}
                           placeholder="20"
                        />
                     </Field.Root>
                  </Box>
               </Flex>
               <Button
                  size="sm"
                  colorPalette="blue"
                  onClick={handleAddSession}
                  loading={addingSession}
                  loadingText="Adding..."
                  disabled={!newSession.start_date || !newSession.end_date}
               >
                  <Plus size={14} />
                  Add Session
               </Button>
            </Box>
         </Box>

         {/* Action buttons */}
         <Flex gap="3" justify="flex-end" wrap="wrap">
            <Button variant="outline" onClick={() => router.push(`/update-sections?id=${courseId}`)}>
               Edit Sections
            </Button>
            <Button
               colorPalette={saveSuccess ? "green" : "blue"}
               onClick={handleSave}
               loading={saving}
               loadingText="Saving..."
               minW="120px"
            >
               {saveSuccess ? "Saved!" : "Save Changes"}
            </Button>
         </Flex>
      </Box>
   )
}
