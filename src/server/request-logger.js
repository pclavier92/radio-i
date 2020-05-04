const info = (req, message) => {
  const { method, path } = req;
  console.log(`[Method: ${method}] [Path: ${path}] [Info: ${message}]`);
};

const error = (req, e) => {
  const { method, path } = req;
  console.log(
    `[Method: ${method}] [Path: ${path}] [Error: [STATUS: ${e.status}] [MESSAGE: ${e.message}] [STACKTRACE: ${e.stack}]]`
  );
};

module.exports = { info, error };
