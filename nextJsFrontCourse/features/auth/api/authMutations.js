import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register(
    $salutation: String!
    $firstName: String!
    $lastName: String!
    $organization: String!
    $email: String!
    $password: String!
    $position: String!
  ) {
    register(
      salutation: $salutation
      firstName: $firstName
      lastName: $lastName
      organization: $organization
      email: $email
      password: $password
      position: $position
    ) {
      objectId
      sessionToken
    }
  }
`;
