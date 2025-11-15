import React, { useState, useEffect } from "react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FiUser, FiStar } from "react-icons/fi";
import { API_BASE, API_ENDPOINTS } from "../../config/api";

const Trainers = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize scroll position
    window.scrollTo(0, 0);

    // Check screen size on mount and on resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Fetch trainers from API
    fetchTrainers();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.TRAINERS);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch trainers");
      }

      if (result.success && result.data) {
        setTrainers(result.data);
      }
    } catch (err) {
      console.error("Error fetching trainers:", err);
      setError(err.message || "Failed to load trainers");
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get social media link
  const getSocialLink = (trainer, platform) => {
    switch (platform) {
      case "facebook":
        return trainer.facebook || "#";
      case "linkedin":
        return trainer.linkedin || "#";
      default:
        return "#";
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading trainers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Trainers
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchTrainers}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <div className="text-gray-400 text-5xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Trainers Available
            </h2>
            <p className="text-gray-600">
              No trainers found. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Floating decoration elements */}
      <div className="absolute top-10 left-0 w-full h-full pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? "#fb923c" : i % 3 === 1 ? "#60a5fa" : "#34d399"
              } 0%, transparent 70%)`,
              animation: `float ${
                Math.random() * 15 + 15
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-orange-600">Expert</span> Trainers
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from industry leaders with years of experience in
            anti-corruption training
          </p>
        </div>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={isMobile ? 1 : Math.min(trainers.length, 3)}
          spaceBetween={isMobile ? 20 : 40}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={trainers.length > 3}
          modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
          loop={trainers.length > 1}
          className="trainers-swiper"
        >
          {trainers.map((trainer) => (
            <SwiperSlide key={trainer._id}>
              <div className="relative group">
                <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:border-orange-400">
                  {trainer.photo ? (
                    <img
                      className="w-full h-full object-cover"
                      src={trainer.photo}
                      alt={trainer.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x300/f97316/ffffff?text=" +
                          trainer.name.charAt(0);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <FiUser className="text-white text-6xl md:text-8xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-6">
                    <span className="text-white font-medium">View Profile</span>
                  </div>
                </div>

                <div className="mt-8 text-center transform transition-all duration-500 group-hover:-translate-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {trainer.name}
                  </h3>
                  <p className="text-orange-600 mt-1">
                    {trainer.expertise || "Anti-Corruption Specialist"}
                  </p>

                  {trainer.phone && (
                    <p className="text-gray-600 text-sm mt-2">
                      📞 {trainer.phone}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex justify-center space-x-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(trainer.rating || 5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Social Media Links */}
                  <div className="flex justify-center space-x-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {trainer.facebook && (
                      <a
                        href={trainer.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                        </svg>
                      </a>
                    )}

                    {trainer.linkedin && (
                      <a
                        href={trainer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                        </svg>
                      </a>
                    )}

                    {!trainer.facebook && !trainer.linkedin && (
                      <span className="text-sm text-gray-400">
                        Connect with {trainer.name.split(" ")[0]}
                      </span>
                    )}
                  </div>

                  {/* Trainer ID Badge */}
                  {trainer.trainerId && (
                    <div className="mt-4">
                      <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        ID: {trainer.trainerId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-16 text-center">
          <div className="mb-4 text-gray-600">
            <span className="font-semibold text-orange-600">
              {trainers.length}
            </span>{" "}
            expert trainers ready to help you
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            View All Trainers
          </button>
        </div>
      </div>

      <style jsx global>{`
        .trainers-swiper {
          padding: 30px 0 60px;
        }

        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #f97316, #ea580c);
          width: 30px;
          border-radius: 8px;
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: #f97316;
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #f97316;
          color: white;
          transform: scale(1.1);
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -10px) rotate(90deg);
          }
          50% {
            transform: translate(-5px, 10px) rotate(180deg);
          }
          75% {
            transform: translate(-10px, -5px) rotate(270deg);
          }
        }

        .swiper-slide {
          transition: transform 0.5s ease;
        }

        .swiper-slide-active {
          transform: scale(1.1);
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default Trainers;
