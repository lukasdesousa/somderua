export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedRequestError extends Error {
  constructor(message = "Unauthorized abandoned-cart recovery request") {
    super(message);
    this.name = "UnauthorizedRequestError";
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export class EmailDeliveryError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
  ) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

export class UnsupportedMediaTypeError extends Error {
  constructor(message = "Content-Type must be application/json") {
    super(message);
    this.name = "UnsupportedMediaTypeError";
  }
}

export class MalformedJsonError extends Error {
  constructor(message = "Request body must be valid JSON") {
    super(message);
    this.name = "MalformedJsonError";
  }
}
