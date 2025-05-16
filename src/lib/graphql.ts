export const sendMessage = /* GraphQL */ `
  mutation SendMessage($userId: ID!, $content: String!, $role: String!) {
    sendMessage(userId: $userId, content: $content, role: $role) {
      userId
      content
      role
    }
  }
`;
export const getMessages = /* GraphQL */ `
  query GetMessages($userId: ID!) {
    getMessages(userId: $userId) {
      id
      content
      role
      timestamp
    }
  }
`;
