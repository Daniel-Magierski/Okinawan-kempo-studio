// sanity/schemas/page.ts
import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => doc.title?.en,
        maxLength: 80,
      },
      validation: r => r.required(),
    }),

    defineField({
      name: 'hero',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        { name: 'alt', title: 'Alt', type: 'localeString' },
      ],
    }),

    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'textSection' },
        { type: 'sidePanelSection' },
      ],
    }),
  ],
    preview: {
    select: {
      title_pl: 'title.pl',
      title_en: 'title.en',
      slug: 'slug.current',
    },
    prepare({title_pl, title_en, slug}) {
      return {
        title: title_pl || title_en || '(untitled)',
        subtitle: slug ? `/${slug}` : '',
      }
    },
  },
})
