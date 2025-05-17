import React from 'react';
import { ExternalLink } from 'lucide-react';

const DocumentationTab: React.FC = () => {
  return (
    <div className="slide-in">
      {/* Header and description, single column, left-aligned like other tabs */}
      <div className="w-full mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-2">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-600 mr-2" />
          Project Documentation
        </h2>
        <p className="text-slate-600">
          This documentation provides an overview of the architecture, API integrations, and CI/CD pipeline for the Malaysia Economic Dashboard.
        </p>
      </div>
      {/* Content sections */}
      <div className="border-l-4 border-yellow-400 p-6 mb-8">
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
      <div className="border-l-4 border-yellow-400 p-6 mb-8">
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
      <div className="border-l-4 border-yellow-400 p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">CI/CD Pipeline (GitHub)</h3>
        <ul className="list-disc pl-6 text-black text-base mb-2">
          <li><b>Version Control:</b> Git & GitHub</li>
          <li><b>CI/CD:</b> GitHub Actions for automated testing and deployment</li>
          <li><b>Typical Workflow:</b></li>
          <ul className="list-disc pl-8">
            <li>Pushes and pull requests trigger linting, type checks, and tests</li>
            <li>On main branch merge, build and deploy steps run automatically</li>
            <li>Deployment can be configured to Vercel, Netlify, or a custom server</li>
          </ul>
          <li>See <a href="https://docs.github.com/en/actions" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline flex items-center">GitHub Actions Docs <ExternalLink className="h-3 w-3 ml-1" /></a></li>
        </ul>
      </div>
      <div className="bg-gray-50 border-l-4 border-yellow-400 p-6">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">Further Reading</h3>
        <ul className="list-disc pl-6 text-black text-base">
          <li><a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline">Vite Documentation</a></li>
          <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline">React Documentation</a></li>
          <li><a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline">Tailwind CSS Docs</a></li>
          <li><a href="https://www.chartjs.org/docs/latest/" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline">Chart.js Docs</a></li>
          <li><a href="https://github.com/features/actions" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline">GitHub Actions</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentationTab;
