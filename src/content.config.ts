import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro:schema";

export const collections = {
  journal: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
    schema: z.object({
      title: z.string(),
      description: z.string().default(""),
      category: z.string().default("JOURNAL"),
      image: z.string().default(""),
      slug: z.string().optional(),
      date: z.coerce.date().optional(),
      categories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      coverImage: z.string().optional(),
    }),
  }),
};
