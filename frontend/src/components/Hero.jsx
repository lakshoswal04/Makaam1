import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 bg-dark-500 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Navigate your <span className="text-primary-500">career journey</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Makaam creates personalized career roadmaps for students 
              and professionals, helping you discover the right path, build 
              relevant skills, and achieve your goals.
            </p>
            <div className="pt-4">
              <Link 
                to="/signup" 
                className="btn-primary text-lg px-8 py-3 flex items-center gap-2 w-fit shadow-lg"
              >
                <span>Start Your Journey</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <img 
              src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260" 
              alt="Career Mentorship" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero