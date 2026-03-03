import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"

const httpLink = new HttpLink({
   uri: process.env.NEXT_PUBLIC_API_URL,
});

const authLink = new ApolloLink((operation, forward) => {
   // const token = localStorage.getItem("token")

   operation.setContext({
      headers: {
         //  Authorization: token ? `Bearer ${token}` : "",
         "Content-Type": "application/json",
         "X-Parse-Application-Id": process.env.NEXT_PUBLIC_PARSE_APP_ID,
         "X-Parse-Master-Key": process.env.NEXT_PUBLIC_PARSE_MASTER_KEY
      },
   });

   return forward(operation);
});

const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(),
});

export default client