"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter, useSearchParams } from "next/navigation"
import Loading from '@/components/Loading'
import {
   Box, Flex, Text, Heading, Button, Input, Textarea,
   Field, Stack
} from "@chakra-ui/react"
import { Plus, Trash2, Upload } from "lucide-react"

const UP_COURSE_MUTATION = gql`
   mutation upCourse(
      $id: ID!, $name: String!, $subtitle: String, $objective: String,
      $target_group: String, $description: String, $recommendation: String,
      $contents: String, $duration_hours: String, $location: String, $price: String,
      $registration_deadline: String, $what_you_learn: [String],
      $further_information: String, $thumbnail: String
   ) {
      upCourse(
         id: $id, name: $name, subtitle: $subtitle, objective: $objective,
         target_group: $target_group, description: $description, recommendation: $recommendation,
         contents: $contents, duration_hours: $duration_hours, location: $location, price: $price,
         registration_deadline: $registration_deadline, what_you_learn: $what_you_learn,
         further_information: $further_information, thumbnail: $thumbnail
      ) {
         objectId
         name
      }
   }`

const GET_SESSIONS_QUERY = gql`
   query getCourseSessionsByCourse($courseId: ID!) {
      getCourseSessionsByCourse(courseId: $courseId) {
         objectId
         start_date
         end_date
         schedule
         spots_available
         max_spots
         is_active
      }
   }`

const ADD_SESSION_MUTATION = gql`
   mutation addCourseSession($courseId: ID!, $start_date: String, $end_date: String, $schedule: String, $spots_available: Int, $max_spots: Int) {
      addCourseSession(courseId: $courseId, start_date: $start_date, end_date: $end_date, schedule: $schedule, spots_available: $spots_available, max_spots: $max_spots) {
         objectId
      }
   }`

const DEL_SESSION_MUTATION = gql`
   mutation delCourseSession($id: ID!) {
      delCourseSession(id: $id) {
         objectId
      }
   }`

const FormField = ({ label, children }) => (
   <Field.Root mb="4">
      <Field.Label fontWeight="medium" fontSize="sm">{label}</Field.Label>
      {children}
   </Field.Root>
)

const UpdateCourseContent = () => {
   const router = useRouter()
   const searchParams = useSearchParams()
   const courseId = searchParams.get("id")

   // Course fields
   const [title, setTitle] = useState('')
   const [subtitle, setSubtitle] = useState('')
   const [objective, setObjective] = useState('')
   const [target_group, setTarget_group] = useState('')
   const [description, setDescription] = useState('')
   const [recommendation, setRecommendation] = useState('')
   const [contents, setContents] = useState('')
   const [duration_hours, setDurationHours] = useState('')
   const [location, setLocation] = useState('')
   const [price, setPrice] = useState('')
   const [registration_deadline, setRegistrationDeadline] = useState('')
   const [what_you_learn, setWhatYouLearn] = useState([])
   const [further_information, setFurtherInformation] = useState('')
   const [thumbnail, setThumbnail] = useState('')
   const [thumbnailUploading, setThumbnailUploading] = useState(false)
   const [saveSuccess, setSaveSuccess] = useState(false)

   // New session form
   const [newSession, setNewSession] = useState({
      start_date: '', end_date: '', schedule: '', spots_available: '', max_spots: ''
   })

   const [loading, setLoading] = useState(false)

   const fetchCourse = useCallback(async () => {
      if (!courseId) return
      setLoading(true)
      try {
         const res = await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/parse/classes/Course/${courseId}`,
            { headers: {
               'X-Parse-Application-Id': process.env.NEXT_PUBLIC_PARSE_APP_ID,
               'X-Parse-Master-Key': process.env.NEXT_PUBLIC_PARSE_MASTER_KEY,
            }}
         )
         const c = await res.json()
         setTitle(c.name ?? '')
         setSubtitle(c.subtitle ?? '')
         setObjective(c.objective ?? '')
         setTarget_group(c.target_group ?? '')
         setDescription(c.description ?? '')
         setRecommendation(c.recommendation ?? '')
         setContents(c.contents ?? '')
         setDurationHours(c.duration_hours ?? '')
         setLocation(c.location ?? '')
         setPrice(c.price ?? '')
         setRegistrationDeadline(c.registration_deadline ?? '')
         setWhatYouLearn(c.what_you_learn ?? [])
         setFurtherInformation(c.further_information ?? '')
         setThumbnail(c.thumbnail ?? '')
      } catch (err) {
         console.error('Failed to fetch course:', err)
      } finally {
         setLoading(false)
      }
   }, [courseId])

   useEffect(() => { fetchCourse() }, [fetchCourse])

   const { data: sessionsData, refetch: refetchSessions } = useQuery(GET_SESSIONS_QUERY, {
      client,
      variables: { courseId },
      skip: !courseId,
   })

   const [upCourse, { loading: saving }] = useMutation(UP_COURSE_MUTATION, { client })
   const [addCourseSession, { loading: addingSession }] = useMutation(ADD_SESSION_MUTATION, { client })
   const [delCourseSession] = useMutation(DEL_SESSION_MUTATION, { client })

   const handleThumbnailUpload = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setThumbnailUploading(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
         setThumbnail(reader.result)
         setThumbnailUploading(false)
      }
      reader.onerror = () => {
         console.error('Image read failed')
         setThumbnailUploading(false)
      }
   }

   const handleSave = async () => {
      try {
         await upCourse({
            variables: {
               id: courseId,
               name: title,
               subtitle,
               objective,
               target_group,
               description,
               recommendation,
               contents,
               duration_hours,
               location,
               price,
               registration_deadline,
               what_you_learn,
               further_information,
               thumbnail,
            },
         })
         setSaveSuccess(true)
         setTimeout(() => setSaveSuccess(false), 3000)
      } catch (error) {
         console.error('Error updating course:', error)
      }
   }

   const addLearnItem = () => setWhatYouLearn([...what_you_learn, ''])
   const updateLearnItem = (i, val) => {
      const arr = [...what_you_learn]
      arr[i] = val
      setWhatYouLearn(arr)
   }
   const removeLearnItem = (i) => setWhatYouLearn(what_you_learn.filter((_, idx) => idx !== i))

   const handleAddSession = async () => {
      try {
         await addCourseSession({
            variables: {
               courseId,
               start_date: newSession.start_date,
               end_date: newSession.end_date,
               schedule: newSession.schedule,
               spots_available: newSession.spots_available ? parseInt(newSession.spots_available) : null,
               max_spots: newSession.max_spots ? parseInt(newSession.max_spots) : null,
            }
         })
         setNewSession({ start_date: '', end_date: '', schedule: '', spots_available: '', max_spots: '' })
         refetchSessions()
      } catch (err) {
         console.error('Failed to add session:', err)
      }
   }

   const handleDeleteSession = async (id) => {
      try {
         await delCourseSession({ variables: { id } })
         refetchSessions()
      } catch (err) {
         console.error('Failed to delete session:', err)
      }
   }

   const sessions = sessionsData?.getCourseSessionsByCourse || []

   if (loading) return <Loading />

   return (
      <Box maxW="800px" mx="auto" px="6" py="8">
         <Heading size="lg" mb="6">Update Course</Heading>

         {/* Basic Info */}
         <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" p="6" mb="6">
            <Heading size="sm" mb="4" color="gray.600">Basic Information</Heading>

            <FormField label="Course Name">
               <Input value={title ?? ''} onChange={e => setTitle(e.target.value)} />
            </FormField>

            <FormField label="Subtitle">
               <Input value={subtitle ?? ''} onChange={e => setSubtitle(e.target.value)} />
            </FormField>

            <FormField label="Objective">
               <Input value={objective ?? ''} onChange={e => setObjective(e.target.value)} />
            </FormField>

            <FormField label="Target Group">
               <Input value={target_group ?? ''} onChange={e => setTarget_group(e.target.value)} />
            </FormField>

            <FormField label="Description">
               <Textarea value={description ?? ''} onChange={e => setDescription(e.target.value)} rows={4} />
            </FormField>
         </Box>

         {/* Course Details */}
         <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" p="6" mb="6">
            <Heading size="sm" mb="4" color="gray.600">Course Details</Heading>

            <Flex gap="4" mb="4" wrap="wrap">
               <Box flex="1" minW="160px">
                  <FormField label="Duration (e.g. 83 hours)">
                     <Input value={duration_hours} onChange={e => setDurationHours(e.target.value)} placeholder="83 hours" />
                  </FormField>
               </Box>
               <Box flex="1" minW="160px">
                  <FormField label="Location">
                     <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Virtual" />
                  </FormField>
               </Box>
               <Box flex="1" minW="160px">
                  <FormField label="Price">
                     <Input value={price} onChange={e => setPrice(e.target.value)} placeholder="2.390,00 €" />
                  </FormField>
               </Box>
            </Flex>

            <FormField label="Registration Deadline">
               <Input value={registration_deadline} onChange={e => setRegistrationDeadline(e.target.value)} placeholder="18. Jan. 2026" />
            </FormField>

            <FormField label="Contents Overview">
               <Textarea value={contents} onChange={e => setContents(e.target.value)} rows={3} placeholder="Describe what the course contains..." />
            </FormField>

            <FormField label="Technical Requirements / Recommendation">
               <Textarea value={recommendation} onChange={e => setRecommendation(e.target.value)} rows={3} />
            </FormField>
         </Box>

         {/* Thumbnail */}
         <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" p="6" mb="6">
            <Heading size="sm" mb="4" color="gray.600">Course Thumbnail</Heading>

            {thumbnail && (
               <Box mb="3">
                  <Box as="img" src={thumbnail} alt="Thumbnail" maxH="150px" borderRadius="md" objectFit="cover" />
               </Box>
            )}

            <Flex align="center" gap="3">
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
                  {thumbnail ? 'Replace Image' : 'Upload Image'}
               </Button>
               <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleThumbnailUpload}
               />
               {thumbnail && (
                  <Button variant="ghost" size="sm" color="red.500" onClick={() => setThumbnail('')}>
                     Remove
                  </Button>
               )}
            </Flex>
            <Text fontSize="xs" color="gray.400" mt="2">Or paste an image URL:</Text>
            <Input
               mt="1"
               size="sm"
               value={thumbnail}
               onChange={e => setThumbnail(e.target.value)}
               placeholder="https://..."
            />
         </Box>

         {/* Learning Outcomes */}
         <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" p="6" mb="6">
            <Heading size="sm" mb="4" color="gray.600">Learning Outcomes (What You Will Learn)</Heading>

            <Stack gap="2" mb="3">
               {what_you_learn.map((item, i) => (
                  <Flex key={i} gap="2" align="center">
                     <Input
                        size="sm"
                        value={item}
                        onChange={e => updateLearnItem(i, e.target.value)}
                        placeholder={`Learning outcome ${i + 1}`}
                     />
                     <Button size="sm" variant="ghost" color="red.500" onClick={() => removeLearnItem(i)}>
                        <Trash2 size={14} />
                     </Button>
                  </Flex>
               ))}
            </Stack>

            <Button size="sm" variant="outline" onClick={addLearnItem}>
               <Plus size={14} />
               Add Item
            </Button>

            <FormField label="Further Information">
               <Textarea
                  mt="4"
                  value={further_information}
                  onChange={e => setFurtherInformation(e.target.value)}
                  rows={4}
                  placeholder="Certificate info, additional details..."
               />
            </FormField>
         </Box>

         {/* Sessions */}
         <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200" p="6" mb="6">
            <Heading size="sm" mb="4" color="gray.600">Course Sessions</Heading>

            {/* Existing sessions */}
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
                        <Button
                           size="xs"
                           variant="ghost"
                           color="red.500"
                           onClick={() => handleDeleteSession(s.objectId)}
                        >
                           <Trash2 size={14} />
                        </Button>
                     </Flex>
                  ))}
               </Stack>
            )}

            {/* Add new session */}
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
            <Button
               variant="outline"
               onClick={() => router.push(`/update-sections?id=${courseId}`)}
            >
               Edit Sections
            </Button>
            <Button
               colorPalette={saveSuccess ? "green" : "blue"}
               onClick={handleSave}
               loading={saving}
               loadingText="Saving..."
               minW="120px"
            >
               {saveSuccess ? 'Saved!' : 'Save Changes'}
            </Button>
         </Flex>
      </Box>
   )
}

const UpdateCourse = () => (
   <Suspense fallback={<Loading />}>
      <UpdateCourseContent />
   </Suspense>
)

export default UpdateCourse
