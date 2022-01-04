class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class NotLoggedIn extends ExtendableError {
    constructor() {
        super("You must be logged in to do this.");
    }
}

class Unauthorized extends ExtendableError {
    constructor() {
        super("You do not have permission to do that.")
    }
}

class NotFound extends ExtendableError {
    constructor(object) {
        super(`${object} not found.`);
    }
}

module.exports = {
    NotLoggedIn: NotLoggedIn,
    Unauthorized: Unauthorized,
    NotFound: NotFound,
}