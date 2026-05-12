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
  caption: z.string(),
  salesDate: z.string(),
});

export const ResponseSchema = z.object({
  title: z.string(),
  titleKana: z.string(),
  author: z.string(),
  publisherName: z.string(),
  isbn: IsbnSchema,
  largeImageUrl: z.url().optional(),
  itemCaption: z.string(),
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
      caption: Item.itemCaption,
      salesDate: Item.salesDate,
    })),
  );

export const bodySchema = z.object({
  isbn: IsbnSchema,
});

export const UserBookSchema = z.object({
  isOwned: z.enum(["in_library", "owned"]),
  book: BookSchema,
});

export const UserBookResponseSchema = z.array(UserBookSchema);

export type Book = z.infer<typeof BookSchema>;
export type UserBook = z.infer<typeof UserBookSchema>;
