// sanity/schemas/sections/sidePanelSection.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'sidePanelSection',
  title: 'Section with side panel',
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
    validation: r => r.required(),
    }),

    defineField({
      name: 'sidebarType',
      title: 'Sidebar type',
      type: 'string',
      options: {
        list: [
          {title: 'Image grid', value: 'images'},
          {title: 'YouTube video', value: 'youtube'},
          {title: 'Button / link', value: 'button'},
        ],
        layout: 'radio',
      },
      initialValue: 'images',
      validation: r => r.required(),
    }),
 defineField({
      name: 'textAlign',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Centered', value: 'center'},
          {title: 'Justified', value: 'justify'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),

    // image grid
    defineField({
      name: 'images',
      title: 'Images (grid)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: 'Alt', type: 'localeString'}],
        },
      ],
      hidden: ({parent}) => parent?.sidebarType !== 'images',
    }),

    // YouTube
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      hidden: ({parent}) => parent?.sidebarType !== 'youtube',
    }),

    // Button / link
    defineField({
      name: 'buttonLabel',
      title: 'Button label',
      type: 'localeString',
      hidden: ({parent}) => parent?.sidebarType !== 'button',
    }),
    defineField({
      name: 'buttonHref',
      title: 'Button URL',
      type: 'url',
      hidden: ({parent}) => parent?.sidebarType !== 'button',
    }),
  ],
})