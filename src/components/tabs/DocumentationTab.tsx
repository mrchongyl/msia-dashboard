import React from 'react';
import { ExternalLink, FileCog } from 'lucide-react';

const DocumentationTab: React.FC = () => {
  return (
    <div className="slide-in">
      <div className="w-full mb-6">
        <div className="flex items-center mb-2">
          <FileCog className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">Documentation</h2>
        </div>
        <p className="text-slate-600">
          This documentation provides an overview of the architecture, API integrations, and CI/CD pipeline for the Malaysia Economic Dashboard.
        </p>
      </div>
      {/* Content sections */}
      <div className="border-l-4 border-yellow-400 p-6 mb-8 bg-white card">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">Architecture Overview</h3>
        <ul className="list-disc pl-6 text-black text-base mb-2">
          <li><b>Frontend Framework:</b> React (TypeScript, Vite)</li>
          <li><b>State Management:</b> React Query for async data, React state for UI</li>
          <li><b>Styling:</b> Tailwind CSS for utility-first, responsive design</li>
          <li><b>Data Visualization:</b> Chart.js (via react-chartjs-2), custom Table component</li>
          <li><b>Routing:</b> Tab-based navigation (single-page, no URL routing)</li>
          <li><b>API Integration:</b> Custom Flask backend (Python) fetching from World Bank APIs</li>
          <li><b>Build System:</b> Vite for fast development and builds</li>
          <li><b>Component Architecture:</b> Modular, reusable components for charts, tables, cards, and UI</li>
        </ul>
      </div>
      <div className="border-l-4 border-yellow-400 p-6 mb-8 bg-white card">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">API Endpoint Integrations</h3>
        <ul className="list-disc pl-6 text-black text-base mb-2">
          <li><b>Flask Backend Endpoints:</b></li>
          <ul className="list-disc pl-8">
            <li><code>/api/gdp-per-capita</code> – GDP per capita data</li>
            <li><code>/api/inflation</code> – Inflation rate data</li>
            <li><code>/api/cpi</code> – Consumer Price Index data</li>
            <li><code>/api/credit-card-usage</code> – Credit card usage data (unit switchable)</li>
            <li><code>/api/mobile-internet-banking</code> – Mobile & Internet banking data (unit switchable)</li>
          </ul>
          <li>All endpoints fetch and transform data from the World Bank Open Data API, with robust error handling and unit support where needed.</li>
          <li>Frontend uses <code>apiService.ts</code> for all data fetching, with TypeScript types for safety.</li>
        </ul>
      </div>
      <div className="border-l-4 border-yellow-400 p-6 mb-8 bg-white card">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">CI/CD Pipeline (GitHub)</h3>
        <ul className="list-disc pl-6 text-black text-base mb-2">
          <li><b>Version Control:</b> GitHub</li>
          <li><b>CI/CD:</b> GitHub Actions for automated testing and deployment</li>
          <li><b>Typical Workflow:</b></li>
          <ul className="list-disc pl-8">
            <li>Pushes and pull requests trigger linting, type checks, and tests</li>
            <li>On main branch merge, build and deploy steps run automatically</li>
            <li>Frontend is deployed to AWS EC2</li>
            <li>Backend is deployed to AWS Elastic Beanstalk</li>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default DocumentationTab;
