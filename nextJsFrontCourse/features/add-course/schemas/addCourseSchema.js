import { z } from "zod"

export const addCourseSchema = z.object({
   name:                  z.string().min(2, "Course name is required (min 2 chars)"),
   subtitle:              z.string().optional(),
   objective:             z.string().optional(),
   target_group:          z.string().optional(),
   recommendation:        z.string().optional(),
   key_words:             z.array(z.string()).optional(),
   description:           z.string().optional(),
   contents:              z.string().optional(),
   duration_hours:        z.string().optional(),
   location:              z.string().optional(),
   price:                 z.string().optional(),
   registration_deadline: z.string().optional(),
   what_you_learn:        z.array(z.object({ value: z.string() })).optional(),
   further_information:   z.string().optional(),
   thumbnail:             z.string().optional(),
})
