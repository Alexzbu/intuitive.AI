'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

const Navbar = () => {
   const router = useRouter()
   const pathname = usePathname()
   const [user, setUser] = useState(null)

   useEffect(() => {
      try {
         const stored = localStorage.getItem('user')
         setUser(stored ? JSON.parse(stored) : null)
      } catch { }
   }, [pathname])

   return (
      <header className="header">
         <div className="header__brand">
            <Link href="/" className="header__logo">AGI INSTITUTE</Link>
         </div>
         <nav className="nav">
            <Link href="/#courses-section" className="nav__link">Courses</Link>
            <Link href="/whiteboard" className="nav__link">Whiteboard</Link>
            <Link href="#faqs" className="nav__link">FAQs</Link>
            <Link href="#contact" className="nav__link">Contact Us</Link>
         </nav>
         <div className="auth">
            <span className="nav__language">DE</span>
            {user ? (
               <span className="nav__username">{user.firstName}</span>
            ) : (
               <>
                  <button className="btn-auth" onClick={() => router.push('/login')}>Login</button>
                  <button className="btn-primary" onClick={() => router.push('/register')}>Sign Up</button>
               </>
            )}
         </div>
      </header>
   )
}

export default Navbar
