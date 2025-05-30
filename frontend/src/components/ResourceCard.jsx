import React from 'react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';

// Fallback images for each domain/type
const fallbackImages = {
  'Web Development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  'Data Science': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  'Design': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'Mobile Development': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  'DevOps': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  'Machine Learning': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  'Blockchain': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'Cybersecurity': 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80',
  'Other': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  'default': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
};

const ResourceCard = ({ resource }) => {
  const { title, description, url, imageUrl, domain, type, isPremium, tags } = resource;
  const fallbackImage = fallbackImages[domain] || fallbackImages['default'];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
      <div className="relative">
        <img 
          src={imageUrl || fallbackImage} 
          alt={title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow">
            <FaStar className="mr-1" /> Premium
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
          {domain}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {tags && tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium border border-blue-100"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">{type}</span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-semibold transition-colors"
          >
            Visit <FaExternalLinkAlt className="ml-1" size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
