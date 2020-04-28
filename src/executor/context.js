const axios = require('axios');
const config = require('../../config');

function translateText(text, from, to) {
  return axios({
    method: 'POST',
    url: `${config.CONTROL_URL}/api/directTranslation`,
    data: { text, to, from },
  }).then((response) => response.data.result);
}

module.exports = {
  translateText,
};
