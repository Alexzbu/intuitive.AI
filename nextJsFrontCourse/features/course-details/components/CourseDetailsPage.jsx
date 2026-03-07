import Link from "next/link"
import {
   Box, Flex, Grid, GridItem, Text, Heading, Badge, Button,
   Accordion, Tabs, Span
} from "@chakra-ui/react"
import {
   MapPin, Clock, Tag, ChevronLeft,
   CheckCircle, Users, BookOpen
} from "lucide-react"
import { MetaItem } from "./MetaItem"
import { SessionCard } from "./SessionCard"

export function CourseDetailsPage({
   courseId, course, sessions, loading,
   canAccess,
   showFullDesc, setShowFullDesc,
   selectedSession, setSelectedSession,
   handleRegister, enrollLoading, router,
}) {
   if (loading) return null

   const description = course?.description || ""
   const descTruncated = description.length > 300 && !showFullDesc
      ? description.slice(0, 300) + "..."
      : description

   const whatYouLearn = course?.what_you_learn || []
   const sections = course?.sections?.edges || []

   return (
      <Box>
         {/* Hero Banner */}
         <Box
            bgGradient="to-r"
            gradientFrom="blue.700"
            gradientTo="blue.400"
            py="10"
            px="8"
            textAlign="center"
         >
            <Heading color="white" size="2xl" fontWeight="bold">
               {course?.name}
            </Heading>
            {course?.subtitle && (
               <Text color="blue.100" mt="2" fontSize="lg">{course.subtitle}</Text>
            )}
         </Box>

         <Box px="8" pt="5" pb="10" maxW="1200px" mx="auto">
            <Flex align="center" gap="4" mb="5">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  px="0"
                  color="gray.600"
                  _hover={{ color: "gray.900" }}
               >
                  <ChevronLeft size={18} />
               </Button>
            </Flex>

            <Tabs.Root defaultValue="overview" variant="outline">
               <Tabs.List mb="6">
                  <Tabs.Trigger value="overview">Course Overview</Tabs.Trigger>
                  <Tabs.Trigger value="outcomes">Learning Outcomes</Tabs.Trigger>
               </Tabs.List>

               <Grid
                  templateColumns={{ base: "1fr", lg: "1fr 340px" }}
                  gap="8"
                  alignItems="start"
               >
                  {/* LEFT COLUMN */}
                  <GridItem>
                     <Tabs.Content value="overview">
                        {/* Course Image */}
                        {course?.thumbnail ? (
                           <Box
                              as="img"
                              src={course.thumbnail}
                              alt={course.name}
                              w="full"
                              maxH="300px"
                              objectFit="cover"
                              borderRadius="md"
                              mb="5"
                           />
                        ) : (
                           <Box
                              w="full"
                              h="220px"
                              bg="blue.100"
                              borderRadius="md"
                              mb="5"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                           >
                              <BookOpen size={48} color="#4A90D9" />
                           </Box>
                        )}

                        {/* Registration deadline */}
                        {course?.registration_deadline && (
                           <Badge colorPalette="blue" mb="4" px="3" py="1" borderRadius="full">
                              Registration possible until {course.registration_deadline}
                           </Badge>
                        )}

                        {/* Metadata row */}
                        <Flex wrap="wrap" gap="4" mb="6">
                           <MetaItem icon={MapPin} value={course?.location} />
                           <MetaItem icon={Clock} value={course?.duration_hours} />
                           <MetaItem icon={Tag} value={course?.price} />
                        </Flex>

                        {/* Description */}
                        {description && (
                           <Box mb="6">
                              <Heading size="md" mb="3">Course Overview</Heading>
                              <Text fontSize="sm" color="gray.700" lineHeight="tall">
                                 {descTruncated}
                              </Text>
                              {description.length > 300 && (
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    mt="1"
                                    color="blue.600"
                                    px="0"
                                    onClick={() => setShowFullDesc(!showFullDesc)}
                                 >
                                    {showFullDesc ? "Show less" : "...Show more"}
                                 </Button>
                              )}
                           </Box>
                        )}

                        {/* Contents */}
                        {course?.contents && (
                           <Box mb="6">
                              <Heading size="md" mb="2">Contents</Heading>
                              <Text fontSize="sm" color="gray.700" lineHeight="tall">
                                 {course.contents}
                              </Text>
                           </Box>
                        )}

                        {/* Sections Accordion */}
                        {sections.length > 0 && (
                           <Box mb="6">
                              <Heading size="md" mb="3">Modules in the course</Heading>
                              <Accordion.Root collapsible variant="outline">
                                 {sections.map(({ node }) => (
                                    <Accordion.Item key={node.objectId} value={node.objectId}>
                                       <Accordion.ItemTrigger>
                                          <Span flex="1" fontSize="sm" fontWeight="medium">
                                             {node.name}
                                          </Span>
                                          <Accordion.ItemIndicator />
                                       </Accordion.ItemTrigger>
                                       <Accordion.ItemContent>
                                          <Accordion.ItemBody>
                                             <Text fontSize="sm" color="gray.600">
                                                Module content available after enrollment.
                                             </Text>
                                          </Accordion.ItemBody>
                                       </Accordion.ItemContent>
                                    </Accordion.Item>
                                 ))}
                              </Accordion.Root>
                           </Box>
                        )}

                        {/* Target group */}
                        {course?.target_group && (
                           <Box mb="6">
                              <Heading size="md" mb="2">Target group</Heading>
                              <Text fontSize="sm" color="gray.700" lineHeight="tall">
                                 {course.target_group}
                              </Text>
                           </Box>
                        )}

                        {/* Technical requirements */}
                        {course?.recommendation && (
                           <Box mb="6">
                              <Heading size="md" mb="2">Technical requirements</Heading>
                              <Text fontSize="sm" color="gray.700" lineHeight="tall" whiteSpace="pre-line">
                                 {course.recommendation}
                              </Text>
                           </Box>
                        )}
                     </Tabs.Content>

                     {/* Learning Outcomes Tab */}
                     <Tabs.Content value="outcomes">
                        {whatYouLearn.length > 0 ? (
                           <Box mb="6">
                              <Heading size="md" mb="4">What you will learn</Heading>
                              <Flex direction="column" gap="2">
                                 {whatYouLearn.map((item, i) => (
                                    <Flex key={i} align="flex-start" gap="2">
                                       <Box color="blue.500" mt="0.5" flexShrink={0}>
                                          <CheckCircle size={14} />
                                       </Box>
                                       <Text fontSize="sm" color="gray.700">{item}</Text>
                                    </Flex>
                                 ))}
                              </Flex>
                           </Box>
                        ) : null}
                        {course?.further_information && (
                           <Box mb="6">
                              <Heading size="md" mb="2">Further information</Heading>
                              <Text fontSize="sm" color="gray.700" lineHeight="tall" whiteSpace="pre-line">
                                 {course.further_information}
                              </Text>
                           </Box>
                        )}
                        {whatYouLearn.length === 0 && !course?.further_information && (
                           <Text fontSize="sm" color="gray.500">No learning outcomes added yet.</Text>
                        )}
                     </Tabs.Content>
                  </GridItem>

                  {/* RIGHT SIDEBAR */}
                  <GridItem display={{ base: "none", lg: "block" }}>
                     <Box position="sticky" top="20px">
                        {sessions.length > 0 ? (
                           <Flex direction="column" gap="3" mb="4">
                              {sessions.map(session => (
                                 <SessionCard
                                    key={session.objectId}
                                    session={session}
                                    isSelected={selectedSession === session.objectId}
                                    onSelect={setSelectedSession}
                                 />
                              ))}
                           </Flex>
                        ) : (
                           <Box
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="md"
                              p="4"
                              mb="4"
                              bg="gray.50"
                           >
                              <Flex align="center" gap="2" color="gray.500">
                                 <Users size={16} />
                                 <Text fontSize="sm">No sessions scheduled yet.</Text>
                              </Flex>
                           </Box>
                        )}

                        {canAccess ? (
                           <Button w="full" colorPalette="teal" size="lg" asChild>
                              <Link href={`/course?id=${courseId}`}>Continue</Link>
                           </Button>
                        ) : (
                           <Button
                              w="full"
                              colorPalette="blue"
                              size="lg"
                              onClick={handleRegister}
                              loading={enrollLoading}
                              loadingText="Registering..."
                           >
                              Register for Course
                           </Button>
                        )}
                     </Box>
                  </GridItem>
               </Grid>

               {/* Mobile CTA */}
               <Box display={{ base: "block", lg: "none" }} mt="6">
                  {canAccess ? (
                     <Button w="full" colorPalette="teal" size="lg" asChild>
                        <Link href={`/course?id=${courseId}`}>Continue</Link>
                     </Button>
                  ) : (
                     <Button
                        w="full"
                        colorPalette="blue"
                        size="lg"
                        onClick={handleRegister}
                        loading={enrollLoading}
                        loadingText="Registering..."
                     >
                        Register for Course
                     </Button>
                  )}
               </Box>
            </Tabs.Root>
         </Box>
      </Box>
   )
}
