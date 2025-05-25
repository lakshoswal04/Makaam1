import React, { useState, useEffect } from 'react';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ResourceGrid from '../components/ResourceGrid';
import ResourceFilter from '../components/ResourceFilter';
import { getAllResources, getResourcesByDomain, getResourcesByType, getResourcesByPremiumStatus } from '../services/resourceService';

const ResourceLibrary = () => {
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    domain: null,
    type: null,
    isPremium: null
  });

  const fetchResources = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      let data;
      
      // Apply filters
      if (filters.domain) {
        data = await getResourcesByDomain(filters.domain);
      } else if (filters.type) {
        data = await getResourcesByType(filters.type);
      } else if (filters.isPremium !== null) {
        data = await getResourcesByPremiumStatus(filters.isPremium);
      } else {
        data = await getAllResources();
      }
      
      setResources(data.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);



  // Sample data for initial development (remove in production)
  useEffect(() => {
    // This is just for demonstration when no backend is available
    if (resources.length === 0 && !isLoading) {
      const sampleResources = [
        {
          _id: '1',
          title: 'React Documentation',
          description: 'The official React documentation with tutorials, guides, and API reference.',
          url: 'https://reactjs.org/docs/getting-started.html',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
          domain: 'Web Development',
          type: 'Documentation',
          isPremium: false,
          tags: ['react', 'javascript', 'frontend']
        },
        {
          _id: '2',
          title: 'Figma Design Course',
          description: 'Comprehensive course on UI/UX design using Figma, from basics to advanced techniques.',
          url: 'https://www.figma.com/resources/learn-design/',
          imageUrl: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1108x1108.png',
          domain: 'Design',
          type: 'Course',
          isPremium: true,
          tags: ['figma', 'ui', 'ux', 'design']
        },
        {
          _id: '3',
          title: 'TensorFlow Tutorials',
          description: 'Learn machine learning with TensorFlow through practical examples and tutorials.',
          url: 'https://www.tensorflow.org/tutorials',
          imageUrl: 'https://www.tensorflow.org/site-assets/images/project-logos/tensorflow-logo-social.png',
          domain: 'Data Science',
          type: 'Tutorial',
          isPremium: false,
          tags: ['tensorflow', 'machine learning', 'python']
        },
        {
          _id: '4',
          title: 'GitHub - Awesome Python',
          description: 'A curated list of awesome Python frameworks, libraries, software and resources.',
          url: 'https://github.com/vinta/awesome-python',
          imageUrl: '',
          domain: 'Web Development',
          type: 'GitHub Repository',
          isPremium: false,
          tags: ['python', 'resources', 'libraries']
        },
        {
          _id: '5',
          title: 'AWS Certified Solutions Architect',
          description: 'Comprehensive course to prepare for the AWS Certified Solutions Architect exam.',
          url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
          imageUrl: 'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.3419559c682629072f1eb968d59dea0741772c0f.png',
          domain: 'DevOps',
          type: 'Course',
          isPremium: true,
          tags: ['aws', 'cloud', 'certification']
        },
        {
          _id: '6',
          title: 'Flutter Documentation',
          description: 'Official documentation for Flutter, Google\'s UI toolkit for building beautiful, natively compiled applications.',
          url: 'https://flutter.dev/docs',
          imageUrl: 'https://storage.googleapis.com/cms-storage-bucket/70760bf1e88b184bb1bc.png',
          domain: 'Mobile Development',
          type: 'Documentation',
          isPremium: false,
          tags: ['flutter', 'dart', 'mobile']
        }
      ];
      
      setResources(sampleResources);
    }
  }, [resources, isLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <FaBook className="text-blue-500 text-2xl mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Resource Library</h1>
        </div>
        
        {isAdmin && (
          <Link 
            to="/admin"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaExternalLinkAlt className="mr-2" /> Manage Resources
          </Link>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      

      
      <ResourceFilter filters={filters} setFilters={setFilters} />
      
      <ResourceGrid resources={resources} isLoading={isLoading} />
    </div>
  );
};

export default ResourceLibrary;
