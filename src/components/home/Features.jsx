import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import auth context
// Import background images
import reportingtool from '../../assets/images/reportingtool.jpg';
import heatmap from '../../assets/images/heatmap.jpeg';
import casetracking from '../../assets/images/casetracking.jpg';
import education from '../../assets/images/education.jpg';
import reward from '../../assets/images/reward.jpg';
import govtspending from '../../assets/images/govtspending.jpg';

const Features = () => {
  const { user } = useAuth(); // Get current user from auth context
  const navigate = useNavigate(); // Get navigate function

  // Map features to their background images
  const featureBackgrounds = {
    '/reporting': reportingtool,
    '/heatmap': heatmap,
    '/case': casetracking,
    '/education': education,
    '/reward': reward,
    '/DetailedReport': govtspending
  };

  // Feature data array
  const features = [
    {
      title: "Corruption Reporting Tool",
      path: '/reporting',
      requiresAuth: false, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Safely report corruption incidents with our secure platform"
    },
    {
      title: "Corruption Heatmap",
      path: '/heatmap',
      requiresAuth: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      description: "Visualize corruption hotspots with interactive maps"
    },
    {
      title: "Corruption Case Tracking",
      path: '/case',
      requiresAuth: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      description: "Monitor the progress of corruption cases in real-time"
    },
    {
      title: "Corruption Education Hub",
      path: '/education',
      requiresAuth: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      description: "Educational resources to understand and combat corruption"
    },
    {
      title: "Reward System for Information",
      path: '/reward',
      requiresAuth: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      description: "Get rewarded for providing valuable corruption information"
    },
    {
      title: "Government Spending Tracker",
      path: '/DetailedReport',
      requiresAuth: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Track how public funds are being utilized in every sector"
    }
  ];

  // Handle feature click with authentication check
  const handleFeatureClick = (feature) => {
    if (feature.requiresAuth && !user) {
      // Redirect to login with return path
      navigate('/LoginPage', { state: { from: feature.path } });
    } else {
      navigate(feature.path);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Our <span className="text-orange-600">Anti-Corruption</span> Tools
        </h2>
        <div className="w-24 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Powerful tools designed to combat corruption through transparency, accountability, and citizen engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => handleFeatureClick(feature)}
            className="group relative block overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${featureBackgrounds[feature.path]})` }}
            >
              {/* Gradient overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            <div className="relative p-6 z-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-500/20 backdrop-blur-sm group-hover:bg-orange-500/30 flex items-center justify-center transition-all duration-300 border border-orange-400/30">
                {feature.icon}
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="mt-3 text-orange-100 group-hover:text-orange-50 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center text-orange-300 font-medium group-hover:text-white transition-colors duration-300">
                  Explore feature
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;