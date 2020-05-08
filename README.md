
# Lambda Code Snippet
  
## What is it?

This project is used to provide a base of functions in [Lambda AWS](https://aws.amazon.com/pt/lambda/) which it is possible to execute a generic, scalable and isolated piece of code **(Node.js 10.x)**.

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

Executing tests  
```bat  
npm run test
```  
  
## Deploy  
It's necessary to have configured the following environment variables:
*You can configure these variables via the .env file*
 - **AWS_ACCESS_KEY_ID**
 - **AWS_SECRET_ACCESS_KEY**

 ```bat  
npm run deploy
```  

After deploying, you will have the following functions:

- lambda-code-snippet-executor_128
- lambda-code-snippet-executor_256
- lambda-code-snippet-executor_512
- lambda-code-snippet-executor_768
- lambda-code-snippet-executor_1024
- lambda-code-snippet-executor_1280

## API

| Field | Type of Data | Description |
|-- | -- | -- |
| functionCode | string | body of function to execute |
| parameters | object or array | any data to use in function |

## Usage

All functions have the same entry parameters, but each has its particularity in reserved memory.
Example: _lambda-code-snippet-executor_128_ has 128MB of RAM. 

### Description of *functionCode*

**functionCode** is encapsulated and You can use any argument available in the function.

```
async function (parameters, context, require) {
    ${functionCode}
};
```

### Description of *parameters*

It is the value sent by **event** to be made available when executing the function.

### Description of *context*

It is an object that has some useful functions. See the **context** structure below:

```
{
    "translateText": (textToTranslate: string, fromLanguage: string, toLanguage: string) => string;
}
```

### Description of *require*

Native require of Node.Js. It makes it possible to import any package installed in the project. **See below available packages:**

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
Required env API_KEY_GOOGLE_TRANSLATE

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

```javascript
const event = {
    parameters: {},
    functionCode: `
     const axios = require('axios');
     
     return axios({
         method: 'get',
         url: 'https://api.hgbrasil.com/weather?woeid=455861',
     }).then(function (response) {
         return {
             ...response.data.results.forecast[2],
             city: response.data.results.city,
         };
     });
    `,
};
```

## Powered by 

![Asksuite](http://images.asksuite.com/logo-github.png)

## Contributors

We don't have any contributors yet :(
