import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-800 text-slate-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm">
              Data provided by the World Bank Data360 API
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">
              © {currentYear} Malaysia Economic Dashboard (Group 3)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;