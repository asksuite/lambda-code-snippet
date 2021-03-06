const { handler } = require('../src/executor/handler');
const fs = require('fs');

async function run() {
  const text = fs.readFileSync('dev-function.js', 'utf8');

  const result = await handler({
    parameters: {
      url: 'https://www.triptri.com.br/agenda',
    },
    functionCode: text,
  });

  console.log('result', result);
}

run();
