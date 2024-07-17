import Cookies from 'js-Cookies';

export async function csrfFetch(url, options = {}){

  //set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';

  //set options.header to an empty object if there is no headers
  options.header = options.header || {};

  //if options.method is not 'GET'
    //set "Content-Type": to be the current content type (if provided) OR default to "application/JSON"
    //set "XSRF-TOKEN": "value of xsrfTokenCookie"
  if(options.method.toUpperCase() !== 'GET'){
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSFR-TOKEN');
  }
  
  //call the default window's fetch with the url and the options passed in 
  const result = await window.fetch(url, options);

  //if res.status is >= 400 throw result error as a response
  if (result.status >= 400) throw result;

  //all things pass and no errors are found: return response
  return result
}