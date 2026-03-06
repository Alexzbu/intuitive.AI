import {
   Box, Flex, Heading, Input, Button, Text, Stack, Field
} from "@chakra-ui/react"
import { Sparkles, ChevronRight, Plus, Trash2 } from "lucide-react"
import Chatbot from "@/components/openAI"
import { CourseFormFields } from "@/features/course-form/CourseFormFields"

const AiButton = ({ onClick }) => (
   <Button
      size="sm"
      variant="outline"
      colorPalette="purple"
      flexShrink={0}
      mt="0.5"
      onClick={onClick}
      aria-label="AI assist"
   >
      <Sparkles size={13} />
      AI
   </Button>
)

export function AddCourseForm({
   handleSubmit, errors, isSubmitting, onSubmit,
   fields, handleChange,
   learnItems, onLearnAdd, onLearnUpdate, onLearnRemove,
   thumbnail, thumbnailUploading, handleThumbnailUpload, handleThumbnailUrlChange, clearThumbnail,
   noAI, showAI, setShowAI, inputId, setInputId,
   setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words, setDescription,
   questionsHistory, setQuestionsHistory, resObjectsHistory, setresObjectsHistory,
   search, setSearch, historyResults, showHistoryResults, fillFromHistory,
   router, createdCourseId, sessions, newSession, setNewSession, addingSession, handleAddSession, handleDeleteSession,
}) {
   const openAI = (id) => { setShowAI(true); setInputId(id) }

   return (
      <Box maxW="820px" mx="auto" px="6" py="8">
         {!createdCourseId ? (
            <>
               {/* AI Chatbot Panel */}
               {!noAI && (
                  <Chatbot
                     setTitle={setTitle}
                     setSubtitle={setSubtitle}
                     setObjective={setObjective}
                     setTarget_group={setTarget_group}
                     setRecommendation={setRecommendation}
                     setKey_words={setKey_words}
                     setDescription={setDescription}
                     showAI={showAI}
                     setShowAI={setShowAI}
                     questionsHistory={questionsHistory}
                     setQuestionsHistory={setQuestionsHistory}
                     resObjectsHistory={resObjectsHistory}
                     setresObjectsHistory={setresObjectsHistory}
                     inputId={inputId}
                  />
               )}

               <Heading size="lg" mb="6">Add New Course</Heading>

               {/* AI history search */}
               {!noAI && (
                  <Box position="relative" mb="6">
                     <Input
                        placeholder="Find previous AI suggestions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        bg="white"
                     />
                     {showHistoryResults && (
                        <Box
                           position="absolute"
                           top="100%"
                           left="0"
                           right="0"
                           bg="white"
                           border="1px solid"
                           borderColor="gray.200"
                           borderRadius="md"
                           shadow="md"
                           zIndex="10"
                           maxH="200px"
                           overflowY="auto"
                        >
                           {historyResults.map((item, i) => (
                              <Box
                                 key={item.objectId}
                                 px="4"
                                 py="3"
                                 cursor="pointer"
                                 fontSize="sm"
                                 _hover={{ bg: "gray.50" }}
                                 borderBottom="1px solid"
                                 borderColor="gray.100"
                                 onClick={() => fillFromHistory(i)}
                              >
                                 {item.request}
                              </Box>
                           ))}
                        </Box>
                     )}
                  </Box>
               )}

               <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                  <CourseFormFields
                     fields={fields}
                     onChange={handleChange}
                     nameError={errors.name?.message}
                     thumbnail={thumbnail}
                     thumbnailUploading={thumbnailUploading}
                     onThumbnailUpload={handleThumbnailUpload}
                     onThumbnailUrlChange={handleThumbnailUrlChange}
                     clearThumbnail={clearThumbnail}
                     learnItems={learnItems}
                     onLearnAdd={onLearnAdd}
                     onLearnUpdate={onLearnUpdate}
                     onLearnRemove={onLearnRemove}
                     showKeywords
                     renderFieldAction={noAI ? undefined : (name) => {
                        const aiMap = {
                           name: "title",
                           subtitle: "subtitle",
                           objective: "objective",
                           target_group: "target_group",
                           key_words: "key_words",
                           description: "description",
                           recommendation: "recommendation",
                        }
                        return aiMap[name] ? <AiButton onClick={() => openAI(aiMap[name])} /> : null
                     }}
                  />

                  <Flex justify="flex-end">
                     <Button
                        type="submit"
                        colorPalette="blue"
                        size="lg"
                        loading={isSubmitting}
                        loadingText="Saving..."
                        minW="160px"
                     >
                        Add Course
                        <ChevronRight size={16} />
                     </Button>
                  </Flex>
               </Box>
            </>
         ) : (
            <>
               <Box bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md" p="4" mb="6">
                  <Text fontWeight="semibold" color="green.700">Course created! Now add sessions below, or skip and continue.</Text>
               </Box>

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
                              <Input size="sm" value={newSession.start_date} onChange={e => setNewSession({ ...newSession, start_date: e.target.value })} placeholder="19.1.2026" />
                           </Field.Root>
                        </Box>
                        <Box flex="1" minW="140px">
                           <Field.Root>
                              <Field.Label fontSize="xs">End Date</Field.Label>
                              <Input size="sm" value={newSession.end_date} onChange={e => setNewSession({ ...newSession, end_date: e.target.value })} placeholder="18.5.2026" />
                           </Field.Root>
                        </Box>
                     </Flex>
                     <Flex gap="3" wrap="wrap" mb="3">
                        <Box flex="2" minW="200px">
                           <Field.Root>
                              <Field.Label fontSize="xs">Schedule</Field.Label>
                              <Input size="sm" value={newSession.schedule} onChange={e => setNewSession({ ...newSession, schedule: e.target.value })} placeholder="Montags, 09:00 bis 12:00 Uhr" />
                           </Field.Root>
                        </Box>
                        <Box flex="1" minW="100px">
                           <Field.Root>
                              <Field.Label fontSize="xs">Spots Available</Field.Label>
                              <Input size="sm" type="number" value={newSession.spots_available} onChange={e => setNewSession({ ...newSession, spots_available: e.target.value })} placeholder="20" />
                           </Field.Root>
                        </Box>
                        <Box flex="1" minW="100px">
                           <Field.Root>
                              <Field.Label fontSize="xs">Max Spots</Field.Label>
                              <Input size="sm" type="number" value={newSession.max_spots} onChange={e => setNewSession({ ...newSession, max_spots: e.target.value })} placeholder="20" />
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

               <Flex justify="flex-end">
                  <Button
                     colorPalette="blue"
                     size="lg"
                     minW="180px"
                     onClick={() => router.push(`/add-section?id=${createdCourseId}`)}
                  >
                     Continue to Sections
                     <ChevronRight size={16} />
                  </Button>
               </Flex>
            </>
         )}
      </Box>
   )
}
