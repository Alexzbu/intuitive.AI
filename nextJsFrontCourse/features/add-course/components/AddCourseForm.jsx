import {
   Box, Flex, Grid, Heading, Input, Textarea, Button, Text, Field, Stack
} from "@chakra-ui/react"
import { Sparkles, Upload, Trash2, ChevronRight } from "lucide-react"
import Chatbot from "@/components/openAI"
import { DynamicList } from "./DynamicList"

const SectionCard = ({ title, children }) => (
   <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" p="6" mb="5">
      {title && (
         <Heading size="sm" color="gray.500" mb="4">{title}</Heading>
      )}
      {children}
   </Box>
)

const AiFieldRow = ({ label, children, onAI, noAI }) => (
   <Field.Root mb="4">
      <Field.Label fontWeight="medium" fontSize="sm">{label}</Field.Label>
      <Flex gap="2" align="flex-start">
         <Box flex="1">{children}</Box>
         {!noAI && (
            <Button
               size="sm"
               variant="outline"
               colorPalette="purple"
               flexShrink={0}
               mt="0.5"
               onClick={onAI}
               aria-label="AI assist"
            >
               <Sparkles size={13} />
               AI
            </Button>
         )}
      </Flex>
   </Field.Root>
)

export function AddCourseForm({
   register, handleSubmit, errors, isSubmitting, onSubmit,
   learnFields, appendLearn, removeLearn,
   thumbnail, thumbnailUploading, handleThumbnailUpload, handleThumbnailUrlChange, clearThumbnail,
   noAI, showAI, setShowAI, inputId, setInputId,
   setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words, setDescription,
   questionsHistory, setQuestionsHistory, resObjectsHistory, setresObjectsHistory,
   search, setSearch, historyResults, showHistoryResults, fillFromHistory,
}) {
   const openAI = (id) => { setShowAI(true); setInputId(id) }

   return (
      <Box maxW="820px" mx="auto" px="6" py="8">
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
            {/* Basic Information */}
            <SectionCard title="Basic Information">
               <AiFieldRow label="Course Name *" onAI={() => openAI("title")} noAI={noAI}>
                  <Input {...register("name")} placeholder="e.g. Data Analyst (IHK)" />
                  {errors.name && <Text fontSize="xs" color="red.500" mt="1">{errors.name.message}</Text>}
               </AiFieldRow>

               <AiFieldRow label="Subtitle" onAI={() => openAI("subtitle")} noAI={noAI}>
                  <Input {...register("subtitle")} placeholder="Short tagline" />
               </AiFieldRow>

               <AiFieldRow label="Objective" onAI={() => openAI("objective")} noAI={noAI}>
                  <Input {...register("objective")} placeholder="Main learning goal" />
               </AiFieldRow>

               <AiFieldRow label="Target Group" onAI={() => openAI("target_group")} noAI={noAI}>
                  <Input {...register("target_group")} placeholder="Who is this course for?" />
               </AiFieldRow>

               <AiFieldRow label="Keywords" onAI={() => openAI("key_words")} noAI={noAI}>
                  <Input {...register("key_words.0")} placeholder="e.g. data, analytics, python" />
               </AiFieldRow>
            </SectionCard>

            {/* Course Content */}
            <SectionCard title="Course Content">
               <AiFieldRow label="Description" onAI={() => openAI("description")} noAI={noAI}>
                  <Textarea {...register("description")} rows={4} placeholder="Describe the course..." />
               </AiFieldRow>

               <Field.Root mb="0">
                  <Field.Label fontWeight="medium" fontSize="sm">Contents Overview</Field.Label>
                  <Textarea
                     {...register("contents")}
                     rows={3}
                     placeholder="Modules, structure, what's included..."
                  />
               </Field.Root>
            </SectionCard>

            {/* Course Details */}
            <SectionCard title="Course Details">
               <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="4" mb="4">
                  <Field.Root>
                     <Field.Label fontSize="sm">Duration</Field.Label>
                     <Input {...register("duration_hours")} placeholder="e.g. 83 hours" />
                  </Field.Root>
                  <Field.Root>
                     <Field.Label fontSize="sm">Location</Field.Label>
                     <Input {...register("location")} placeholder="Virtual" />
                  </Field.Root>
                  <Field.Root>
                     <Field.Label fontSize="sm">Price</Field.Label>
                     <Input {...register("price")} placeholder="e.g. 2.390,00 €" />
                  </Field.Root>
                  <Field.Root>
                     <Field.Label fontSize="sm">Registration Deadline</Field.Label>
                     <Input {...register("registration_deadline")} placeholder="e.g. 18. Jan. 2026" />
                  </Field.Root>
               </Grid>

               <AiFieldRow label="Technical Requirements / Recommendation" onAI={() => openAI("recommendation")} noAI={noAI}>
                  <Textarea {...register("recommendation")} rows={3} placeholder="PC, internet connection..." />
               </AiFieldRow>
            </SectionCard>

            {/* Thumbnail */}
            <SectionCard title="Course Thumbnail">
               {thumbnail && (
                  <Box mb="3">
                     <Box
                        as="img"
                        src={thumbnail}
                        alt="Thumbnail preview"
                        maxH="160px"
                        borderRadius="md"
                        objectFit="cover"
                     />
                  </Box>
               )}
               <Flex align="center" gap="3" mb="3">
                  <Button
                     as="label"
                     htmlFor="thumbnail-upload"
                     variant="outline"
                     size="sm"
                     cursor="pointer"
                     loading={thumbnailUploading}
                     loadingText="Uploading..."
                  >
                     <Upload size={14} />
                     {thumbnail ? "Replace Image" : "Upload Image"}
                  </Button>
                  <input
                     id="thumbnail-upload"
                     type="file"
                     accept="image/*"
                     style={{ display: "none" }}
                     onChange={handleThumbnailUpload}
                  />
                  {thumbnail && (
                     <Button variant="ghost" size="sm" color="red.500" onClick={clearThumbnail}>
                        <Trash2 size={14} />
                        Remove
                     </Button>
                  )}
               </Flex>
               <Text fontSize="xs" color="gray.400" mb="1">Or paste an image URL:</Text>
               <Input
                  size="sm"
                  value={thumbnail}
                  onChange={handleThumbnailUrlChange}
                  placeholder="https://..."
               />
            </SectionCard>

            {/* Learning Outcomes */}
            <SectionCard title="Learning Outcomes">
               <Field.Root mb="4">
                  <Field.Label fontWeight="medium" fontSize="sm">What students will learn</Field.Label>
                  <DynamicList
                     fields={learnFields}
                     onAppend={appendLearn}
                     onRemove={removeLearn}
                     register={register}
                     placeholder="Learning outcome"
                  />
               </Field.Root>

               <Field.Root>
                  <Field.Label fontWeight="medium" fontSize="sm">Further Information</Field.Label>
                  <Textarea
                     {...register("further_information")}
                     rows={4}
                     placeholder="Certificate info, requirements, etc."
                  />
               </Field.Root>
            </SectionCard>

            {/* Submit */}
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
      </Box>
   )
}
