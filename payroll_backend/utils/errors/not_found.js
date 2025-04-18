class not_found extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
module.exports = {
  not_found,
};
