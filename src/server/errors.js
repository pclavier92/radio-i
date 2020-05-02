class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.message = message;
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
    this.status = 400;
  }
}
class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PermissionError';
    this.message = message;
    this.status = 400;
  }
}
class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
    this.message = message;
    this.status = 500;
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  PermissionError,
  DatabaseError
};
