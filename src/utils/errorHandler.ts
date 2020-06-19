import { ApolloError } from "apollo-server-fastify";

interface ErrorProps {
  error?: any;
  message?: string;
}

export default ({ error, message }: ErrorProps): ApolloError => {
  if (message) {
    return new ApolloError(message);
  }

  // Duplicate constraints
  if (error.code === "23505") {
    // Getting values inside parentheses
    const rxp = /\(([^)]+)\)/;
    const key = rxp.exec(error.detail);
    if (key) {
      return new ApolloError(`${key[1]} already exists`);
    }
  }

  // Foregin key
  if (error.code === "23503") {
    return new ApolloError("FOREIGN_KEY");
  }

  // Default
  return new ApolloError(error);
};
