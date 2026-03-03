import axios from 'axios';

const apiServer = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
   headers: {
      'Content-Type': 'application/json',
      "X-Parse-Application-Id": process.env.NEXT_PUBLIC_PARSE_APP_ID,
      "X-Parse-Master-Key": process.env.NEXT_PUBLIC_PARSE_MASTER_KEY
   },
});

export default apiServer