import React from 'react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';

const ResourceCard = ({ resource }) => {
  const { title, description, url, imageUrl, domain, type, isPremium, tags } = resource;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xl">{type}</span>
          </div>
        )}
        {isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaStar className="mr-1" /> Premium
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {domain}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags && tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">{type}</span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
          >
            Visit <FaExternalLinkAlt className="ml-1" size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
