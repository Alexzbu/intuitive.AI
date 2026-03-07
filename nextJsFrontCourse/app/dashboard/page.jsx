"use client"

import { useState, useEffect, useRef } from 'react'
import Link from "next/link"
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import { Center, Spinner } from '@chakra-ui/react'
import { toast } from 'react-hot-toast'
import { CourseCard } from '@/features/course-card'


const GET_TRAINER_COURSES_QUERY = gql`
            query getCoursesByCreator($creatorId: ID!, $limit: Int, $page: Int) {
                    getCoursesByCreator(creatorId: $creatorId, limit: $limit, page: $page) {
                      totalCourses
                      courses{
                        objectId
                        name
                        description
                        thumbnail
                        sections{
                          count
                        }
                      }
                    }
              }`

const GET_STUDENT_COURSES_QUERY = gql`
            query getCoursesByParticipant($userId: ID!, $limit: Int, $page: Int) {
                    getCoursesByParticipant(userId: $userId, limit: $limit, page: $page) {
                      totalCourses
                      courses{
                        objectId
                        name
                        description
                        thumbnail
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
  const limit = 6
  const [page, setPage] = useState(0)
  const [allCourses, setAllCourses] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerTarget = useRef(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch { }
  }, [])

  const isTrainer = user?.position === 'trainer'

  useEffect(() => {
    if (!user?.objectId) return

    const query = isTrainer ? GET_TRAINER_COURSES_QUERY : GET_STUDENT_COURSES_QUERY
    const variables = isTrainer
      ? { creatorId: user.objectId, limit, page }
      : { userId: user.objectId, limit, page }

    if (page === 0) setLoading(true)

    client.query({ query, variables, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        const coursesData = data?.getCoursesByCreator ?? data?.getCoursesByParticipant
        if (coursesData?.courses) {
          if (page === 0) {
            setAllCourses(coursesData.courses)
          } else {
            setAllCourses(prev => [...prev, ...coursesData.courses])
          }
          const totalPages = Math.ceil(coursesData.totalCourses / limit)
          setHasMore(page < totalPages - 1)
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }, [user, page])

  const [delCourse, { loading: delLoading }] = useMutation(DEL_COURSE_MUTATION, { client })

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
      await delCourse({ variables: { id } })
      toast.success("Removed successfully!", { id: toastId })
      setPage(0)
      setAllCourses([])
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  return (
    <section className="courses-section">
      <div className="container">
        <div className="dashboard__header">
          <h2 className="section-title">My Courses</h2>
          {isTrainer && (
            <Link className="btn-primary" href="/create-course">Create Course</Link>
          )}
        </div>

        {loading && page === 0 && <Center py="20"><Spinner size="xl" color="blue.500" /></Center>}

        <div className="course-list">
          {allCourses.map((course) => (
            <CourseCard
              key={course.objectId}
              course={course}
              variant="dashboard"
              isCreator={isTrainer}
              onDelete={deleteItem}
              delLoading={delLoading}
            />
          ))}
        </div>

        {allCourses.length === 0 && !loading && (
          <div className="no-courses">
            <p>No courses available</p>
          </div>
        )}

        {hasMore && (
          <div ref={observerTarget} className="infinite-scroll-trigger">
            {loadingMore && <Center py="20"><Spinner size="xl" color="blue.500" /></Center>}
          </div>
        )}
      </div>
    </section>
  )
}
