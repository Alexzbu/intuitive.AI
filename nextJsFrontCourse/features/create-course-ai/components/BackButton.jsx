import { Button, HStack, Text } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";

export function BackButton({ label, onClick }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      px={0}
      fontSize="1.5rem"
      fontWeight="700"
      color="gray.900"
      _hover={{ color: "blue.500", bg: "transparent" }}
      gap={2}
      h="auto"
    >
      <HStack gap={2}>
        <ChevronLeft size={20} />
        <Text as="span" fontSize="1.5rem" fontWeight="700">
          {label}
        </Text>
      </HStack>
    </Button>
  );
}
