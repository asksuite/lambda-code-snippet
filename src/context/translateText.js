const googleTranslate = require('google-translate')(process.env.API_KEY_GOOGLE_TRANSLATE, {});

function translateText(text, from, to) {
  const { source, target } = transformLanguageToGoogleFormat(from, to);
  return new Promise((resolve, reject) => {
    googleTranslate.translate(text, source, target, function (err, translation) {
      if (err) {
        reject(err);
        return;
      }

      const { translatedText } = translation;
      resolve(translatedText);
    });
  });
}

function transformLanguageToGoogleFormat(from, to) {
  return {
    source: from ? from.substring(0, 2) : null,
    target: to ? to.substring(0, 2) : null,
  };
}

module.exports = translateText;
