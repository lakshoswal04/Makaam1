import { Link } from 'react-router-dom'
import Logo from './Logo'

const AuthLayout = ({ children, title, subtitle, linkText, linkUrl }) => {
  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && linkUrl && (
            <p className="mt-2 text-gray-400">
              {subtitle} <Link to={linkUrl} className="text-primary-500 hover:text-primary-400">{linkText}</Link>
            </p>
          )}
        </div>
        
        <div className="bg-dark-400 rounded-lg shadow-lg border border-dark-300 p-8">
          {children}
        </div>
        
      </div>
    </div>
  )
}

export default AuthLayout