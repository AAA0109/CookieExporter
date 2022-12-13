export const domIsReady = async () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('DOMContentLoaded', () => resolve({}))
  })
}

export const downloadJSON = async (cookies) => {
  return new Promise((resolve, reject) => {
    var blob = new Blob([cookies], {type: "text/plain"});
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({ url: url, saveAs: true }, () => {
      resolve()
    });
  })
}

export const getTabId = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true}, tabs => {
      if (!tabs && tabs.length < 1) {
        return reject({})
      }

      resolve(tabs[0].id)
    })
  })
}

export const sendMessage = async (tabId, message) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, response => {
      console.log(response)
      if(!response) {
        return reject({})
      }

      resolve(response)
    })
  })
}
