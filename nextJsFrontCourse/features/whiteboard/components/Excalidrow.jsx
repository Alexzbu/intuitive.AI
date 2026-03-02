"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useWhiteboardCollab } from "@/features/whiteboard/hooks/useWhiteboardCollab";
import { ParticipantsPanel } from "./ParticipantsPanel";



const ExcalidrawWrapper = ({ courseId = "global-room" }) => {
   const [excalidrawAPI, setExcalidrawAPI] = useState(null);

   const {
      role,
      canDraw,
      users,
      permissions,
      remoteElements,
      remoteVersionsRef,
      sendUpdate,
      grantPermission,
      revokePermission,
      accessDenied,
      deniedMessage,
   } = useWhiteboardCollab(courseId);

   useEffect(() => {
      if (remoteElements && excalidrawAPI) {
         excalidrawAPI.updateScene({ elements: remoteElements });
      }
   }, [remoteElements, excalidrawAPI]);

   const handleChange = (elements) => {
      if (!canDraw) return;
      const hasLocalChange = elements.some((el) => {
         const serverVersion = remoteVersionsRef.current.get(el.id);
         return serverVersion === undefined || el.version > serverVersion;
      });
      if (hasLocalChange) {
         sendUpdate(elements);
      }
   };

   if (accessDenied) {
      return (
         <Box h="600px" w="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
            <VStack gap={3}>
               <Text fontSize="xl" fontWeight="semibold" color="red.500">Access Denied</Text>
               <Text color="gray.600">{deniedMessage}</Text>
            </VStack>
         </Box>
      );
   }

   return (
      <Box h="600px" w="100%" position="relative">
         {role === "host" ? (
            <ParticipantsPanel
               users={users}
               permissions={permissions}
               onGrant={grantPermission}
               onRevoke={revokePermission}
            />
         ) : (
            <ParticipantsPanel
               users={users}
               permissions={permissions}
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