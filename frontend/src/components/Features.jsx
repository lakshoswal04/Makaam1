import { FaRoad, FaBook, FaChartLine, FaTools } from 'react-icons/fa'

const features = [
  {
    icon: <FaRoad className="text-purple-500" size={24} />,
    title: 'Personalized Career Roadmaps',
    description: 'AI-powered guidance tailored to your skills, goals, and interests'
  },
  {
    icon: <FaBook className="text-purple-500" size={24} />,
    title: 'Curated Learning Resources',
    description: 'Discover the best courses, books, and articles for your career path'
  },
  {
    icon: <FaChartLine className="text-purple-500" size={24} />,
    title: 'Progress Tracking',
    description: 'Stay motivated with weekly check-ins and clear visualizations of your growth'
  },
  {
    icon: <FaTools className="text-purple-500" size={24} />,
    title: 'Skill Development',
    description: 'Build relevant skills with practical projects and guided learning paths'
  }
]

const Features = () => {
  return (
    <section className="py-20 bg-dark-500" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-purple-500 font-medium uppercase tracking-wider mb-2">FEATURES</p>
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to succeed</h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Makaam combines AI-powered guidance with curated resources to 
            help you navigate your career journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-dark-400 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-dark-300 border border-dark-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features