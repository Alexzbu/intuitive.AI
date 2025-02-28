"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { gql, useQuery, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import Loading from '@/components/Loading'

const GET_COURSES_QUERY = gql`
            query getCourses {
               getCourses {
               objectId
               name
               description
               }
            }`

const DEL_COURSE_MUTATION = gql`
            mutation delCourse($id: ID!) {
               delCourse(id: $id) {
               objectId
               name
               }
            }`

export default function Home() {
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [del, setDel] = useState(false)
  const { data, loading, error, refetch } = useQuery(GET_COURSES_QUERY, { client, })
  const [delCourse, { loading: delLoading }] = useMutation(DEL_COURSE_MUTATION, { client })

  useEffect(() => {
    setDel(false)
    // setTotalPages(Math.ceil(response.data.count / limit) > 1 ? Math.ceil(response.data.count / limit) : 0)

    refetch()
  }, [page, sort, filter, del])

  const deleteItem = async (id) => {

    try {
      const { data } = await delCourse({
        variables: {
          id: id
        },
      })
      setDel(true)
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }
  return (
    <div className="container">
      <h1 className="title">List of available courses</h1>
      <div className='filter-block'>
        <div className="form">
          <input
            className="form__input"
            type="text"
            placeholder="Search by name"
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(0) }}
          />
          <div className="form__select-wrapper">
            <select className="form__select" onChange={(e) => { setSort(e.target.value); setPage(0) }}>
              <option value="">Sort by price:</option>
              <option value="price:asc">Price: Low to high</option>
              <option value="price:desc">Price: High to low</option>
            </select>
          </div>
        </div>
      </div>
      <div className="course-list">
        {loading &&
          <Loading />
        }
        {data?.getCourses.length === 0 && !loading && (<h2>NO COURSES FOUND</h2>)}
        {data?.getCourses?.map((course) => (
          <div className="course-card" key={course.objectId}>
            <Link href={`/course-detail/${course.objectId}`}>
              {/* <Link to={`/course-detail/${course.objectId}`}></Link> */}
              <h2 className="course-card__title">{course.name}</h2>
            </Link>
            {/* <p className="course-card__number">Price (hour): {item.price}$</p>
            <p className="course-card__number">Location: {item.location?.title}</p> */}
            {/* {isAuthenticated && ( */}
            <div className="course-card__actions">
              <button className="course-card__link delete-button"
                onClick={() => deleteItem(course.objectId)}
                disabled={delLoading}>Remove
              </button>
              <button className="course-card__link" >Edit</button>
            </div>
            {/* )} */}
          </div>
        ))}
      </div>
      <div className='pagination-block'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button className={page === index ? 'course-card__link active-button' : 'course-card__link'}
            key={index}
            onClick={() => setPage(index)}
            disabled={page === index}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
