import axios from 'axios';

const apiServer = axios.create({
   baseURL: 'http://localhost:3000/graphql',
   headers: {
      'Content-Type': 'application/json',
      "X-Parse-Application-Id": "myAppId123",
      "X-Parse-Master-Key": "myMasterKey123"
   },
});

export default apiServer