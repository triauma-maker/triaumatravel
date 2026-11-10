import { defineCollection, z } from 'astro:content';

const hotelsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    categories: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = {
  'hotels': hotelsCollection,
};