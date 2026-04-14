import { gql } from '@apollo/client';

export const GET_SUBSCRIBERS = gql`
  query GetSubscribers {
    getSubscribers {
      id
      email
      isActive
    }
  }
`;

export const DELETE_SUBSCRIBER = gql`
  mutation DeleteSubscriber($email: String!) {
    deleteSubscriber(email: $email)
  }
`;

export const SEND_NEWSLETTER = gql`
  mutation SendNewsletter($input: SendNewsletterInput!) {
    sendNewsletter(input: $input) {
      sent
      failed
    }
  }
`;
