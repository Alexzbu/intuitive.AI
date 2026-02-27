import "./globals.css"
import Navbar from "@/components/NavBar"
import { Toaster } from "react-hot-toast"
import { Providers } from "./providers"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
