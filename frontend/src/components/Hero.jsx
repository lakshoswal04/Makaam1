import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 bg-dark-500 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Navigate your <span className="text-purple-500">career</span> <span className="text-purple-500">journey</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Makaam creates personalized career roadmaps for students 
              and professionals, helping you discover the right path, build 
              relevant skills, and achieve your goals.
            </p>
            <div className="pt-4">
              <Link 
                to="/signup" 
                className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-md flex items-center gap-2 w-fit shadow-lg transition-all duration-200"
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
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
              alt="Career Planning" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero