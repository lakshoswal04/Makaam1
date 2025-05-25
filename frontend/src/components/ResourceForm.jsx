import React, { useState, useEffect } from 'react';
import { createResource, updateResource } from '../services/resourceService';

const domains = [
  "Data Science",
  "Design",
  "Web Development",
  "Mobile Development",
  "DevOps",
  "Machine Learning",
  "Blockchain",
  "Cybersecurity",
  "Other"
];

const types = [
  "Course",
  "Blog",
  "GitHub Repository",
  "Video",
  "Book",
  "Tool",
  "Other"
];

const ResourceForm = ({ onSuccess, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
    domain: 'Web Development',
    type: 'Course',
    isPremium: false,
    tags: ''
  });
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      });
    }
  }, [initialData]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      if (isEditing && initialData) {
        await updateResource(initialData._id, processedData);
      } else {
        await createResource(processedData);
      }
      
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          url: '',
          imageUrl: '',
          domain: 'Web Development',
          type: 'Course',
          isPremium: false,
          tags: ''
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} resource. ${err.message || 'Please try again.'}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Resource' : 'Add New Resource'}</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
              Domain *
            </label>
            <select
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, tutorial, beginner"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {/* Premium Status */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPremium"
              name="isPremium"
              checked={formData.isPremium}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
              Premium Resource
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Resource' : 'Add Resource')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
