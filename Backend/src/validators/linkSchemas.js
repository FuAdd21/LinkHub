import { z } from "zod";

const HTTP_URL_REGEX = /^https?:\/\/.+/i;

export const createLinkSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  url: z
    .string({ required_error: "URL is required" })
    .trim()
    .min(1, "URL is required")
    .max(512, "URL cannot exceed 512 characters")
    .regex(HTTP_URL_REGEX, "Invalid URL format. URL must start with http:// or https://"),
  display_mode: z
    .enum(["link", "header_pill", "rich_card"], {
      errorMap: () => ({ message: "Display mode must be 'link', 'header_pill', or 'rich_card'" }),
    })
    .optional()
    .default("link"),
  icon: z.string().max(100).optional().nullable(),
  scheduled_at: z
    .string()
    .datetime({ offset: true, message: "scheduled_at must be a valid ISO datetime string" })
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export const updateLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title cannot exceed 255 characters")
    .optional(),
  url: z
    .string()
    .trim()
    .max(512, "URL cannot exceed 512 characters")
    .regex(HTTP_URL_REGEX, "Invalid URL format. URL must start with http:// or https://")
    .optional(),
  display_mode: z
    .enum(["link", "header_pill", "rich_card"], {
      errorMap: () => ({ message: "Display mode must be 'link', 'header_pill', or 'rich_card'" }),
    })
    .optional(),
  icon: z.string().max(100).optional().nullable(),
  is_visible: z
    .boolean()
    .or(z.number().min(0).max(1).transform(Boolean))
    .optional(),
  scheduled_at: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export const reorderLinksSchema = z.object({
  linkIds: z
    .array(z.number().int().positive("Link IDs must be positive integers"), {
      required_error: "linkIds array is required",
    })
    .min(1, "At least one link ID is required")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Link IDs must not contain duplicates"
    ),
});
