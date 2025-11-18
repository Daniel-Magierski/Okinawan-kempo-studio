// schemas/socialLinks.ts
import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

const PLATFORMS = [
  {title: 'Facebook',  value: 'facebook'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'YouTube',   value: 'youtube'},
  {title: 'TikTok',    value: 'tiktok'},
  {title: 'Inne',      value: 'other'},
]

export default defineType({
  name: 'socialLinks',
  title: 'Social links',
  type: 'document',
  icon: LinkIcon,
  __experimental_omnisearch_visibility: false,

  fields: [
    defineField({
      name: 'items',
      title: 'Profile',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'platform',
            title: 'Platform',
            type: 'string',
            options: {list: PLATFORMS},
            validation: r => r.required(),
          }),
          defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            validation: r =>
              r.required().uri({scheme: ['http','https']}),
          }),
          defineField({
            name: 'handle',
            title: 'Name / handle (opcional)',
            type: 'string',
          }),
          defineField({
            name: 'visible',
            title: 'Visible',
            type: 'boolean',
            initialValue: true,
          }),
          defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0,
          }),
        ],

        // Ładne preview w wierszu listy
        preview: {
          select: {
            platform: 'platform',
            handle: 'handle',
            url: 'url',
            visible: 'visible',
          },
          prepare({platform, handle, url, visible}) {
            return {
              title: handle || platform || '(bez nazwy)',
              subtitle: `${visible === false ? '⛔ ukryty • ' : ''}${url ?? ''}`,
            }
          },
        },
      }],
      options: {sortable: true},
    }),
  ],

  // Preview całego dokumentu "Sociale"
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const names = (items ?? [])
        .map((i: any) => i.handle || i.platform)
        .filter(Boolean)
        .join(', ')
      return {
        title: 'Social media links',
        subtitle: names || 'Profile empty',
      }
    },
  },
})