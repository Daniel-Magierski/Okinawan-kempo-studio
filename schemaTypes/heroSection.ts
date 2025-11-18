// sanity/schemas/sections/heroSection.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'localeString',
    }),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})