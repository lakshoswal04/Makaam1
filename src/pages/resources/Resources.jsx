import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Code, 
  PenTool, 
  Video, 
  Award, 
  Bookmark, 
  ExternalLink 
} from 'lucide-react';
import Loading from '../../components/common/Loading';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase.config';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web_development', name: 'Web Development' },
    { id: 'data_science', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'mobile_development', name: 'Mobile Development' },
    { id: 'ai_ml', name: 'AI & Machine Learning' }
  ];

  const resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'course', name: 'Courses' },
    { id: 'tutorial', name: 'Tutorials' },
    { id: 'documentation', name: 'Documentation' },
    { id: 'book', name: 'Books' },
    { id: 'video', name: 'Videos' }
  ];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Get resources from Firestore
        const resourcesRef = collection(db, 'resources');
        const resourcesSnap = await getDocs(resourcesRef);
        
        // If no resources exist yet in Firestore, create mock data
        if (resourcesSnap.empty) {
          // Mock resource data
          const mockResources = [
            {
              id: 1,
              title: 'React Fundamentals',
              description: 'Learn the basics of React, from components to state management',
              category: 'web_development',
              type: 'course',
              source: 'Frontend Masters',
              url: 'https://frontendmasters.com/courses/react-fundamentals/',
              isFree: false,
              rating: 4.8,
              tags: ['react', 'javascript', 'frontend']
            },
            {
              id: 2,
              title: 'Node.js API Development',
              description: 'Build RESTful APIs with Node.js, Express, and MongoDB',
              category: 'web_development',
              type: 'tutorial',
              source: 'freeCodeCamp',
              url: 'https://www.freecodecamp.org/learn/apis-and-microservices/',
              isFree: true,
              rating: 4.6,
              tags: ['node', 'api', 'backend', 'express']
            },
            {
              id: 3,
              title: 'Machine Learning Crash Course',
              description: 'A fast-paced introduction to machine learning fundamentals',
              category: 'ai_ml',
              type: 'course',
              source: 'Google Developers',
              url: 'https://developers.google.com/machine-learning/crash-course',
              isFree: true,
              rating: 4.7,
              tags: ['machine learning', 'python', 'data']
            },
            {
              id: 4,
              title: 'Modern CSS Techniques',
              description: 'Learn advanced CSS including Flexbox, Grid, and CSS Variables',
              category: 'web_development',
              type: 'video',
              source: 'CSS-Tricks',
              url: 'https://css-tricks.com/modern-css-techniques/',
              isFree: true,
              rating: 4.5,
              tags: ['css', 'frontend', 'design']
            },
            {
              id: 5,
              title: 'UI/UX Design Principles',
              description: 'Master the fundamentals of user interface and experience design',
              category: 'design',
              type: 'course',
              source: 'Udemy',
              url: 'https://www.udemy.com/course/ui-ux-design-principles/',
              isFree: false,
              rating: 4.9,
              tags: ['ui', 'ux', 'design']
            },
            {
              id: 6,
              title: 'Python for Data Science',
              description: 'Learn Python libraries for data analysis and visualization',
              category: 'data_science',
              type: 'book',
              source: 'O\'Reilly',
              url: 'https://www.oreilly.com/library/view/python-for-data/9781491957653/',
              isFree: false,
              rating: 4.7,
              tags: ['python', 'data', 'pandas', 'numpy']
            },
            {
              id: 7,
              title: 'Flutter App Development',
              description: 'Build cross-platform mobile apps with Flutter and Dart',
              category: 'mobile_development',
              type: 'tutorial',
              source: 'Flutter Dev',
              url: 'https://flutter.dev/docs/get-started/codelab',
              isFree: true,
              rating: 4.6,
              tags: ['flutter', 'dart', 'mobile']
            },
            {
              id: 8,
              title: 'React Native from Scratch',
              description: 'Learn to build native mobile apps using React',
              category: 'mobile_development',
              type: 'course',
              source: 'Udacity',
              url: 'https://www.udacity.com/course/react-native-from-scratch--ud902',
              isFree: false,
              rating: 4.5,
              tags: ['react native', 'javascript', 'mobile']
            },
            {
              id: 9,
              title: 'TensorFlow Documentation',
              description: 'Official documentation for the TensorFlow library',
              category: 'ai_ml',
              type: 'documentation',
              source: 'TensorFlow',
              url: 'https://www.tensorflow.org/docs',
              isFree: true,
              rating: 4.8,
              tags: ['tensorflow', 'deep learning', 'ai']
            },
            {
              id: 10,
              title: 'Web Accessibility Guidelines',
              description: 'Learn how to make your websites accessible to everyone',
              category: 'web_development',
              type: 'documentation',
              source: 'W3C',
              url: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
              isFree: true,
              rating: 4.7,
              tags: ['accessibility', 'frontend', 'html']
            },
            {
              id: 11,
              title: 'Data Visualization with D3.js',
              description: 'Create interactive data visualizations for the web',
              category: 'data_science',
              type: 'video',
              source: 'YouTube',
              url: 'https://www.youtube.com/watch?v=8jvoTVvhDTM',
              isFree: true,
              rating: 4.4,
              tags: ['d3', 'javascript', 'visualization']
            },
            {
              id: 12,
              title: 'Figma for UI Design',
              description: 'Master Figma for modern UI/UX design workflows',
              category: 'design',
              type: 'course',
              source: 'Skillshare',
              url: 'https://www.skillshare.com/classes/Figma-for-UI-Design/1425515184',
              isFree: false,
              rating: 4.9,
              tags: ['figma', 'design', 'ui']
            }
          ];
          
          // In a real implementation, we would add these to Firestore
          // For now, we'll just use them directly
          setResources(mockResources);
        } else {
          // Use the resources from Firestore
          const resourcesData = resourcesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setResources(resourcesData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getResourceIcon = (type) => {
    switch(type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-purple-400" />;
      case 'tutorial':
        return <Code className="h-5 w-5 text-blue-400" />;
      case 'documentation':
        return <BookOpen className="h-5 w-5 text-green-400" />;
      case 'book':
        return <BookOpen className="h-5 w-5 text-yellow-400" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />;
    }
  };

  // Function to handle resource click - could be used for analytics
  const handleResourceClick = (resourceId) => {
    // In a real app, you might want to track clicks or save to user history
    console.log(`Resource clicked: ${resourceId}`);
    // Could implement analytics tracking here
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <BookOpen className="mr-3 h-8 w-8 text-primary-500" />
              Learning Resources
            </h1>
            <p className="text-gray-400 mt-2">Discover curated content to help you on your journey</p>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search resources by title, description or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    className="input-field appearance-none pr-10"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Resource Type
                </label>
                <div className="relative">
                  <select
                    className="input-field appearance-none pr-10"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {resourceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredResources.length} resources
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              className="glass-card overflow-hidden card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    resource.type === 'course' ? 'bg-purple-900/30' :
                    resource.type === 'tutorial' ? 'bg-blue-900/30' :
                    resource.type === 'documentation' ? 'bg-green-900/30' :
                    resource.type === 'book' ? 'bg-yellow-900/30' :
                    'bg-red-900/30'
                  }`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <Award className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white text-sm">{resource.rating}</span>
                    </div>
                    <button className="text-gray-400 hover:text-primary-400 transition-colors">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-500">From: </span>
                    <span className="text-gray-300">{resource.source}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resource.isFree ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-primary-400'
                  }`}>
                    {resource.isFree ? 'Free' : 'Premium'}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-800 p-4">
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                  onClick={() => handleResourceClick(resource.id)}
                >
                  <span>View Resource</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredResources.length === 0 && (
          <div className="glass-card p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
            <button 
              className="btn-primary mx-auto mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;