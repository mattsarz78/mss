import { GraphQLError } from 'graphql';

export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

export class BaseError extends GraphQLError {
  constructor(message: string, code: ErrorCode, originalError?: Error) {
    super(message, {
      extensions: {
        code,
        timestamp: new Date().toISOString(),
        ...(originalError && {
          originalError: {
            message: originalError.message,
            stack: process.env.NODE_ENV === 'development' ? originalError.stack : undefined
          }
        })
      }
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ErrorCode.NOT_FOUND, originalError);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ErrorCode.BAD_REQUEST, originalError);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ErrorCode.DATABASE_ERROR, originalError);
  }
}

export const handleError = (error: unknown): GraphQLError => {
  if (error instanceof GraphQLError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
      return new DatabaseError('Database operation failed', error);
    }

    // Generic error handling
    return new BaseError(error.message, ErrorCode.INTERNAL_SERVER, error);
  }

  return new BaseError('An unknown error occurred', ErrorCode.INTERNAL_SERVER);
};
