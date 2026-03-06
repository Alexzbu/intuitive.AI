import {
   Box, Flex, Heading, Input, Textarea, Button, Text, Field, Stack
} from "@chakra-ui/react"
import { Upload, Trash2, Plus } from "lucide-react"

const SectionCard = ({ title, children }) => (
   <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" p="6" mb="5">
      {title && <Heading size="sm" color="gray.500" mb="4">{title}</Heading>}
      {children}
   </Box>
)

const FieldRow = ({ label, children, action }) => (
   <Field.Root mb="4">
      <Field.Label fontWeight="medium" fontSize="sm">{label}</Field.Label>
      {action ? (
         <Flex gap="2" align="flex-start">
            <Box flex="1">{children}</Box>
            {action}
         </Flex>
      ) : children}
   </Field.Root>
)

export function CourseFormFields({
   fields = {},
   onChange,
   nameError,
   thumbnail,
   thumbnailUploading,
   onThumbnailUpload,
   onThumbnailUrlChange,
   clearThumbnail,
   learnItems = [],
   onLearnAdd,
   onLearnUpdate,
   onLearnRemove,
   showKeywords = false,
   renderFieldAction,
}) {
   const act = (name) => renderFieldAction?.(name) ?? null

   return (
      <>
         {/* Basic Information */}
         <SectionCard title="Basic Information">
            <FieldRow label="Course Name *" action={act("name")}>
               <Input
                  value={fields.name ?? ""}
                  onChange={e => onChange("name", e.target.value)}
                  placeholder="e.g. Data Analyst (IHK)"
               />
               {nameError && <Text fontSize="xs" color="red.500" mt="1">{nameError}</Text>}
            </FieldRow>

            <FieldRow label="Subtitle" action={act("subtitle")}>
               <Input
                  value={fields.subtitle ?? ""}
                  onChange={e => onChange("subtitle", e.target.value)}
                  placeholder="Short tagline"
               />
            </FieldRow>

            <FieldRow label="Objective" action={act("objective")}>
               <Input
                  value={fields.objective ?? ""}
                  onChange={e => onChange("objective", e.target.value)}
                  placeholder="Main learning goal"
               />
            </FieldRow>

            <FieldRow label="Target Group" action={act("target_group")}>
               <Input
                  value={fields.target_group ?? ""}
                  onChange={e => onChange("target_group", e.target.value)}
                  placeholder="Who is this course for?"
               />
            </FieldRow>

            {showKeywords && (
               <FieldRow label="Keywords" action={act("key_words")}>
                  <Input
                     value={fields.key_words ?? ""}
                     onChange={e => onChange("key_words", e.target.value)}
                     placeholder="e.g. data, analytics, python"
                  />
               </FieldRow>
            )}

            <FieldRow label="Description" action={act("description")}>
               <Textarea
                  value={fields.description ?? ""}
                  onChange={e => onChange("description", e.target.value)}
                  rows={4}
                  placeholder="Describe the course..."
               />
            </FieldRow>
         </SectionCard>

         {/* Course Details */}
         <SectionCard title="Course Details">
            <Flex gap="4" mb="4" wrap="wrap">
               <Box flex="1" minW="160px">
                  <Field.Root>
                     <Field.Label fontSize="sm">Duration</Field.Label>
                     <Input
                        value={fields.duration_hours ?? ""}
                        onChange={e => onChange("duration_hours", e.target.value)}
                        placeholder="e.g. 83 hours"
                     />
                  </Field.Root>
               </Box>
               <Box flex="1" minW="160px">
                  <Field.Root>
                     <Field.Label fontSize="sm">Location</Field.Label>
                     <Input
                        value={fields.location ?? ""}
                        onChange={e => onChange("location", e.target.value)}
                        placeholder="Virtual"
                     />
                  </Field.Root>
               </Box>
               <Box flex="1" minW="160px">
                  <Field.Root>
                     <Field.Label fontSize="sm">Price</Field.Label>
                     <Input
                        value={fields.price ?? ""}
                        onChange={e => onChange("price", e.target.value)}
                        placeholder="e.g. 2.390,00 €"
                     />
                  </Field.Root>
               </Box>
            </Flex>

            <FieldRow label="Registration Deadline">
               <Input
                  value={fields.registration_deadline ?? ""}
                  onChange={e => onChange("registration_deadline", e.target.value)}
                  placeholder="e.g. 18. Jan. 2026"
               />
            </FieldRow>

            <FieldRow label="Contents Overview">
               <Textarea
                  value={fields.contents ?? ""}
                  onChange={e => onChange("contents", e.target.value)}
                  rows={3}
                  placeholder="Modules, structure, what's included..."
               />
            </FieldRow>

            <FieldRow label="Technical Requirements / Recommendation" action={act("recommendation")}>
               <Textarea
                  value={fields.recommendation ?? ""}
                  onChange={e => onChange("recommendation", e.target.value)}
                  rows={3}
                  placeholder="PC, internet connection..."
               />
            </FieldRow>
         </SectionCard>

         {/* Thumbnail */}
         <SectionCard title="Course Thumbnail">
            {thumbnail && (
               <Box mb="3">
                  <Box as="img" src={thumbnail} alt="Thumbnail preview" maxH="160px" borderRadius="md" objectFit="cover" />
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
                  onChange={onThumbnailUpload}
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
               value={thumbnail ?? ""}
               onChange={onThumbnailUrlChange}
               placeholder="https://..."
            />
         </SectionCard>

         {/* Learning Outcomes */}
         <SectionCard title="Learning Outcomes">
            <Field.Root mb="4">
               <Field.Label fontWeight="medium" fontSize="sm">What students will learn</Field.Label>
               <Stack gap="2" mt="1">
                  {learnItems.map((item, i) => (
                     <Flex key={i} gap="2" align="center">
                        <Input
                           size="sm"
                           value={item}
                           onChange={e => onLearnUpdate(i, e.target.value)}
                           placeholder={`Learning outcome ${i + 1}`}
                        />
                        <Button size="sm" variant="ghost" color="red.500" onClick={() => onLearnRemove(i)}>
                           <Trash2 size={14} />
                        </Button>
                     </Flex>
                  ))}
               </Stack>
               <Button size="sm" variant="outline" mt="2" onClick={onLearnAdd}>
                  <Plus size={14} />
                  Add Item
               </Button>
            </Field.Root>

            <Field.Root>
               <Field.Label fontWeight="medium" fontSize="sm">Further Information</Field.Label>
               <Textarea
                  value={fields.further_information ?? ""}
                  onChange={e => onChange("further_information", e.target.value)}
                  rows={4}
                  placeholder="Certificate info, requirements, etc."
               />
            </Field.Root>
         </SectionCard>
      </>
   )
}
