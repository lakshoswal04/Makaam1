import React from 'react';
import { FaFilter } from 'react-icons/fa';

const domains = [
  "All Domains",
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
  "All Types",
  "Course",
  "Blog",
  "GitHub Repository",
  "Video",
  "Book",
  "Tool",
  "Other"
];

const ResourceFilter = ({ filters, setFilters }) => {
  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setFilters({
      ...filters,
      domain: domain === "All Domains" ? null : domain
    });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFilters({
      ...filters,
      type: type === "All Types" ? null : type
    });
  };

  const handlePremiumChange = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      isPremium: value === "all" ? null : value === "premium"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center mb-4">
        <FaFilter className="text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold">Filter Resources</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Domain Filter */}
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Domain
          </label>
          <select
            id="domain"
            value={filters.domain || "All Domains"}
            onChange={handleDomainChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
        
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Resource Type
          </label>
          <select
            id="type"
            value={filters.type || "All Types"}
            onChange={handleTypeChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Premium Filter */}
        <div>
          <label htmlFor="premium" className="block text-sm font-medium text-gray-700 mb-1">
            Premium Status
          </label>
          <select
            id="premium"
            value={filters.isPremium === null ? "all" : filters.isPremium ? "premium" : "free"}
            onChange={handlePremiumChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Resources</option>
            <option value="free">Free Only</option>
            <option value="premium">Premium Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilter;
