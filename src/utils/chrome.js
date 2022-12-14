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

export const getCookies = async (o_url = '') => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs && tabs.length < 1) return reject({})
      let url = new URL(o_url || tabs[0].url);
      console.log(url);
      chrome.cookies.getAll({ url: url.origin }, cookies => {
        resolve({ url: url.href, cookies });
      });
    });
  })
}

export const loadCookies = async (data) => {
  const cookies = data.cookies;
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      if (!tabs && tabs.length < 1) return reject({})
      let url = new URL(tabs[0].url);
      let o_url = new URL(data.url);
      console.log(cookies, url.origin)
      for (let i = 0; i < cookies.length; i ++) {
        cookies[i].url = o_url.origin;
        delete cookies[i]['hostOnly'];
        delete cookies[i]['session'];
        chrome.cookies.set(cookies[i]);
      }
      setTimeout(() => {
        chrome.tabs.update(tabs[0].id, {
          url: data.url
        }, () => resolve());
      }, 100);
    });
  })
}

function getUrlForCookie(cookie) {
  var url = '';
  // get prefix, like https://www.
  url += cookie.secure ? 'https://' : 'http://';
  url += cookie.domain.charAt(0) == '.' ? 'www' : '';

  // append domain and path
  url += cookie.domain;
  url += cookie.path;

  return url;
}

export const removeCookie = async cookie => {
  return new Promise((resolve, reject) => {
    chrome.cookies.remove({
        url: cookie.url,
        name: cookie.name,
        storeId: cookie.storeId,
    }, () => resolve());
  })
}

export const clearCookies = async (data) => {
  const o_url = new URL(data.url);
  const d_cookies = await getCookies(o_url.origin);
  const cookies = d_cookies.cookies;
  for (let i = 0; i < cookies.length; i ++) {
    var cookie = cookies[i];
    cookie.url = getUrlForCookie(cookie);
    await removeCookie(cookie);
  }
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
