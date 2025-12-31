import z from "zod";

export const IsbnSchema = z
  .string()
  .length(13)
  .regex(/^(978|979)\d{10}$/, "Invalid ISBN");

export const BookSchema = z.object({
  title: z.string(),
  titleKana: z.string(),
  author: z.string(),
  publisherName: z.string(),
  isbn: IsbnSchema,
  image: z.string().nullable(),
  salesDate: z.string(),
});

export const ResponseSchema = z.object({
  title: z.string(),
  titleKana: z.string(),
  author: z.string(),
  publisherName: z.string(),
  isbn: IsbnSchema,
  largeImageUrl: z.url().optional(),
  salesDate: z.string(),
});

export const BookResponseSchema = z
  .object({
    Items: z.array(
      z.object({
        Item: ResponseSchema,
      }),
    ),
  })
  .transform((data) =>
    data.Items.map(({ Item }) => ({
      title: Item.title,
      titleKana: Item.titleKana,
      author: Item.author,
      publisherName: Item.publisherName,
      isbn: Item.isbn,
      image: Item.largeImageUrl ?? null,
      salesDate: Item.salesDate,
    })),
  );
