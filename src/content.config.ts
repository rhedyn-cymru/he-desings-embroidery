import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolio = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    thumbnail: z.string().optional(),
    featured: z.boolean(),
    client: z.string(),
    tags: z.array(z.string()),
    locale: z.string()
  })
});

const staticpages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/staticpages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    locale: z.string()
  })
});

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    style: z.string(),
    icon: z.string(),
    locale: z.string(),
    featured: z.boolean()
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    description: z.string(),
    featured: z.boolean(),
    tags: z.array(z.string()),
    author: z.string(),
    date: z.string(),
    locale: z.string()
  })
});

export const collections = { portfolio, staticpages, services, blog };