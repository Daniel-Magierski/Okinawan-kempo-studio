// /schemas/event.ts
import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export default defineType({
  name: 'event',
  title: 'Wydarzenie',
  type: 'document',
  icon: CalendarIcon,

  fieldsets: [
    {name: 'en',  title: 'English content', options: {collapsible: true, collapsed: false}},
    {name: 'pl',  title: 'Polski — treść',  options: {collapsible: true, collapsed: true}},
    {name: 'seo', title: 'SEO / Social',    options: {collapsible: true, collapsed: true}},
  ],

  fields: [
    // wspólny slug
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en', maxLength: 96},
      validation: (r) => r.required(),
    }),

    // ——— PROSTE POLA WIELOJĘZYCZNE ———

    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'localeString',   // { en: string; pl?: string }
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      options: {dateFormat: 'YYYY-MM-DD'},
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'location',
      title: 'Lokalizacja',
      type: 'localeString',   // { en, pl }
    }),

    defineField({
      name: 'cover',
      title: 'Okładka',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt',
          type: 'localeString',  // opisy obrazka EN/PL w jednym miejscu
          description: 'Tekst alternatywny do SEO i dostępności (EN/PL).',
        }),
      ],
    }),

    // ——— TREŚĆ: RICH TEXT, PODWÓJNE POLA (bo PortableText ≠ localeString) ———

    defineField({
      name: 'content',
      title: 'Content (EN)',
      type: 'array',
      fieldset: 'en',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'localeString',
              title: 'Alt',
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'content_pl',
      title: 'Treść (PL)',
      type: 'array',
      fieldset: 'pl',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'localeString',
              title: 'Alt',
            }),
          ],
        }),
      ],
    }),

    // ——— Galeria & tagi wspólne ———

    defineField({
      name: 'gallery',
      title: 'Galeria (opcjonalnie)',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),

    defineField({
      name: 'tags',
      title: 'Tagi',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    // ——— Social / meta ———

    defineField({
      name: 'socialPublish',
      title: 'Publikuj na social',
      type: 'boolean',
      initialValue: false,
      fieldset: 'seo',
    }),

    defineField({
      name: 'socialCaption',
      title: 'Tekst posta',
      type: 'localeText',   // { en: text; pl?: text }
      fieldset: 'seo',
    }),

    defineField({
      name: 'socialStatus',
      title: 'Status publikacji',
      type: 'string',
      options: {list: ['pending', 'queued', 'posted', 'failed']},
      readOnly: true,
      fieldset: 'seo',
    }),
  ],

  orderings: [
    {
      title: 'Najnowsze najpierw',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Najstarsze najpierw',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],

  initialValue: () => ({
    date: new Date().toISOString().slice(0, 10),
  }),

  preview: {
    select: {
      title_en:     'title.en',
      title_pl:     'title.pl',
      date:         'date',
      media:        'cover',
      location_en:  'location.en',
      location_pl:  'location.pl',
    },
    prepare(sel) {
      const title = sel.title_pl || sel.title_en || '(bez tytułu)'
      const loc   = sel.location_pl || sel.location_en
      const subtitle = [sel.date, loc].filter(Boolean).join(' • ')
      return {
        title,
        subtitle,
        media: sel.media,
      }
    },
  },
})