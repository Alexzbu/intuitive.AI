"use client";

import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

const ExcalidrawWrapper = () => {

   return (
      <div style={{ height: "600px", width: "100%" }}>
         <Excalidraw />
      </div>
   );
};
export default ExcalidrawWrapper;