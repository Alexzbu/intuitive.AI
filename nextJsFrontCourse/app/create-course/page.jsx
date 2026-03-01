"use client"

import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
} from "@chakra-ui/react"
import { ArrowBigLeft, Bot, Pencil } from "lucide-react"

export default function CreateCourse() {
  const router = useRouter()

  return (
    <Box px={{ base: 6, md: 10 }} py={8} minH="100vh" bg="white">
      {/* Header */}
      <Box mb={6}>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          color="gray.600"
          _hover={{ color: "blue.700", bg: "transparent" }}
          px={0}
        >
          <ArrowBigLeft size={16} />
          Back
        </Button>
      </Box>

      {/* Title */}
      <Heading size="xl" mb={16} textAlign="center">
        Create New Course
      </Heading>

      {/* Center Section */}
      <VStack maxW="680px" mx="auto" spacing={10} textAlign="center">
        <Box>
          <Heading size="md" mb={2}>
            How would you like to create your course?
          </Heading>
          <Text fontSize="sm" color="gray.500">
            Choose the method that best fits your needs.
          </Text>
        </Box>

        {/* Cards */}
        <HStack
          spacing={6}
          align="stretch"
          justify="center"
          flexDir={{ base: "column", md: "row" }}
        >
          {/* AI Card */}
          <Card.Root
            flex="1"
            maxW="280px"
            cursor="pointer"
            borderWidth="1.5px"
            borderColor="blue.200"
            bg="blue.50"
            borderRadius="2xl"
            transition="all 0.2s ease"
            _hover={{
              boxShadow: "xl",
              transform: "translateY(-4px)",
            }}
            _active={{
              transform: "translateY(-1px)",
            }}
            onClick={() => router.push("/create-course-ai")}
          >
            <Card.Body>
              <VStack spacing={5}>
                <Flex
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  bg="blue.600"
                  align="center"
                  justify="center"
                >
                  <Bot size={26} color="white" />
                </Flex>

                <Heading size="sm">
                  Create Course with AI
                </Heading>

                <Text fontSize="sm" color="gray.600">
                  Let AI guide you through the entire course creation process
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Manual Card */}
          <Card.Root
            flex="1"
            maxW="280px"
            cursor="pointer"
            borderWidth="1.5px"
            borderColor="gray.200"
            borderRadius="2xl"
            transition="all 0.2s ease"
            _hover={{
              boxShadow: "xl",
              transform: "translateY(-4px)",
            }}
            _active={{
              transform: "translateY(-1px)",
            }}
            onClick={() => router.push("/add-course?noai=true")}
          >
            <Card.Body>
              <VStack spacing={5}>
                <Flex
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  bg="gray.800"
                  align="center"
                  justify="center"
                >
                  <Pencil size={24} color="white" />
                </Flex>

                <Heading size="sm">
                  Create Course without AI
                </Heading>

                <Text fontSize="sm" color="gray.600">
                  Create your course manually with full control
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </HStack>
      </VStack>
    </Box>
  )
}