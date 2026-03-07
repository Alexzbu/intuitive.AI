"use client"

import { useState, useEffect, useRef } from 'react'
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import client from '@/utils/apolloClient'
import { Center, Spinner } from "@chakra-ui/react"
import { CourseCard } from '@/features/course-card'

const GET_COURSES_QUERY = gql`
            query getCourses($limit: Int, $page: Int) {
                    getCourses(limit: $limit, page: $page) {
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

export default function Home() {
  const limit = 6
  const [page, setPage] = useState(0)
  const [allCourses, setAllCourses] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerTarget = useRef(null)

  const { data, loading } = useQuery(GET_COURSES_QUERY, {
    client,
    variables: { limit, page }
  })

  useEffect(() => {
    if (data?.getCourses?.courses) {
      if (page === 0) {
        setAllCourses(data.getCourses.courses)
      } else {
        setAllCourses(prev => [...prev, ...data.getCourses.courses])
      }
      setLoadingMore(false)

      const totalPages = Math.ceil(data.getCourses.totalCourses / limit)
      setHasMore(page < totalPages - 1)
    }
  }, [data, page])

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

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">AGI INSTITUTE</h1>
          <h2 className="hero__subtitle">Bildung trifft KI</h2>
          <p className="hero__description">Wir verbinden individuelle Weiterbildung, innovative Lernprogramme und unsere Plattform AGI² – für effektives Lernen mit KI.</p>
        </div>
      </section>

      <section id="courses-section" className="courses-section">
        <div className="container">
          <h2 className="section-title">Discover Our Courses</h2>

          {loading && page === 0 && <Center py="20"><Spinner size="xl" color="blue.500" /></Center>}

          <div className="course-list">
            {allCourses.map((course) => (
              <CourseCard key={course.objectId} course={course} variant="home" />
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
    </>
  )
}
