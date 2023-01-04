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

export const getTabUrl = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs && tabs.length < 1) return reject({})
      resolve(tabs[0].url)
    })
  })
}
export const getOriCookies = async (o_url = '') => {
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

export const getCookies = async (o_url = '') => {
  return new Promise((resolve, reject) => {
    let url = new URL(o_url);
    let sps = url.origin.split('.');
    sps.splice(0, sps.length - 2);
    const last_url = sps[0] + '.' + sps[1];
    chrome.cookies.getAll({ }, cookies => {
      const ret = cookies.filter(cookie => {
        console.log(cookie.domain, last_url)
        if (cookie.domain.includes(last_url)) return true;
        return false;
      });
      chrome.cookies.getAll({ url: url.origin }, cookies => {
        ret.push(...cookies);
        resolve({ url: url.href, cookies: ret });
      })
    });
  })
}

export const loadCookies = async (data) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
      if (!tabs && tabs.length < 1) return reject({})
      for (let i = 0; i < data.length; i ++) {
        const d = data[i];
        let o_url = new URL(data[0].url);
        const cookies = d.cookies;
        for (let i = 0; i < cookies.length; i ++) {
          try {
            cookies[i].url = getUrlForCookie(cookies[i]);
            delete cookies[i]['hostOnly'];
            delete cookies[i]['session'];
            console.log(cookies[i]);
            await chrome.cookies.set(cookies[i]);
          } catch (ex) {
            console.log(ex);
          }
        }
      }
      setTimeout(() => {
        chrome.tabs.update(tabs[0].id, {
          url: data[0].url
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
  for (let i = 0; i < data.length; i ++) {
    const d = data[i];
    const o_url = new URL(d.url);
    const d_cookies = await getOriCookies(o_url.origin);
    const cookies = d_cookies.cookies;
    for (let i = 0; i < cookies.length; i ++) {
      var cookie = cookies[i];
      cookie.url = getUrlForCookie(cookie);
      await removeCookie(cookie);
    }
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