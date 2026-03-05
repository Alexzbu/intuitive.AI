import { Box, Flex, Text } from "@chakra-ui/react"
import { Calendar, Clock } from "lucide-react"

export const SessionCard = ({ session, isSelected, onSelect }) => {
   const spotsLeft = session.spots_available != null ? session.spots_available : null
   return (
      <Box
         border="1px solid"
         borderColor={isSelected ? "blue.400" : "gray.200"}
         borderRadius="md"
         p="4"
         cursor="pointer"
         onClick={() => onSelect(session.objectId)}
         bg={isSelected ? "blue.50" : "white"}
         _hover={{ borderColor: "blue.300" }}
      >
         <Flex align="center" justify="space-between">
            <Flex direction="column" gap="1" flex="1">
               <Flex align="center" gap="2">
                  <Calendar size={14} color="#4A90D9" />
                  <Text fontWeight="semibold" fontSize="sm">
                     {session.start_date} - {session.end_date}
                  </Text>
               </Flex>
               {session.schedule && (
                  <Flex align="center" gap="2">
                     <Clock size={14} color="#666" />
                     <Text fontSize="xs" color="gray.600">{session.schedule}</Text>
                  </Flex>
               )}
               {spotsLeft !== null && (
                  <Text fontSize="xs" color="teal.600" fontWeight="medium" mt="1">
                     {spotsLeft > 0 ? "Free places available" : "Fully booked"}
                  </Text>
               )}
            </Flex>
            <Box
               w="4" h="4"
               borderRadius="full"
               border="2px solid"
               borderColor={isSelected ? "blue.500" : "gray.300"}
               bg={isSelected ? "blue.500" : "transparent"}
               flexShrink={0}
            />
         </Flex>
      </Box>
   )
}
