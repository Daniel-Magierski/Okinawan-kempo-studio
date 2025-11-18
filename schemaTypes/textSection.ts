// sanity/schemas/sections/textSection.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'textSection',
  title: 'Text section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localeText',
      validation: r =>
        r.custom((value) => {
          if (!value?.en && !value?.pl) {
            return 'Wpisz tekst w co najmniej jednym języku'
          }
          return true
        }),
    }),
     defineField({
      name: 'textAlign',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left',     value: 'left'},
          {title: 'Centered', value: 'center'},
          {title: 'Justified',value: 'justify'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    // defineField({
    //   name: 'sideImage',
    //   title: 'Side image',
    //   type: 'image',
    //   options: {hotspot: true},
    // }),
  ],
})