import { GraphQLClient } from 'graphql-request';
import { WORDPRESS_GRAPHQL_URL } from './config';

/**
 * GraphQL Client singleton for WordPress GraphQL endpoint
 */
export const client = new GraphQLClient(WORDPRESS_GRAPHQL_URL);
