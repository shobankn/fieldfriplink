import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../footer/Footer';
import { CiHeart } from "react-icons/ci";
import { LuGraduationCap } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { MdOutlineBalance } from "react-icons/md";

const About = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto">
      <Navbar/>
      {/* Top Banner */}
      <section className="bg-[#ea2127] text-white text-center px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-[106px]">
        <h1 className="text-4xl sm:text-5xl lg:text-[60px] archivobold mb-4 sm:mb-[22px]">About FieldTripLink</h1>
        <p className="text-base sm:text-lg lg:text-[18px] mx-auto max-w-[90%] sm:max-w-[60%] lg:max-w-[40%] interregular">
          Founded on the belief that every student deserves equal access to enrichment opportunities,
          regardless of transportation limitations.
        </p>
      </section>

      {/* Story Section */}
      <section className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-[92px] gap-6 lg:gap-10">
        {/* Image/Avatar Block */}
        <div className="flex-1 flex justify-center">
          <div className="bg-amber-100 rounded-lg p-6 sm:p-8 text-center w-full max-w-[350px] sm:max-w-[400px] h-[300px] sm:h-[350px] flex flex-col justify-center items-center mx-auto">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#be1d1d] text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg">
              AH
            </div>
            <p className="font-semibold mt-4 text-base sm:text-lg">Amanda L. Heyen</p>
            <p className="text-sm text-gray-600">Founder & CEO</p>
          </div>
        </div>
        {/* Story Text */}
        <div className="flex-1">
          <h2 className="archivobold text-2xl sm:text-3xl lg:text-[36px] mb-4">The Story Behind FieldTripLink</h2>
          <p className="text-[#555555] interregular text-sm sm:text-base lg:text-[16px] mb-4 sm:mb-[24px]">
            Amanda L. Heyen founded FieldTripLink after witnessing firsthand how transportation shortages were preventing students from accessing valuable educational experiences. As a former educator, she saw how field trips could transform learning and inspire students, but too often these opportunities were missed due to driver availability.
          </p>
          <p className="text-[#555555] interregular text-sm sm:text-base lg:text-[16px] mb-4 sm:mb-[24px]">
            The turning point came when she learned about a school district that had to cancel multiple field trips in a single semester, leaving hundreds of students without access to hands-on learning experiences at museums, nature centers, and cultural sites.
          </p>
          <p className="text-[#555555] interregular text-sm sm:text-base lg:text-[16px]">
            Determined to solve this problem, Amanda developed FieldTripLink as a secure,
            transparent platform that connects schools with certified drivers while maintaining the
            highest safety standards and promoting educational equity.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="px-4 sm:px-6 lg:px-20 flex flex-col lg:flex-row gap-6 bg-[#f8f9fb] py-12 sm:py-16 lg:py-[64px] justify-center items-center">
        <div className="flex-1 bg-white shadow-md rounded-lg px-6 sm:px-[35px] py-8 sm:py-[41px] flex flex-col justify-center w-full max-w-[450px] sm:max-w-[500px] h-[250px]">
          <div className="text-[#be1d1d] text-2xl mb-2">🎯</div>
          <h3 className="archivobold text-xl sm:text-[24px] mb-2">Our Mission</h3>
          <p className="text-gray-700 interregular text-sm sm:text-[16px]">
            To connect schools and certified bus drivers through a simple, secure platform—ensuring that students never miss an opportunity to learn, grow, and thrive.
          </p>
        </div>
        <div className="flex-1 bg-white shadow-md rounded-lg px-6 sm:px-[35px] py-8 sm:py-[41px] flex flex-col justify-center w-full max-w-[450px] sm:max-w-[500px] h-[250px]">
          <div className="bg-[#FEF9C3] w-10 sm:w-[48px] h-10 sm:h-[53px] flex justify-center items-center rounded-full text-2xl mb-2">
            <CiHeart style={{ fontSize: '28px', color: '#EAB308' }} className="sm:text-[32px]" />
          </div>
          <h3 className="archivobold text-xl sm:text-[24px] mb-2">Our Vision</h3>
          <p className="text-gray-700 interregular text-sm sm:text-[16px]">
            A world where every student has equal access to field trips and educational experiences,
            creating a more equitable and enriching learning environment for all.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white text-center px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-[96px]">
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] archivobold mb-2">Our Core Values</h2>
        <p className="text-[#555555] interregular text-base sm:text-lg lg:text-[18px] mb-6 sm:mb-10 max-w-2xl mx-auto">
          These principles guide everything we do at FieldTripLink.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-10 lg:px-[272px]">
          <div className="flex flex-col items-center">
            <div className="text-[#be1d1d] bg-[#EF4444] h-16 w-16 sm:h-[80px] sm:w-[80px] rounded-full flex items-center justify-center mb-2">
              <LuUsers style={{ fontSize: '28px', color: '#ffffff' }} className="sm:text-[32px]" />
            </div>
            <h4 className="archivobold text-lg sm:text-[20px] mb-1">Safety First</h4>
            <p className="interregular text-sm sm:text-[16px] text-[#555555]">
              Every driver is thoroughly vetted and certified, ensuring the highest safety standards
              for all students.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#EAB308] h-16 w-16 sm:h-[80px] sm:w-[80px] rounded-full flex items-center justify-center mb-2">
              <LuGraduationCap style={{ fontSize: '28px', color: '#ffffff' }} className="sm:text-[32px]" />
            </div>
            <h4 className="archivobold text-lg sm:text-[20px] mb-1">Educational Equity</h4>
            <p className="interregular text-sm sm:text-[16px] text-[#555555]">
              Every student deserves access to enriching experiences, regardless of their school’s
              transportation limitations.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#22C55E] h-16 w-16 sm:h-[80px] sm:w-[80px] rounded-full flex items-center justify-center mb-2">
              <MdOutlineBalance style={{ fontSize: '28px', color: '#ffffff' }} className="sm:text-[32px]" />
            </div>
            <h4 className="archivobold text-lg sm:text-[20px] mb-1">Transparency</h4>
            <p className="interregular text-sm sm:text-[16px] text-[#555555]">
              Our platform promotes fairness through transparent processes and clear communication
              between all parties.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}


      {/* Final Banner */}
      <section className="bg-[#be1d1d] text-white text-center py-12 sm:py-16 lg:py-[62px] px-4 sm:px-6">
        <h2 className="archivobold text-2xl sm:text-3xl lg:text-[36px] mb-3">
          "Shared Drivers. Connected Trips. Enriched Learning."
        </h2>
        <p className="interregular text-base sm:text-lg lg:text-[18px] max-w-2xl mx-auto">
          Join us in creating a world where transportation never stands in the way of education.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default About;