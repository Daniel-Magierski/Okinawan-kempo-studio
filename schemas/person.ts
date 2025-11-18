// schemas/person.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name:'person',
  title:'Osoba',
  type:'document',
  fields:[
    defineField({
      name:'name',
      title:'Imię i nazwisko',
      type:'string',
      validation:r=>r.required(),
    }),
    defineField({
      name:'rank',
      title:'Stopień / rola',
      type:'string',
    }),
    defineField({ name:'bio',   title:'Bio',              type:'localeText' }),

    defineField({
      name:'about',
      title:'Bio (EN)',
      type:'localeText', hidden:true
    }),
    defineField({
      name:'about_pl',
      title:'Bio (PL)',
      type:'localeText', hidden:true
    }),

    defineField({
      name:'photo',
      title:'Zdjęcie',
      type:'image',
      options:{hotspot:true},
    }),
  ],
})