export function $(id) {
  return document.getElementById(id);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function getQueryString(params) {
  let queryString = "";

  Object.keys(params).forEach((key) => {
    if (params[key]) {
      queryString += `${key}=${params[key]}&`;
    }
  });

  return queryString;
}
