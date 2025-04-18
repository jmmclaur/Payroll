class bad_request extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
module.exports = {
  bad_request,
};
