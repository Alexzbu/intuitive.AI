"use client";

import { gql, useQuery } from "@apollo/client"
import client from "@/utils/apolloClient"
import Link from "next/link"


const GET_QUESTION_QUERY = gql`
   query getQuestion($id: ID!) {
      getQuestion(id: $id) {
         file{
            url
         }
      }
   }`;

const PDF = ({ questionId }) => {
   const { data, loading } = useQuery(GET_QUESTION_QUERY, {
      client,
      variables: { id: questionId },
      skip: !questionId,
   })
   const pdfUrl = data?.getQuestion?.file.url

   return (
      <div className="question">
         {pdfUrl ? (
            <>
               <iframe
                  className="pdf-viewer"
                  src={pdfUrl}
                  title="PDF Viewer"
               />
               <Link href={pdfUrl} target="_blank" className="course-card__link">Open</Link>
            </>
         ) : (
            <p>No PDF available.</p>
         )}
      </div>
   );
};

export default PDF
