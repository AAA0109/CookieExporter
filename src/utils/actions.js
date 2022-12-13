export const getGoogleSearchTerm = () => {
  return document.querySelector('[name="q"]').value
}

export const setGoogleBackground = (color) => {
  const html = document.querySelector('html')
  html.classList = []
  html.style = `background: ${color}!important`
}

export const exportCookies = () => {
  var cookieData = document.cookie.split(';').map(function (c) {
    var i = c.indexOf('=');
    return [c.substring(0, i), c.substring(i + 1)];
  });
  cookieData = JSON.stringify(JSON.stringify(cookieData));
  console.log(cookieData);
  return cookieData;
}

export const importCookies = () => {
  var cookieData = JSON.parse(json_string);
  document.cookie = '';
  cookieData.forEach(function (arr) {
    document.cookie += arr[0] + '=' + arr[1] + ';';
  });
}