// /studio-okinawan-kempo/schemas/album.ts
import {defineType, defineField} from 'sanity'
import {mediaAssetSource} from 'sanity-plugin-media'
import {ImagesIcon} from '@sanity/icons'

export default defineType({
  name: 'album',
  title: 'Galeria zdjęć',
  type: 'document',
  icon: ImagesIcon,

  fields: [
    // Slug wspólny — generujemy z EN, a jak brak, to z PL
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: (doc) => doc?.title?.en || doc?.title?.pl || '',
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),

    // Tytuł wielojęzyczny
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Tytuł',
      validation: (r) =>
        r.custom((val) =>
          val?.en || val?.pl ? true : 'Podaj tytuł przynajmniej w jednym języku'
        ),
    }),

    // (opcjonalnie) opis albumu wielojęzyczny
    defineField({
      name: 'description',
      type: 'localeText',
      title: 'Opis (opcjonalnie)',
    }),

    // TABLICA ZDJĘĆ — alt też jako localeString
    defineField({
      name: 'photos',
      title: 'Zdjęcia',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'localeString',
              title: 'Alt (opis obrazka)',
            }),
          ],
        },
      ],
      options: {layout: 'grid'},
    }),

    // Okładka
    defineField({
      name: 'cover',
      title: 'Okładka',
      type: 'image',
      options: {hotspot: true, sources: [mediaAssetSource]},
      fields: [
        defineField({
          name: 'alt',
          type: 'localeString',
          title: 'Alt (okładka)',
        }),
      ],
    }),

    defineField({
      name: 'published',
      type: 'boolean',
      title: 'Opublikowane',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      titleEn: 'title.en',
      titlePl: 'title.pl',
      media: 'cover',
      slug: 'slug.current',
    },
    prepare(sel) {
      const title = sel.titlePl || sel.titleEn || '(bez tytułu)'
      return {
        title,
        subtitle: sel.slug ? `/galeria/${sel.slug}` : '',
        media: sel.media,
      }
    },
  },
})