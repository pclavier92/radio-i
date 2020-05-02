const info = (req, message) => {
  const { method, path } = req;
  console.log(`[Method: ${method}] [Path: ${path}] [Info: ${message}]`);
};

const error = (req, status, message) => {
  const { method, path } = req;
  console.log(
    `[Method: ${method}] [Path: ${path}] [Error: [STATUS: ${status}] [MESSAGE: ${message}]]`
  );
};

module.exports = { info, error };
