import Link from "next/link"

const Navbar = () => {

   return (
      <header className="header">
         <nav className="nav">
            <Link href="/" className="nav__link">Home</Link>
            <Link href="/add-course" className="nav__link">Add course</Link>
         </nav>
         <div className="auth">
            <Link href="/logout" className="nav__link" >Logout</Link>
            <Link href="/login" className="nav__link">Sign in</Link>
            <Link href="/register" className="nav__link">Sign up</Link>
         </div>
      </header>

   )
}

export default Navbar