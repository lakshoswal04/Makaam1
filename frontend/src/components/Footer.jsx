import Logo from './Logo'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-dark-500 py-12 border-t border-dark-400">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-gray-400">
              Empowering your career journey with personalized roadmaps and expert guidance.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-purple-400">About</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-purple-400">Careers</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-purple-400">Blog</Link></li>
            </ul>
          </div>
          

          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-purple-400">Terms</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-purple-400">Privacy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-purple-400">Cookies</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer