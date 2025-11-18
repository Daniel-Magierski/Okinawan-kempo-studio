import album from './album'
import events from './events'
import navigation, {navItem} from './navigation'
import socialLinks from './socialLinks'       
import contactSettings from './contactSettings'
import person from './person'
import dojo from './dojo'
import localeString from './localeString'
import localeText from './localeText'
import page from './page'
import heroSection from './sections/heroSection'
import textSection from './sections/textSection'
import sidePanelSection from './sections/sidePanelSection'

export const schemaTypes = [
localeString,
  localeText,
  album,
  events,
  page,
  navItem,
  navigation,
  socialLinks,          
  contactSettings,  
  dojo,
  person,
  heroSection,
  textSection,
  sidePanelSection
  //imageGridSection,
  //videoSection,
  // calloutSection,    
]

export default schemaTypes