export class CustomError extends Error {
    code: string;
    override message: string;
  
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
      this.message = message;
  
      // Set the prototype explicitly to maintain instanceof checks
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }