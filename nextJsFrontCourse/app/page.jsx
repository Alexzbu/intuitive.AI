"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { gql, useQuery, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import Loading from '@/components/Loading'
import { toast } from 'react-hot-toast'

const GET_COURSES_QUERY = gql`
            query getCourses($limit: Int, $page: Int) {
                    getCourses(limit: $limit, page: $page) {
                      totalCourses
                      courses{
                        objectId
                        name
                        description
                        sections{
                          count
                        }
                      }
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
  const router = useRouter()
  const limit = 6
  const [page, setPage] = useState(0)
  const [allCourses, setAllCourses] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [del, setDel] = useState(false)
  const observerTarget = useRef(null)

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_COURSES_QUERY, {
    client,
    variables: {
      limit: limit,
      page: page
    }
  })
  const [delCourse, { loading: delLoading }] = useMutation(DEL_COURSE_MUTATION, { client })

  useEffect(() => {
    if (data?.getCourses?.courses) {
      if (page === 0) {
        setAllCourses(data.getCourses.courses)
      } else {
        setAllCourses(prev => [...prev, ...data.getCourses.courses])
      }
      setLoadingMore(false)

      // Check if there are more courses to load
      const totalPages = Math.ceil(data.getCourses.totalCourses / limit)
      setHasMore(page < totalPages - 1)
    }
  }, [data, page])

  useEffect(() => {
    if (del) {
      setDel(false)
      setPage(0)
      refetch()
    }
  }, [del, refetch])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setLoadingMore(true)
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading, loadingMore])

  const deleteItem = async (id) => {
    const toastId = toast.loading("Removing...")
    try {
      const { data } = await delCourse({
        variables: {
          id: id
        },
      })
      toast.success("Removed successfully!", { id: toastId })
      setDel(true)
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">AGI INSTITUTE</h1>
          <h2 className="hero__subtitle">Bildung trifft KI</h2>
          <p className="hero__description">Wir verbinden individuelle Weiterbildung, innovative Lernprogramme und unsere Plattform AGI² – für effektives Lernen mit KI.</p>
        </div>
      </section>

      <section className="courses-section">
        <div className="container">
          <h2 className="section-title">Discover Our Courses</h2>

          {loading && page === 0 && <Loading />}

          <div className="course-list">
            {allCourses.map((course) => (
              <div className="course-card" key={course.objectId}>
                <Link className="course-card__link" href={`/course-details?id=${course.objectId}`}>
                  <h3 className="course-card__title">{course.name}</h3>
                  <p className="course-card__description">{course.description}</p>
                  <p className="course-card__meta">Sections: {course.sections.count}</p>
                </Link>
                <div className="course-card__actions">
                  <button
                    className="course-card__btn course-card__btn--delete"
                    onClick={() => deleteItem(course.objectId)}
                    disabled={delLoading}>
                    Delete
                  </button>
                  <button
                    className="course-card__btn course-card__btn--edit"
                    onClick={() => router.push(`/update-course?id=${course.objectId}`)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {allCourses.length === 0 && !loading && (
            <div className="no-courses">
              <p>No courses available</p>
            </div>
          )}

          {hasMore && (
            <div ref={observerTarget} className="infinite-scroll-trigger">
              {loadingMore && <Loading />}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
