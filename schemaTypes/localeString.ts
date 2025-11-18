import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'localeString',
  title: 'Tekst (wielojęzyczny)',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: r => r.required().min(1),
    }),
    defineField({
      name: 'pl',
      title: 'Polski',
      type: 'string',
    }),
  ],
})