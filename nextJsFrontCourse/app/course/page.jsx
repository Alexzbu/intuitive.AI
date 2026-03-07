"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { gql, useQuery } from "@apollo/client"
import client from "@/utils/apolloClient"
import Video from "@/components/show-questions/video"
import PDF from "@/components/show-questions/pdf-file"
import Quiz from "@/components/show-questions/quiz"
import Link from "next/link"
import {
   Box, Flex, Grid, GridItem, Heading, Text, Button,
   Accordion, Span, Center, Spinner
} from "@chakra-ui/react"
import {
   ChevronLeft, PlayCircle, FileText, HelpCircle,
   BookOpen, PenLine, NotebookPen
} from "lucide-react"

const GET_COURSE_QUERY = gql`
   query getCourse($id: ID!) {
      getCourse(id: $id) {
         name
         description
         sections(order:createdAt_ASC) {
            edges {
               node {
                  objectId
                  name
                  questions(order:createdAt_ASC) {
                     edges {
                        node {
                           objectId
                           question_type
                           video_name
                           file_name
                           quiz_name
                        }
                     }
                  }
               }
            }
         }
      }
   }`

const typeConfig = {
   Video: { icon: PlayCircle, nameKey: "video_name", color: "blue.500" },
   File:  { icon: FileText,   nameKey: "file_name",  color: "orange.500" },
   Quiz:  { icon: HelpCircle, nameKey: "quiz_name",  color: "purple.500" },
}

const CourseContent = () => {
   const searchParams = useSearchParams()
   const router = useRouter()
   const courseId = searchParams.get("id")
   const [selected, setSelected] = useState(null)

   const { data, loading } = useQuery(GET_COURSE_QUERY, {
      client,
      variables: { id: courseId },
      skip: !courseId,
   })

   const course = data?.getCourse
   const sections = course?.sections?.edges ?? []

   return (
      <Box minH="100vh" bg="gray.50">
         {/* Hero Banner */}
         <Box
            bgGradient="to-r"
            gradientFrom="blue.700"
            gradientTo="blue.400"
            py="8"
            px="8"
         >
            <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
               <Heading color="white" size="xl" fontWeight="bold">
                  {course?.name ?? "Loading..."}
               </Heading>
               <Button
                  asChild
                  variant="outline"
                  size="sm"
                  colorPalette="whiteAlpha"
                  color="white"
                  borderColor="whiteAlpha.600"
                  _hover={{ bg: "whiteAlpha.200" }}
               >
                  <Link href={`/whiteboard?id=${courseId}`}>
                     <PenLine size={15} />
                     Whiteboard
                  </Link>
               </Button>
               <Button
                  asChild
                  variant="outline"
                  size="sm"
                  colorPalette="whiteAlpha"
                  color="white"
                  borderColor="whiteAlpha.600"
                  _hover={{ bg: "whiteAlpha.200" }}
               >
                  <Link href={`/editor?courseId=${courseId}`}>
                     <NotebookPen size={15} />
                     Open Notes
                  </Link>
               </Button>
            </Flex>
         </Box>

         <Box maxW="1400px" mx="auto" px="6" pt="4" pb="10">
            {/* Back button */}
            <Button
               variant="ghost"
               size="sm"
               px="0"
               mb="4"
               color="gray.600"
               _hover={{ color: "gray.900" }}
               onClick={() => router.back()}
            >
               <ChevronLeft size={18} />
               Back
            </Button>

            {loading ? (
               <Center py="20"><Spinner size="xl" color="blue.500" /></Center>
            ) : (
               <Grid templateColumns={{ base: "1fr", lg: "280px 1fr" }} gap="6" alignItems="start">
                  {/* Sidebar */}
                  <GridItem>
                     <Box
                        bg="white"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        overflow="hidden"
                        position={{ lg: "sticky" }}
                        top="20px"
                     >
                        <Box px="4" py="3" borderBottom="1px solid" borderColor="gray.100" bg="gray.50">
                           <Text fontWeight="semibold" fontSize="sm" color="gray.600" textTransform="uppercase" letterSpacing="wide">
                              Course Content
                           </Text>
                        </Box>

                        {sections.length === 0 ? (
                           <Flex align="center" gap="2" px="4" py="6" color="gray.400">
                              <BookOpen size={16} />
                              <Text fontSize="sm">No sections yet.</Text>
                           </Flex>
                        ) : (
                           <Accordion.Root collapsible defaultValue={[sections[0]?.node.objectId]} multiple>
                              {sections.map(({ node: section }) => (
                                 <Accordion.Item key={section.objectId} value={section.objectId} borderBottom="1px solid" borderColor="gray.100">
                                    <Accordion.ItemTrigger px="4" py="3" _hover={{ bg: "gray.50" }}>
                                       <Span flex="1" fontSize="sm" fontWeight="medium" color="gray.800" textAlign="left">
                                          {section.name}
                                       </Span>
                                       <Accordion.ItemIndicator />
                                    </Accordion.ItemTrigger>
                                    <Accordion.ItemContent>
                                       <Accordion.ItemBody px="0" py="1">
                                          {section.questions.edges.length === 0 ? (
                                             <Text fontSize="xs" color="gray.400" px="4" py="2">No items</Text>
                                          ) : (
                                             section.questions.edges.map(({ node: q }) => {
                                                const cfg = typeConfig[q.question_type]
                                                if (!cfg) return null
                                                const { icon: Icon, nameKey, color } = cfg
                                                const label = q[nameKey] || q.question_type
                                                const isActive = selected?.id === q.objectId
                                                return (
                                                   <Flex
                                                      key={q.objectId}
                                                      as="button"
                                                      align="center"
                                                      gap="2.5"
                                                      px="4"
                                                      py="2.5"
                                                      w="full"
                                                      textAlign="left"
                                                      cursor="pointer"
                                                      bg={isActive ? "blue.50" : "transparent"}
                                                      borderLeft="3px solid"
                                                      borderLeftColor={isActive ? "blue.500" : "transparent"}
                                                      _hover={{ bg: isActive ? "blue.50" : "gray.50" }}
                                                      onClick={() => setSelected({ id: q.objectId, type: q.question_type })}
                                                   >
                                                      <Box color={isActive ? "blue.500" : color} flexShrink={0}>
                                                         <Icon size={14} />
                                                      </Box>
                                                      <Text
                                                         fontSize="sm"
                                                         color={isActive ? "blue.700" : "gray.700"}
                                                         fontWeight={isActive ? "medium" : "normal"}
                                                         lineClamp={2}
                                                      >
                                                         {label}
                                                      </Text>
                                                   </Flex>
                                                )
                                             })
                                          )}
                                       </Accordion.ItemBody>
                                    </Accordion.ItemContent>
                                 </Accordion.Item>
                              ))}
                           </Accordion.Root>
                        )}
                     </Box>
                  </GridItem>

                  {/* Content Panel */}
                  <GridItem>
                     <Box
                        bg="white"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        minH="500px"
                        overflow="hidden"
                     >
                        {!selected ? (
                           <Flex
                              direction="column"
                              align="center"
                              justify="center"
                              minH="500px"
                              gap="3"
                              color="gray.400"
                           >
                              <BookOpen size={48} />
                              <Text fontSize="sm">Select a lesson from the sidebar to begin</Text>
                           </Flex>
                        ) : (
                           <Box p="6">
                              {selected.type === "Video" && <Video questionId={selected.id} />}
                              {selected.type === "File"  && <PDF  questionId={selected.id} />}
                              {selected.type === "Quiz"  && <Quiz questionId={selected.id} />}
                           </Box>
                        )}
                     </Box>
                  </GridItem>
               </Grid>
            )}
         </Box>
      </Box>
   )
}

const Course = () => {
   return (
      <Suspense fallback={<Center py="20"><Spinner size="xl" color="blue.500" /></Center>}>
         <CourseContent />
      </Suspense>
   )
}

export default Course
