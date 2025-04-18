class server_error extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
module.exports = {
  server_error,
};
