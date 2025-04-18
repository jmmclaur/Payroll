class not_authorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
module.exports = {
  not_authorized,
};
