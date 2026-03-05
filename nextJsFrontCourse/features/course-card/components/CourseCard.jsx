"use client"

import { Box, Text, Button, Flex, Image } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function CourseCard({ course, variant = 'home', isCreator = false, onDelete, delLoading }) {
  const router = useRouter()

  const handleLearnMore = () => {
    router.push(`/course-details?id=${course.objectId}`)
  }

  const handleEdit = () => {
    router.push(`/update-course?id=${course.objectId}`)
  }

  const handleDelete = () => {
    onDelete?.(course.objectId)
  }

  const handleGo = () => {
    router.push(`/course?id=${course.objectId}`)
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      minH="360px"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)', transition: 'all 0.2s' }}
      transition="all 0.2s"
    >
      {/* Thumbnail */}
      {course.thumbnail ? (
        <Image
          src={course.thumbnail}
          alt={course.name}
          w="100%"
          h="200px"
          objectFit="cover"
        />
      ) : (
        <Box
          w="100%"
          h="200px"
          bgGradient="linear(to-br, blue.700, blue.400)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" fontWeight="bold" fontSize="lg" textAlign="center" px={4}>
            {course.name}
          </Text>
        </Box>
      )}

      {/* Card body */}
      <Box p={5} display="flex" flexDirection="column" flex="1">
        <Text
          color="blue.700"
          fontWeight="semibold"
          fontSize="md"
          textAlign="center"
          mb={2}
          lineClamp={2}
        >
          {course.name}
        </Text>

        <Text
          color="gray.500"
          fontSize="sm"
          textAlign="center"
          lineClamp={3}
          mb={4}
        >
          {course.description}
        </Text>

        {/* Actions */}
        <Flex mt="auto" justifyContent="flex-end" gap={2}>
          {variant === 'home' && (
            <Button
              size="sm"
              colorPalette="blue"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          )}

          {variant === 'dashboard' && isCreator && (
            <>
              <Button
                size="sm"
                colorPalette="red"
                variant="solid"
                onClick={handleDelete}
                disabled={delLoading}
              >
                Delete
              </Button>
              <Button
                size="sm"
                colorPalette="blue"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                size="sm"
                colorPalette="green"
                onClick={handleGo}
              >
                Go
              </Button>
            </>
          )}

          {variant === 'dashboard' && !isCreator && (
            <Button
              size="sm"
              colorPalette="blue"
              onClick={handleGo}
            >
              Learn
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
