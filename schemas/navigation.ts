// /schemas/navigation.ts
import {defineType, defineField} from 'sanity'
import {ListIcon, LinkIcon} from '@sanity/icons'

export default defineType({
  name: 'navigation',
  title: 'Nawigacja',
  type: 'document',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      initialValue: 'Główna nawigacja',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'items',
      title: 'Pozycje',
      type: 'array',
      of: [{type: 'navItem'}],
      options: {sortable: true},
    }),
  ],
})

export const navItem = defineType({
  name: 'navItem',
  title: 'Element nawigacji',
  type: 'object',
  icon: LinkIcon,
  fields: [
    // ——— LABEL ———
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',        // { en: string; pl?: string }
      validation: r => r.custom(val =>
        val?.en?.trim()
          ? true
          : 'Podaj przynajmniej wersję EN'
      ),
    }),

    defineField({
      name: 'layout',
      title: 'Układ',
      type: 'string',
      initialValue: 'link',
      options: {
        list: [
          {title: 'Link', value: 'link'},
          {title: 'Grupa (rozwijane)', value: 'group'},
        ],
      },
      validation: r => r.required(),
    }),

    defineField({
      name: 'groupLayout',
      title: 'Rodzaj grupy',
      type: 'string',
      initialValue: 'flyout',
      options: {
        list: [
          {title: 'Flyout', value: 'flyout'},
          {title: 'Mega menu', value: 'mega'},
        ],
      },
      hidden: ({parent}) => parent?.layout !== 'group',
    }),

    defineField({
      name: 'kind',
      title: 'Typ linku',
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          {title: 'Wewnętrzny (strona/wpis)', value: 'internal'},
          {title: 'Wbudowana trasa (app)',   value: 'static'},
          {title: 'Zewnętrzny URL',          value: 'external'},
        ],
      },
      hidden: ({parent}) => parent?.layout !== 'link',
      validation: r => r.required(),
    }),

    // AUTO-DZIECI
    defineField({
      name: 'autoChildren',
      title: 'Automatyczne podmenu',
      type: 'string',
      options: {
        list: [
          {title: 'Dojo → kraje/dojo', value: 'dojoByCountry'},
        ],
      },
      hidden: ({parent}) => parent?.layout !== 'group',
    }),

    // WEWNĘTRZNY DOKUMENT
    defineField({
      name: 'page',
      title: 'Dokument (gdy wewnętrzny)',
      type: 'reference',
      to: [{type: 'page'}, {type: 'event'}, {type: 'album'}, {type: 'dojo'}],
      hidden: ({parent}) =>
        !(parent?.layout === 'link' && parent?.kind === 'internal'),
      validation: r =>
        r.custom((val, ctx) =>
          ctx.parent?.layout === 'link' && ctx.parent?.kind === 'internal'
            ? (val ? true : 'Wskaż dokument')
            : true
        ),
    }),

    // Wbudowane trasy
    defineField({
      name: 'routeKey',
      title: 'Wbudowana trasa',
      type: 'string',
      options: {
        list: [
          {title: 'Wydarzenia', value: 'events'},  // => /wydarzenia
          {title: 'Dojo',      value: 'dojo'},    // => /dojo
          {title: 'Galeria',   value: 'album'},   // => /galeria
        ],
      },
      hidden: ({parent}) =>
        !(parent?.layout === 'link' && parent?.kind === 'static'),
      validation: r =>
        r.custom((val, ctx) =>
          ctx.parent?.layout === 'link' && ctx.parent?.kind === 'static'
            ? (val ? true : 'Wybierz trasę')
            : true
        ),
    }),

    // ZEWNĘTRZNY URL
    defineField({
      name: 'url',
      title: 'URL (gdy zewnętrzny)',
      type: 'url',
      hidden: ({parent}) =>
        !(parent?.layout === 'link' && parent?.kind === 'external'),
      validation: r =>
        r.custom((val, ctx) =>
          ctx.parent?.layout === 'link' && ctx.parent?.kind === 'external'
            ? (val ? true : 'Podaj URL')
            : true
        ),
    }),

    defineField({name: 'badge', title: 'Badge', type: 'string'}),

    // OPIS (mega menu) – wielojęzyczny
    defineField({
      name: 'description',
      title: 'Opis (mega menu)',
      type: 'localeText',      // { en, pl }
      rows: 2,
      hidden: ({parent}) =>
        !(parent?.layout === 'group' && parent?.groupLayout === 'mega'),
    }),

    defineField({
      name: 'linkTarget',
      title: 'Target',
      type: 'string',
      initialValue: '_self',
      options:{
        list:[
          {title:'To samo okno', value:'_self'},
          {title:'Nowe okno', value:'_blank'},
        ],
      },
      hidden: ({parent}) => parent?.layout !== 'link',
    }),

    defineField({
      name: 'nofollow',
      title: 'NoFollow',
      type: 'boolean',
      hidden: ({parent}) => parent?.layout !== 'link',
    }),

    defineField({
      name: 'visible',
      title: 'Widoczny',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'order',
      title: 'Kolejność',
      type: 'number',
    }),

    defineField({
      name: 'children',
      title: 'Podmenu',
      type: 'array',
      of: [{type: 'navItem'}],
      options: {sortable: true},
      hidden: ({parent}) => parent?.layout !== 'group',
    }),
  ],

  preview: {
    select: {
      label_en:  'label.en',
      label_pl:  'label.pl',
      layout:    'layout',
      kind:      'kind',
      slug:      'page->slug.current',
      routeKey:  'routeKey',
      url:       'url',
    },
    prepare({label_en, label_pl, layout, kind, slug, routeKey, url}) {
      const title = label_pl || label_en || '(bez etykiety)'
      let subtitle = layout === 'group' ? 'Grupa' : ''

      if (layout === 'link') {
        if (kind === 'internal') {
          subtitle = `/${slug ?? '—'}`
        } else if (kind === 'static') {
          if (routeKey === 'events')      subtitle = '/wydarzenia'
          else if (routeKey === 'dojo')   subtitle = '/dojo'
          else if (routeKey === 'album')  subtitle = '/galeria'
          else                            subtitle = '—'
        } else if (kind === 'external') {
          subtitle = url ?? '—'
        }
      }

      return {title, subtitle}
    },
  },
})