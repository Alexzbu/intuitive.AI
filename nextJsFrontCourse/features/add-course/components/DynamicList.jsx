import { Flex, Input, Button, Stack } from "@chakra-ui/react"
import { Plus, Trash2 } from "lucide-react"

export function DynamicList({ fields, onAppend, onRemove, register, placeholder = "Enter item..." }) {
   return (
      <Stack gap="2">
         {fields.map((field, i) => (
            <Flex key={field.id} gap="2" align="center">
               <Input
                  size="sm"
                  placeholder={`${placeholder} ${i + 1}`}
                  {...register(`what_you_learn.${i}.value`)}
               />
               <Button
                  size="sm"
                  variant="ghost"
                  color="red.500"
                  px="2"
                  onClick={() => onRemove(i)}
                  aria-label="Remove item"
               >
                  <Trash2 size={14} />
               </Button>
            </Flex>
         ))}
         <Button size="sm" variant="outline" alignSelf="flex-start" onClick={() => onAppend({ value: "" })}>
            <Plus size={14} />
            Add Item
         </Button>
      </Stack>
   )
}
