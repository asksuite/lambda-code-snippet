const context = require('../context/index');

async function run(parameters, functionCode) {
  const mappedFunction = mountFunction(functionCode);

  console.log('mappedFunction', mappedFunction);

  try {
    const func = new Function(mappedFunction);
    return func
      .call(null)
      .call(null, parameters, context, require)
      .then((data) => ({ data }))
      .catch((error) => {
        throw {
          error: handleError(error),
        };
      });
  } catch (e) {
    throw {
      error: handleError(e),
    };
  }
}

function handleError(error) {
  if (error instanceof Error) {
    error = {
      exception: error.message,
    };
  }

  return error;
}

function mountFunction(functionCode) {
  return `{  
            return async function (parameters, context, require) {
                ${functionCode}
            };
        }
    `;
}

module.exports = {
  run,
};
