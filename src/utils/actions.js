export const getGoogleSearchTerm = () => {
  return document.querySelector('[name="q"]').value
}

export const setGoogleBackground = (color) => {
  const html = document.querySelector('html')
  html.classList = []
  html.style = `background: ${color}!important`
}

export const clearCookies = () => {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      console.log(cookie)
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export const exportCookies = () => {
  var cookieData = document.cookie.split(';').map(function (c) {
    var i = c.indexOf('=');
    return [c.substring(0, i), c.substring(i + 1)];
  });
  cookieData = JSON.stringify(cookieData);
  return cookieData;
}

export const importCookies = (cookies) => {
  var cookieData = JSON.parse(cookies);
  let cookie = '';
  for (let i = 0; i < cookieData.length; i ++) {
    const arr = cookieData[i];
    cookie += arr[0] + '=' + arr[1] + ';';
  }
  console.log(cookie)
  document.cookie = cookie;
}