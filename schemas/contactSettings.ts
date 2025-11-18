// studio/schemas/contactSettings.ts
import {defineType, defineField} from "sanity"

export default defineType({
  name: "contactSettings",
  title: "Kontakt — ustawienia",
  type: "document",
  fields: [
    // Tytuł wielojęzyczny
    defineField({
      name: "title",
      type: "localeString",
      title: "Tytuł",
      // możesz dodać initialValue, jeśli chcesz:
      // initialValue: { en: "Contact", pl: "Kontakt" },
    }),

    // Dane kontaktowe (jednojęzyczne – nie ma sensu dublować)
    defineField({
      name: "email",
      type: "email",
      title: "E-mail",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Telefon",
    }),

    // Adres wielojęzyczny
    defineField({
      name: "address",
      type: "localeText",
      title: "Adres",
    }),

    // Reszta ustawień technicznych – bez i18n
    defineField({
      name: "mapEmbedUrl",
      type: "url",
      title: "Map — embed URL (Google)",
    }),
    defineField({
      name: "formTarget",
      title: "Gdzie wysyłać formularz",
      type: "string",
      initialValue: "email",
      options: {
        list: [
          { title: "Email (SMTP/Resend)", value: "email" },
          { title: "Webhook (Make/Zapier)", value: "webhook" },
        ],
      },
    }),
    defineField({
      name: "webhookUrl",
      type: "url",
      hidden: ({ parent }) => parent?.formTarget !== "webhook",
    }),
  ],
})