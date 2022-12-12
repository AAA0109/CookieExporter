console.log("hello background");
import { ChromeRuntimeMessage } from './types/base';

//(async () => {
// Contents側からの受信イベント
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    // Revole Token
    if (request.type == ChromeRuntimeMessage.REVOKE_AUTH_TOKEN){
      return true;
    }

    sendResponse();
    return
  }
);
//})();