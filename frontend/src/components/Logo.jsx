import { Link } from 'react-router-dom'

const Logo = ({ className = 'h-8 w-auto' }) => {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold text-white">
      <svg 
        className={className} 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 3.75C10.1625 3.75 3.75 10.1625 3.75 18C3.75 25.8375 10.1625 32.25 18 32.25C25.8375 32.25 32.25 25.8375 32.25 18C32.25 10.1625 25.8375 3.75 18 3.75ZM18 7.5C20.0625 7.5 21.75 9.1875 21.75 11.25C21.75 13.3125 20.0625 15 18 15C15.9375 15 14.25 13.3125 14.25 11.25C14.25 9.1875 15.9375 7.5 18 7.5ZM18 28.5C14.25 28.5 10.8375 26.55 9 23.625C9.075 20.8125 14.625 19.3125 18 19.3125C21.375 19.3125 26.925 20.8125 27 23.625C25.1625 26.55 21.75 28.5 18 28.5Z" 
        fill="#7c3aed"/>
        <path d="M24.375 11.625L20.625 15.375L18.75 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-xl">Makaam</span>
    </Link>
  )
}

export default Logo