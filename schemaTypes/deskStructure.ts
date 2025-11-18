// studio-okinawan-kempo/deskStructure.ts
import type {StructureResolver} from 'sanity/structure'
import {
  CalendarIcon,
  ImagesIcon,
  DocumentIcon,
  EyeOpenIcon,
  ListIcon,
  EnvelopeIcon,
  FaceHappyIcon
} from '@sanity/icons'

const deskStructure: StructureResolver = (S, {schema}) => {
  const items: any[] = []

  // Singletons
  items.push(
    S.listItem()
      .title('Nawigacja')
      .icon(ListIcon)
      .child(
        S.editor()
          .id('navigation')
          .schemaType('navigation')
          .documentId('navigation')
      )
  )

  if (schema.get('contactSettings')) {
    items.push(
      S.listItem()
        .title('Kontakt')
        .icon(EnvelopeIcon) // zamiast PhoneIcon
        .child(
          S.editor()
            .id('contactSettings')
            .schemaType('contactSettings')
            .documentId('contactSettings')
        )
    )
  }

  if (schema.get('socialLinks')) {
    items.push(
      S.listItem()
        .title('Sociale')
        .icon(EyeOpenIcon) // zamiast EarthGlobeIcon (dla pewności zgodności)
        .child(
          S.editor()
            .id('socialLinks')
            .schemaType('socialLinks')
            .documentId('socialLinks')
        )
    )
  }

  // Listy typów
  if (schema.get('event')) {
    items.push(
      S.listItem()
        .title('Wydarzenia')
        .icon(CalendarIcon)
        .child(
          S.documentTypeList('event')
            .title('Wydarzenia')
            .defaultOrdering([{field: 'date', direction: 'desc'}])
            .filter('_type == "event"')
        )
    )
  }

  if (schema.get('album')) {
    items.push(
      S.listItem()
        .title('Galerie (Albumy)')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('album')
            .title('Galerie')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
            .filter('_type == "album"')
        )
    )
  }

  if (schema.get('page')) {
    items.push(
      S.listItem()
        .title('Strony')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page')
            .title('Strony')
            .filter('_type == "page"')
        )
    )
  }
  

  // Fallback bez duplikatów singletonów i pluginów
  const HIDE = new Set([
    'navigation',
    'contactSettings',
    'socialLinks',
    'event',
    'album',
    'page',
    'media.tag',
    'sanity.imageAsset',
  ])

  items.push(...S.documentTypeListItems().filter(li => !HIDE.has(String(li.getId()))))

  return S.list().title('Zawartość').items(items)
}

export default deskStructure