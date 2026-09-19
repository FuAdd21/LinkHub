import { z } from "zod";

const HTTP_URL_REGEX = /^https?:\/\/.+/i;

export const createProjectSchema = z.object({
  title: z.string().min(1, "Project title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional().nullable(),
  url: z.string().regex(HTTP_URL_REGEX, "Must be a valid project URL").max(512).optional().nullable().or(z.literal("")),
  image_url: z.string().regex(HTTP_URL_REGEX, "Must be a valid image URL").max(512).optional().nullable().or(z.literal("")),
  role: z.string().max(100).optional().nullable(),
  technologies: z.array(z.string().max(50)).max(20).optional().nullable(),
  featured: z.union([z.boolean(), z.number()]).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const reorderProjectsSchema = z.object({
  order: z.array(z.number().int().positive()).min(1, "Order array must not be empty"),
});

export const createCredentialSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  issuer: z.string().max(200).optional().nullable(),
  year: z.number().int().min(1950).max(2100).optional().nullable(),
  url: z.string().regex(HTTP_URL_REGEX, "Must be a valid credential URL").max(512).optional().nullable().or(z.literal("")),
});

export const updateCredentialSchema = createCredentialSchema.partial();

