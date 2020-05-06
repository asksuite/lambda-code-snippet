const crawl = require('json-web-crawler');
const axios = require('axios');

return axios({
  method: 'get',
  url: parameters.url,
}).then(function (response) {
  return crawl(response.data, {
    container: '.cards .card',
    type: 'list',
    crawl: {
      name: {
        get: 'text',
        elem: 'div.cont > a:nth-child(1) > h2',
      },
      subtitle: {
        get: 'text',
        elem: '.desc',
      },
      price: {
        get: 'text',
        elem: '.price-new',
      },
      data: {
        get: 'text',
        elem: '.data',
      },
      link: {
        get: 'href',
        elem: '.valor',
      },
      img: {
        get: 'src',
        elem: 'img',
      },
    },
  }).then((item) => {
    return item;
  });
});
