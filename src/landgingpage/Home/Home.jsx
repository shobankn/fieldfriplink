import React, { useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FiShield } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";

// Check authentication and user type from localStorage
const isAuthenticated = !!localStorage.getItem('token');
const userType = localStorage.getItem('userType');

const Home = () => {
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === 'Driver') {
        navigate('/driverdashboard');
      } else if (userType === 'School') {
        navigate('/dashboard');
      }
    }
  }, [navigate, isAuthenticated, userType]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSchoolAdmin = () => {
    navigate('/login', { state: { userType: 'School' } });
  };

  const handleBusDriver = () => {
    navigate('/login', { state: { userType: 'Driver' } });
  };

  const handleHowItWorks = () => {
    navigate('/about');
  };

  return (
    <div className="w-full overflow-x-hidden max-w-[1920px] mx-auto">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-[#d02323] text-white px-4 sm:px-6 lg:px-[80px] py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 min-h-[400px] lg:h-[500px]">
        <div className="lg:w-1/2 w-full text-center lg:text-left">
          <h1 className="archivobold text-3xl sm:text-4xl lg:text-[48px]">
            Connecting Schools to Drivers
          </h1>
          <p className="mb-6 text-base sm:text-lg lg:text-[18px] leading-relaxed interregular">
            Ensure students never miss out on enrichment opportunities due to transportation shortages. Our secure platform connects schools with certified bus drivers instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap">
            <button
              className="bg-[#facc15] text-black text-sm sm:text-[14px] rounded-[6px] interbold w-full sm:w-[206px] h-[40px]"
              onClick={handleGetStarted}
            >
              Get Started<i className="fas fa-arrow-right ms-2"></i>
            </button>
            <button
              className="border border-white w-full sm:w-[153px] h-[40px] rounded-[6px] interbold text-sm sm:text-[14px]"
              onClick={handleHowItWorks}
            >
              How It Works
            </button>
          </div>
        </div>
        <div className="w-[250px] sm:w-[300px] bg-[#da3737] text-center rounded-[6px] py-6 px-4 sm:px-8 flex flex-col items-center gap-2 text-lg sm:text-xl text-[#FFC34C]">
          <p className="archivobold text-3xl sm:text-[48px]">100%</p>
          <p className="text-sm sm:text-[18px] interregular">Vetted Drivers</p>
          <p className="archivobold text-3xl sm:text-[48px]">100%</p>
          <p className="text-sm sm:text-[18px] interregular">Schools Trust</p>
          <p className="archivobold text-3xl sm:text-[48px]">24/7</p>
          <p className="text-sm sm:text-[18px] interregular">Platform Access</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="text-center py-12 sm:py-16 flex items-center justify-center">
        <div className="px-4 sm:px-6">
          <h2 className="archivobold text-2xl sm:text-3xl lg:text-[36px] mb-4 sm:mb-[19px]">
            How FieldTripLink Works
          </h2>
          <p className="interregular text-base sm:text-lg lg:text-[18px] text-[#555555] max-w-2xl mx-auto">
            Our platform streamlines the process of connecting schools with qualified drivers through a simple, secure workflow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 sm:mt-12 gap-6 sm:gap-10">
            {[
              {
                step: '1',
                color: 'bg-red-500',
                title: 'School Posts Trip',
                desc: 'Schools post field trip needs internally, then externally if needed.',
              },
              {
                step: '2',
                color: 'bg-yellow-400',
                title: 'Driver Claims Trip',
                desc: 'Drivers browse available trips and claim suitable ones.',
              },
              {
                step: '✓',
                color: 'bg-green-500',
                title: 'Trip Confirmed',
                desc: 'Confirmation is sent to both parties for a successful trip.',
              },
            ].map(({ step, color, title, desc }) => (
              <div className="flex flex-col items-center max-w-xs text-center" key={title}>
                <div className={`${color} text-white w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full text-lg sm:text-xl font-bold`}>
                  {step}
                </div>
                <h3 className="archivobold text-lg sm:text-xl lg:text-[20px] mt-4 sm:mt-[20px] mb-2 sm:mb-[6px]">{title}</h3>
                <p className="interregular text-sm sm:text-[14px] text-[#555555]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose FieldTripLink */}
      <section className="p-4 sm:p-6 lg:p-[80px] flex flex-col lg:flex-row justify-between bg-gray-50 gap-8">
        <div className="w-full lg:w-1/2">
          <h2 className="archivobold text-2xl sm:text-3xl lg:text-[36px] mb-6 sm:mb-8">
            Why Choose FieldTripLink?
          </h2>
          <div>
            <div className="flex items-start gap-2 mb-4 sm:mb-[23px]">
              <FiShield style={{ fontSize: '24px', color: '#E83E3E' }} className="mt-1" />
              <div>
                <h3 className="archivobold text-lg sm:text-[18px]">Verified & Certified</h3>
                <p className="interregular text-sm sm:text-[14px] text-[#555555]">All drivers undergo comprehensive background checks and maintain current certifications.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 mb-4 sm:mb-[23px]">
              <LuUsers style={{ fontSize: '24px', color: '#FFD700' }} className="mt-1" />
              <div>
                <h3 className="archivobold text-lg sm:text-[18px]">Transparent & Fair</h3>
                <p className="interregular text-sm sm:text-[14px] text-[#555555]">Internal posting first ensures equity while external posting expands opportunities.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaRegClock style={{ fontSize: '24px', color: '#4CAF50' }} className="mt-1" />
              <div>
                <h3 className="archivobold text-lg sm:text-[18px]">Quick & Reliable</h3>
                <p className="interregular text-sm sm:text-[14px] text-[#555555]">Reduce delays and ensure every student gets to participate in enrichment activities.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 sm:mt-8 lg:mt-10 w-full lg:w-1/2">
          <h1 className="archivobold text-2xl sm:text-3xl lg:text-[36px] mb-6">Ready to Get Started?</h1>
          <button
            className="bg-red-500 w-full sm:w-[300px] lg:w-[400px] h-[40px] interbold text-sm sm:text-[14px] text-white rounded-[6px] mt-4 sm:mt-[32px] hover:bg-red-600 cursor-pointer"
            onClick={handleSchoolAdmin}
          >
            I'm a School Administrator
          </button>
          <br />
          <button
            className="bg-yellow-400 w-full sm:w-[300px] lg:w-[400px] h-[40px] interbold text-sm sm:text-[14px] text-black rounded-[6px] mt-4 hover:bg-yellow-500 cursor-pointer"
            onClick={handleBusDriver}
          >
            I'm a Bus Driver
          </button>
        </div>
      </section>

      {/* What Our Users Say */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-20 bg-gray-100">
        <h2 className="archivobold text-2xl sm:text-3xl lg:text-[36px] text-center mb-4 sm:mb-[19px]">
          What Our Users Say
        </h2>
        <p className="text-center interregular text-base sm:text-lg lg:text-[18px] text-[#555555] mb-6 sm:mb-8 max-w-2xl mx-auto">
          Schools and drivers trust FieldTripLink to make field trips happen.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <div className="bg-[#2A2A2A] p-6 sm:p-[32px] shadow-md w-full sm:w-[500px] lg:w-[550px] rounded-[8px] text-white">
            <p className="text-white italic text-sm sm:text-base">"FieldTripLink saved our science museum trip when our regular driver called in sick. The replacement driver was professional, on time, and the kids had a great experience."</p>
            <div className="flex mt-4 sm:mt-[21px] gap-2 sm:gap-[10px]">
              <span className="inline-block bg-[#E83E3E] h-10 w-10 sm:h-[48px] sm:w-[48px] text-center leading-10 sm:leading-[48px] rounded-full text-sm sm:text-base">
                OJ
              </span>
              <p className="text-sm sm:text-base">
                Oliver Johnson
                <br />
                Certified School Owner
              </p>
            </div>
          </div>
          <div className="bg-[#2A2A2A] p-6 sm:p-[32px] shadow-md w-full sm:w-[500px] lg:w-[550px] rounded-[8px] tokenext-white">
            <p className="text-white italic text-sm sm:text-base">"As a retired driver, FieldTripLink lets me stay connected to the community while earning extra income. The platform is easy to use and the schools are always grateful."</p>
            <div className="flex mt-4 sm:mt-[21px] gap-2 sm:gap-[10px]">
              <span className="inline-block bg-[#FFD700] h-10 w-10 sm:h-[48px] sm:w-[48px] text-center leading-10 sm:leading-[48px] rounded-full text-sm sm:text-base">
                RJ
              </span>
              <p className="text-sm sm:text-base text-white">
                Robert Johnson
                <br />
                Certified Bus Driver
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;