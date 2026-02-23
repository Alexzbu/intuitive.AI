"use client"

import { useState, useEffect, useRef } from 'react'
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

const GET_TRAINER_COURSES_QUERY = gql`
            query getCoursesByCreator($creatorId: ID!, $limit: Int, $page: Int) {
                    getCoursesByCreator(creatorId: $creatorId, limit: $limit, page: $page) {
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

export default function Dashboard() {
  const router = useRouter()
  const limit = 6
  const [page, setPage] = useState(0)
  const [allCourses, setAllCourses] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [del, setDel] = useState(false)
  const observerTarget = useRef(null)
  const [user, setUser] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setUserLoaded(true)
  }, [])

  const isTrainer = user?.position === 'trainer'
  const activeQuery = isTrainer ? GET_TRAINER_COURSES_QUERY : GET_COURSES_QUERY
  const queryVariables = isTrainer
    ? { creatorId: user.objectId, limit, page }
    : { limit, page }

  const { data, loading, refetch } = useQuery(activeQuery, {
    client,
    variables: queryVariables,
    skip: !userLoaded,
  })
  const [delCourse, { loading: delLoading }] = useMutation(DEL_COURSE_MUTATION, { client })

  useEffect(() => {
    const coursesData = data?.getCoursesByCreator ?? data?.getCourses
    if (coursesData?.courses) {
      if (page === 0) {
        setAllCourses(coursesData.courses)
      } else {
        setAllCourses(prev => [...prev, ...coursesData.courses])
      }
      setLoadingMore(false)

      const totalPages = Math.ceil(coursesData.totalCourses / limit)
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
      await delCourse({
        variables: { id },
      })
      toast.success("Removed successfully!", { id: toastId })
      setDel(true)
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  return (
    <section className="courses-section">
      <div className="container">
        <div className="dashboard__header">
          <h2 className="section-title">{isTrainer ? 'My Courses' : 'All Courses'}</h2>
          {isTrainer && (
            <Link className="btn-primary" href="/add-course">Create Course</Link>
          )}
        </div>

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
  )
}
