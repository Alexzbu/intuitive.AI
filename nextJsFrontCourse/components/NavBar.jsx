'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

const Navbar = () => {
   const router = useRouter()

   return (
      <header className="header">
         <div className="header__brand">
            <Link href="/" className="header__logo">AGI INSTITUTE</Link>
         </div>
         <nav className="nav">
            <Link href="#about" className="nav__link">About Us</Link>
            <Link href="#courses-section" className="nav__link">Courses</Link>
            <Link href="#news" className="nav__link">News</Link>
            <Link href="#faqs" className="nav__link">FAQs</Link>
            <Link href="#contact" className="nav__link">Contact Us</Link>
         </nav>
         <div className="auth">
            <span className="nav__language">DE</span>
            <button className="btn-auth" onClick={() => router.push('/login')}>Login</button>
            <button className="btn-primary" onClick={() => router.push('/register')}>Sign Up</button>
         </div>
      </header>

   )
}

export default Navbar