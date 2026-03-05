import { Flex, Text, Span } from "@chakra-ui/react"

export const MetaItem = ({ icon: Icon, label, value }) => {
   if (!value) return null
   return (
      <Flex align="center" gap="1.5" color="gray.700">
         <Icon size={16} />
         <Text fontSize="sm">
            {label && <Span fontWeight="medium">{label} </Span>}
            {value}
         </Text>
      </Flex>
   )
}
