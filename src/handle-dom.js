import { getMessageResource, getMessageFrom, getMessageData } from './utils/message'
import { POPUP_SCRIPT_ID } from './constants/from.modules'
import { GET_SEARCH_TERM, SET_GOOGLE_BACKGROUND, EXPORT_COOKIE, IMPORT_COOKIE } from './constants/actions'
import { getGoogleSearchTerm, setGoogleBackground, exportCookies, importCookies } from './utils/actions'

chrome.runtime.onMessage.addListener((message, sender, response) => {
  console.log(message);
  const from = getMessageFrom(message)
  if (from === POPUP_SCRIPT_ID) {
    const resource = getMessageResource(message)

    switch (resource) {
      case GET_SEARCH_TERM:
        const searchTerm = getGoogleSearchTerm()
        response(searchTerm)
        break

        case SET_GOOGLE_BACKGROUND:
          const color = getMessageData(message)
          setGoogleBackground(color)
          break
        case EXPORT_COOKIE:
          const e_cookies = exportCookies();
          response(e_cookies);
          break;
        case IMPORT_COOKIE:
          const i_cookies = getMessageData(message);
          console.log(i_cookies);
          break;
        default:
          response('Received Message');
          break;
      }
  }

})
