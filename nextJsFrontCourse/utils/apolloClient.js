import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"

const httpLink = new HttpLink({
   uri: "http://localhost:3000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
   // const token = localStorage.getItem("token")

   operation.setContext({
      headers: {
         //  Authorization: token ? `Bearer ${token}` : "",
         "Content-Type": "application/json",
         "X-Parse-Application-Id": "myAppId123",
         "X-Parse-Master-Key": "myMasterKey123"
      },
   });

   return forward(operation);
});

const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(),
});

export default client