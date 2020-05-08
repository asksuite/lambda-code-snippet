
# Lambda Code Snippet
  
## What is it?

Esse projeto é usado para fornecer uma base de funções [Lambda AWS](https://aws.amazon.com/pt/lambda/) nas quais possibilitam a execução de um trecho de código **(Node.js 10.x)** genérico e isolado.

## Setup  
  
Copy and rename the `.env.example` file to `.env`, filling your credentials of Google Translate API (Optional).  
  
### Development
  
Linting  
```bat  
npm run lint  
```  
or  
```bat  
npm run lint:fix  
```  
  
## Deploy  
Necessário ter configurado as seguintes variáveis de ambiente:
 - **AWS_ACCESS_KEY_ID**
 - **AWS_SECRET_ACCESS_KEY**
  
 ```bat  
npm run deploy
```  

Após realizar o deploy, você irá possuir as seguintes funções:

- lambda-code-snippet-executor_128
- lambda-code-snippet-executor_256
- lambda-code-snippet-executor_512
- lambda-code-snippet-executor_768
- lambda-code-snippet-executor_1024
- lambda-code-snippet-executor_1280

## API

| Field | Description |
|-- | -- |
| functionCode | body of function to execute |
| parameters | any data to use in function |

## Usage

Todas as funções possuem os mesmos parâmetros mas cada uma possui sua particularidade em memória reservada. 
Por exemplo: _lambda-code-snippet-executor_128_ possui 128MB de RAM. 


### Description of *functionCode*

o **functionCode** é encapsulado na seguinte função:
```
async function (parameters, context, require) {
    ${functionCode}
};
```

### Description of *context*

É um objeto que disponibiliza algumas funções úteis e recorrentes das funções. 

Atualmente é:

```
{
    "translateText": (textToTranslate: string, fromLanguage: string, toLanguage: string) => string;
}
```

### Description of *require*
require nativo do Node.Js. Possibilita importar qualquer biblioteca instalada no projeto.

**Available packages:**

| package | version |
| -- | -- |
| [axios](https://www.npmjs.com/package/axios) | ^0.19.2 |
| [bluebird](https://www.npmjs.com/package/bluebird) | ^3.7.2 |
| [google-translate](https://www.npmjs.com/package/google-translate) | ^3.0.0 |
| [json-web-crawler](https://www.npmjs.com/package/json-web-crawler) | ^0.8.1 |
| [lodash](https://www.npmjs.com/package/lodash) | ^4.17.15 |

#### #1 Example of invoke event
```javascript
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const functionName = 'lambda-code-snippet-executor_128';
const event = {
    parameters: {
      number1: 5,
      number2: 10,
    },
    functionCode: `
        return parameters.number1 + parameters.number2;
    `,
};

const params = {
  FunctionName: functionName,
  Payload: JSON.stringify(event),
};

const result = await lambda
    .invoke(params)
    .promise()
    .then(value => JSON.parse(value.Payload));

```
Expected value of *result* is: ``{ "data": 15 }`` 


#### #2 Example of use translateText
Require set env API_KEY_GOOGLE_TRANSLATE
```javascript
const event = {
    parameters: {
      phrase: 'Hi',
      from: 'en-us',
      to: 'pt-br',
    },
    functionCode: `
         return context.translateText(parameters.phrase, parameters.from, parameters.to);
    `,
};

```
Expected value of *result* is: ``{ "data": "Oi" }`` 

#### #3 Example of require 
Require set env API_KEY_GOOGLE_TRANSLATE
```javascript
const event = {
    parameters: {
      woeid: '455861',
    },
    functionCode: `
     const axios = require('axios');
     
     return axios({
         method: 'get',
         url: `https://api.hgbrasil.com/weather?woeid=${parameters.woeid}`,
     }).then(function (response) {
         return {
             ...response.data.results.forecast[2],
             city: response.data.results.city,
         };
     });
    `,
};

```
Expected value of *result* is: ``{ "data": "Oi" }`` 

## Powered by 

Imagem Asksuite
