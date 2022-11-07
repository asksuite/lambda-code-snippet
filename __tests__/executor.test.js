require('dotenv').config();
const { handler } = require('../src/executor/handler');

const mountSuccessResult = (data) => ({
  statusCode: 200,
  body: JSON.stringify(data),
});

const mountErrorResult = (data) => ({
  statusCode: 400,
  body: JSON.stringify(data),
});

describe('Executor test', () => {
  it('test function 1', async () => {
    const result = await handler({
      parameters: {
        test: 5,
        test2: 10,
      },
      functionCode: `
          return parameters.test + parameters.test2;
      `,
    });

    expect(result).toEqual(
      mountSuccessResult({
        data: 15,
      }),
    );
  });

  it('test function 2 - with axios', async () => {
    const result = await handler({
      parameters: {
        url: 'https://reqres.in/api/users?page=2',
      },
      functionCode: `
          const axios = require('axios');
          
          return axios({
            method: 'GET',
            url: parameters.url,
          })
          .then(function (response) {
            return response.status;
          });
      `,
    });

    expect(result).toEqual(
      mountSuccessResult({
        data: 200,
      }),
    );
  });

  it('test function 3 - dont require lodash', async () => {
    const result = await handler({
      parameters: {
        array: [1, 2, 3],
      },
      functionCode: `
          return _.chain(parameters.array)
              .map((i) => i * i)
              .sum()
              .value();
      `,
    });

    expect(result).toEqual(
      mountErrorResult({
        error: {
          exception: '_ is not defined',
        },
      }),
    );
  });

  it('test function 4 - with lodash ', async () => {
    const result = await handler({
      parameters: {
        array: [1, 2, 3],
      },
      functionCode: `
          const _ = require('lodash');
      
          return _.chain(parameters.array)
              .map((i) => i * i)
              .sum()
              .value();
      `,
    });

    expect(result).toEqual(
      mountSuccessResult({
        data: 14,
      }),
    );
  });

  it('test function 5 - with bluebird', async () => {
    const result = await handler({
      parameters: {
        array: [5, 3, 2],
      },
      functionCode: `
          const PromiseBlue = require('bluebird');
          
          const result = await PromiseBlue.map(
              parameters.array,
              item => Math.pow(item, item),
              {concurrency: 1},
          );

          return result;
      `,
    });

    expect(result).toEqual(
      mountSuccessResult({
        data: [3125, 27, 4],
      }),
    );
  });

  it('test function 6 - code error', async () => {
    const result = await handler({
      parameters: {
        value: 'value-of-parameter',
      },
      functionCode: `
          return {
              "companyId": parameters.value;
          };
      `,
    });

    expect(result).toEqual(
      mountErrorResult({
        error: {
          exception: `Unexpected token ';'`,
        },
      }),
    );
  });

  it('test function 7 - custom error', async () => {
    const result = await handler({
      parameters: {
        value: 'value-of-parameter',
      },
      functionCode: `
          return Promise.reject({
              "customError": {
                  "value": parameters.value,
                  "message": "Company don't exists",                    
              },
          });
      `,
    });

    expect(result).toEqual(
      mountErrorResult({
        error: {
          customError: {
            value: 'value-of-parameter',
            message: "Company don't exists",
          },
        },
      }),
    );
  });

  it('test function 8 - context - translate', async () => {
    const result = await handler({
      parameters: {},
      functionCode: `
          return context.translateText('Hi', 'en-us', 'pt-br');
      `,
    });

    expect(result).toEqual(
      mountSuccessResult({
        data: 'Oi',
      }),
    );
  });

  it('test function 9 - context - invalid translate', async () => {
    const result = await handler({
      parameters: {},
      functionCode: `
          return context.translateText('Hi', 'ping', 'pong');
      `,
    });

    expect(JSON.parse(result.body).error).not.toBeNull();
  });
});
