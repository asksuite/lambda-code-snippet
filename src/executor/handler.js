const runner = require('./runner');

async function handler(event) {
  const { parameters, functionCode } = event;

  console.log('functionCode', functionCode);
  console.log('parameters', parameters);

  return runner
    .run(parameters, functionCode)
    .then((response) => {
      console.log('result', response);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    })
    .catch((response) => {
      console.log('error', response);
      return {
        statusCode: 400,
        body: JSON.stringify(response),
      };
    });
}

module.exports.handler = handler;
