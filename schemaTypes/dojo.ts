import {defineType, defineField} from 'sanity'
import {PinIcon, LinkIcon, PlayIcon} from '@sanity/icons'

const WEEKDAYS = ['Pon','Wt','Śr','Czw','Pt','Sob','Nd'] as const
const LINK_KINDS = [
  {title:'Strona WWW', value:'website'},
  {title:'Facebook',  value:'facebook'},
  {title:'Instagram', value:'instagram'},
  {title:'YouTube',   value:'youtube'},
  {title:'TikTok',    value:'tiktok'},
  {title:'Inne',      value:'other'},
] as const

export default defineType({
  name: 'dojo',
  title: 'Dojo',
  type: 'document',
  icon: PinIcon,
  fields: [
    // NAZWA – lokalizowana
    defineField({
      name:'title',
      title:'Nazwa dojo',
      type:'localeString',
      validation: r => r.custom(val =>
        val?.en ? true : 'Podaj nazwę dojo po angielsku'
      ),
    }),
    defineField({
  name: 'about',
  title: 'Opis dojo',
  type: 'localeText',                   // en/pl, bogaty tekst (obrazki, align)
  description: 'Wyświetli się na stronie dojo pod nagłówkiem.',
}),

    // slug z EN
    defineField({
  name:'slug',
  title:'Slug',
  type:'slug',
  options:{
    source: (doc) => doc.title?.en,
    maxLength: 80,
  },
  validation: r => r.required(),
}),

    // Kraj / miasto / adres – lokalizowane
    defineField({
      name:'country',
      title:'Kraj',
      type:'localeString',
      validation:r=>r.custom(val =>
        val?.en ? true : 'Podaj nazwę kraju po angielsku'
      ),
    }),
    defineField({
      name:'city',
      title:'Miasto',
      type:'localeString',
      validation:r=>r.custom(val =>
        val?.en ? true : 'Podaj nazwę miasta po angielsku'
      ),
    }),
    defineField({
      name:'address',
      title:'Adres',
      type:'localeString',
    }),

    // Mapy – 1-języczne, bo to tylko URL / embed
    defineField({
      name:'mapsUrl',
      title:'Link do pinezki (Google Maps – Udostępnij)',
      type:'url',
      description:'Może być skrót maps.app.goo.gl albo pełny link google.com/maps/…',
    }),
    defineField({
      name:'mapsEmbedSrc',
      title:'Google Maps – „Osadź mapę” (SRC lub cały iframe)',
      type:'text',
      rows:2,
      description:'Wklej cały <iframe …> lub samo src=… — front sobie poradzi.',
    }),

    // Kontakt
    defineField({name:'email', title:'E-mail', type:'string'}),
    defineField({name:'phone', title:'Telefon', type:'string'}),

    // Linki WWW / social
    defineField({
      name:'links',
      title:'Linki (WWW / social media)',
      type:'array',
      of:[{
        type:'object',
        icon: LinkIcon,
        fields:[
          defineField({
            name:'kind',
            title:'Rodzaj',
            type:'string',
            options:{list: LINK_KINDS},
            validation:r=>r.required(),
          }),
          defineField({
            name:'label',
            title:'Etykieta (opcjonalnie)',
            type:'localeString',             // ← też lokalizowana
          }),
          defineField({
            name:'url',
            title:'URL',
            type:'url',
            validation:r=>r.required().uri({allowRelative:false, scheme:['http','https']}),
          }),
        ],
        preview:{
          select:{kind:'kind', label:'label.en', url:'url'},
          prepare:({kind,label,url}) => ({
            title: label || kind,
            subtitle: url,
          }),
        },
      }],
    }),

    // Filmy YouTube – tytuł także lokalizowany
    defineField({
      name:'videos',
      title:'Filmy (YouTube)',
      type:'array',
      description:'Wklej link z YouTube (watch, share albo youtu.be).',
      of:[{
        type:'object',
        icon: PlayIcon,
        fields:[
          defineField({
            name:'title',
            title:'Tytuł',
            type:'localeString',
          }),
          defineField({
            name:'url',
            title:'YouTube URL',
            type:'url',
            validation:r=>r.required().regex(
              /(youtu\.be\/|youtube\.com\/(watch\?v=|shorts\/|embed\/))/,
              {name:'YouTube URL', invert:false, message:'Podaj poprawny URL YouTube'},
            ),
          }),
        ],
        preview:{
          select:{title:'title.en', url:'url'},
          prepare:({title,url}) => ({
            title: title || 'YouTube',
            subtitle: url,
          }),
        },
      }],
    }),

    // Grafik – godziny 1-języczne, ale "Uwagi" lokalizowane
    defineField({
      name:'schedule',
      title:'Grafik',
      type:'array',
      of:[{
        type:'object',
        fields:[
          defineField({
            name:'weekday',
            title:'Dzień',
            type:'localeString',
            validation: r =>
    r.custom(val =>
      val?.en ? true : 'Podaj dzień tygodnia po angielsku'),
          }),
          defineField({
            name:'time',
            title:'Godziny',
            type:'string',
            validation:r=>r.required(),
          }),
          defineField({
            name:'note',
            title:'Uwagi',
            type:'localeString',
          }),
        ],
      }],
    }),

    // Instruktorzy
   defineField({
  name:'instructors',
  title:'Instruktorzy',
  type:'array',
  of:[{
    type:'reference',
    to: [{type:'person'}],
  }],
}),

    // Obrazy
    defineField({
      name:'hero',
      title:'Zdjęcie główne',
      type:'image',
      options:{hotspot:true},
      fields:[{name:'alt', title:'Alt', type:'localeString'}],
    }),
    defineField({
      name:'gallery',
      title:'Galeria',
      type:'array',
      of:[{
        type:'image',
        options:{hotspot:true},
        fields:[{name:'alt', title:'Alt', type:'localeString'}],
      }],
    }),

    defineField({
      name:'published',
      title:'Opublikowane',
      type:'boolean',
      initialValue:true,
    }),
  ],

  preview: {
    select: {
      title: 'title.en',
      city: 'city.en',
      country: 'country.en',
      media: 'hero',
    },
    prepare({title, city, country, media}) {
      return {
        title: title || '(bez nazwy)',
        subtitle: [city, country].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})