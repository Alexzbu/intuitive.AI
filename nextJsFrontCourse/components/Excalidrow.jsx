"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useRef, useEffect, useState } from "react";
import {
   Box,
   Flex,
   Text,
   Button,
   VStack,
   HStack,
   Badge,
   Collapsible,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { useWhiteboardCollab } from "@/hooks/useWhiteboardCollab";

function ParticipantsPanel({ users, permissions, onGrant, onRevoke }) {
   const stored =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
   const currentUserId = stored ? JSON.parse(stored).objectId : null;

   return (
      <Collapsible.Root defaultOpen>
         <Box
            position="absolute"
            top={3}
            right={3}
            zIndex={10}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            minW="230px"
            boxShadow="xl"
            overflow="hidden"
         >
            {/* Header */}
            <Collapsible.Trigger asChild>
               <Flex
                  align="center"
                  justify="space-between"
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
               >
                  <HStack spacing={2}>
                     <Text fontWeight="bold" fontSize="sm">
                        Participants
                     </Text>
                     <Badge colorScheme="gray" fontSize="0.65rem">
                        {users.length}
                     </Badge>
                  </HStack>

                  <Collapsible.Context>
                     {(context) => (
                        <Box
                           transition="transform 0.2s"
                           transform={context.open ? "rotate(180deg)" : "rotate(0deg)"}
                        >
                           <ChevronDown size={16} />
                        </Box>
                     )}
                  </Collapsible.Context>
               </Flex>
            </Collapsible.Trigger>

            {/* Body */}
            <Collapsible.Content>
               <Box px={4} pb={3}>
                  <VStack align="stretch" spacing={2}>
                     {users.map((user) => {
                        const isYou = user.userId === currentUserId;
                        const isPermitted = permissions.has(user.userId);

                        return (
                           <Flex
                              key={user.userId}
                              justify="space-between"
                              align="center"
                              py={1}
                              borderBottom="1px solid"
                              borderColor="gray.100"
                           >
                              <HStack spacing={2}>
                                 <Text fontSize="sm" color="gray.700">
                                    {user.firstName}
                                 </Text>

                                 {user.role === "host" && (
                                    <Badge colorScheme="purple" fontSize="0.6rem">
                                       host
                                    </Badge>
                                 )}

                                 {isYou && (
                                    <Text fontSize="xs" color="gray.400">
                                       (you)
                                    </Text>
                                 )}
                              </HStack>

                              {user.role !== "host" && !isYou &&
                                 (isPermitted ? (
                                    <Button
                                       size="xs"
                                       colorPalette="red"
                                       variant="surface"
                                       onClick={() => onRevoke(user.userId)}
                                    >
                                       Revoke
                                    </Button>
                                 ) : (
                                    <Button
                                       size="xs"
                                       colorPalette="blue"
                                       variant="surface"
                                       onClick={() => onGrant(user.userId)}
                                    >
                                       Allow
                                    </Button>
                                 ))}
                           </Flex>
                        );
                     })}

                     {users.length < 2 && (
                        <Text fontSize="xs" color="gray.400">
                           No viewers yet
                        </Text>
                     )}
                  </VStack>
               </Box>
            </Collapsible.Content>
         </Box>
      </Collapsible.Root>
   );
}

const ExcalidrawWrapper = ({ courseId = "global-room" }) => {
   const [excalidrawAPI, setExcalidrawAPI] = useState(null);
   const isRemoteUpdate = useRef(false);

   const {
      role,
      canDraw,
      users,
      permissions,
      remoteElements,
      sendUpdate,
      grantPermission,
      revokePermission,
   } = useWhiteboardCollab(courseId);

   useEffect(() => {
      if (remoteElements && excalidrawAPI) {
         isRemoteUpdate.current = true;
         excalidrawAPI.updateScene({ elements: remoteElements });
      }
   }, [remoteElements, excalidrawAPI]);

   const handleChange = (elements) => {
      if (isRemoteUpdate.current) {
         isRemoteUpdate.current = false;
         return;
      }
      if (canDraw) {
         sendUpdate(elements);
      }
   };

   return (
      <Box h="600px" w="100%" position="relative">
         {role === "host" && (
            <ParticipantsPanel
               users={users}
               permissions={permissions}
               onGrant={grantPermission}
               onRevoke={revokePermission}
            />
         )}

         {!canDraw && role !== "host" && (
            <Box
               position="absolute"
               top={3}
               left="50%"
               transform="translateX(-50%)"
               zIndex={10}
               bg="blackAlpha.600"
               color="white"
               borderRadius="md"
               px={4}
               py={1.5}
               fontSize="sm"
               pointerEvents="none"
            >
               View only — waiting for host to grant draw access
            </Box>
         )}

         <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            onChange={handleChange}
            viewModeEnabled={!canDraw}
         />
      </Box>
   );
};

export default ExcalidrawWrapper;