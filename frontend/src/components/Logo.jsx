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
        <circle cx="18" cy="18" r="14.25" fill="#7c3aed" />
        <path d="M13 14L17 18L13 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 14L23 18L19 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-xl">Makaam</span>
    </Link>
  )
}

export default Logo