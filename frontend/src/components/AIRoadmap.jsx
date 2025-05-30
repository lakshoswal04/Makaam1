import { useState, useEffect } from 'react';
import { FaSpinner, FaRoad, FaBook, FaTools, FaBriefcase } from 'react-icons/fa';
import { userService } from '../services/api';

const AIRoadmap = ({ userProfile, showActions = false, completedItems = {} }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  
  // Fetch stored roadmap on component mount
  useEffect(() => {
    const fetchStoredRoadmap = async () => {
      try {
        setLoading(true);
        const response = await userService.getRoadmap();
        
        if (response && response.success && response.roadmap) {
          setRoadmap(response.roadmap);
          setIsCached(true);
          console.log('Loaded cached roadmap from server');
        }
      } catch (err) {
        // Silently fail if no stored roadmap exists
        console.log('No stored roadmap found, will generate on demand');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoredRoadmap();
  }, []);

  const generateRoadmap = async (forceRegenerate = false) => {
    if (!userProfile) {
      setError('Please complete your profile first to generate a personalized roadmap.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating roadmap with profile data:', {
        educationLevel: userProfile.educationLevel,
        interestsCount: userProfile.interests?.length,
        hasSkills: !!userProfile.skills,
        hasCareerGoals: !!userProfile.careerGoals,
        forceRegenerate: forceRegenerate
      });
      
      // Use the API service instead of direct fetch
      const profileData = {
        educationLevel: userProfile.educationLevel,
        interests: userProfile.interests,
        skills: userProfile.skills,
        careerGoals: userProfile.careerGoals
      };
      
      // Pass useCache parameter if not forcing regeneration
      const response = await userService.generateRoadmap(profileData, !forceRegenerate);
      console.log('Roadmap generation response:', response);
      
      if (response && response.success && response.roadmap) {
        setRoadmap(response.roadmap);
        setIsCached(response.cached || false);
      } else {
        throw new Error('Invalid roadmap data received');
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate roadmap. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (phase) => {
    if (!roadmap || !completedItems[phase]) return 0;
    const totalItems = roadmap[phase].topics.length + roadmap[phase].projects.length;
    const completed = completedItems[phase].length;
    return totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
  };

  const RoadmapPhase = ({ phase, icon }) => {
    return (
      <div className="bg-dark-400 rounded-lg p-6 shadow-md mb-6">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="text-xl font-semibold ml-2">{phase.title}</h3>
        </div>
        
        <div className="space-y-4">
          {phase.description && (
            <p className="text-gray-300">{phase.description}</p>
          )}
          
          {phase.topics && phase.topics.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-purple-400 mb-2">Topics to Cover</h4>
              <ul className="list-disc pl-5 space-y-1">
                {phase.topics.map((topic, index) => (
                  <li key={index} className="text-gray-300">{topic}</li>
                ))}
              </ul>
            </div>
          )}
          
          {phase.tools && phase.tools.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-purple-400 mb-2">Tools & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {phase.tools.map((tool, index) => (
                  <span key={index} className="bg-dark-300 px-3 py-1 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {phase.projects && phase.projects.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-purple-400 mb-2">Suggested Projects</h4>
              <ul className="list-disc pl-5 space-y-1">
                {phase.projects.map((project, index) => (
                  <li key={index} className="text-gray-300">{project}</li>
                ))}
              </ul>
            </div>
          )}
          
          {phase.resources && phase.resources.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-purple-400 mb-2">Helpful Resources</h4>
              <ul className="list-disc pl-5 space-y-1">
                {phase.resources.map((resource, index) => (
                  <li key={index} className="text-gray-300">
                    {resource.url ? (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        {resource.title || resource.url}
                      </a>
                    ) : (
                      resource.title
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark-500 rounded-lg shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Career Roadmap</h2>
          {isCached && roadmap && (
            <p className="text-sm text-gray-400">Using saved roadmap</p>
          )}
        </div>
        <div className="flex gap-2">
          {showActions && roadmap && (
            <button
              onClick={() => generateRoadmap(true)}
              disabled={loading}
              className="bg-dark-300 hover:bg-dark-200 text-white py-2 px-4 rounded-md transition-all duration-200 flex items-center"
            >
              Regenerate
            </button>
          )}
          {showActions && (
            <button
              onClick={() => generateRoadmap(false)}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {roadmap ? 'Updating...' : 'Generating...'}
                </>
              ) : roadmap ? 'Update Roadmap' : 'Generate Roadmap'}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {!roadmap && !loading && !error && (
        <div className="bg-dark-400 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">
            Get a personalized career roadmap based on your profile information.
          </p>
          <p className="text-gray-400 text-sm">
            Our AI will analyze your education, skills, interests, and career goals to create a
            custom learning path with recommended topics, tools, projects, and resources.
          </p>
        </div>
      )}
      
      {loading && (
        <div className="bg-dark-400 rounded-lg p-8 text-center">
          <FaSpinner className="animate-spin text-3xl text-purple-500 mx-auto mb-4" />
          <p className="text-gray-300">Generating your personalized roadmap...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment as our AI crafts your custom career path.</p>
        </div>
      )}
      
      {roadmap && (
        <div className="space-y-6">
          <RoadmapPhase phase={roadmap.learn} icon={<FaBook className="text-purple-400" />} />
          <RoadmapPhase phase={roadmap.practice} icon={<FaTools className="text-purple-400" />} />
          <RoadmapPhase phase={roadmap.build} icon={<FaBriefcase className="text-purple-400" />} />
          <RoadmapPhase phase={roadmap.apply} icon={<FaRoad className="text-purple-400" />} />
          
          <div className="bg-dark-400 rounded-lg p-4 text-sm text-gray-400">
            <p>
              This roadmap is AI-generated based on your profile information. It's meant to be a starting point - 
              feel free to adapt it to your specific needs and pace.
            </p>
            {roadmap.createdAt && (
              <p className="mt-2 text-xs text-gray-500">
                Last updated: {new Date(roadmap.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRoadmap;
