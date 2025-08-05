import React from 'react';

const About = () => {
  return (
    <div className="w-full">
      {/* Top Banner */}
      <section className="bg-[#ea2127]  text-white text-center px-4 py-[106px]">
        <h1 className="text-[60px] archivobold mb-[22px]">About FieldTripLink</h1>
        <p className="text-[18px] mx-auto w-[40%] ">
          Founded on the belief that every student deserves equal access to enrichment opportunities,
          regardless of transportation limitations.
        </p>
      </section>

      {/* Story Section */}
      <section className="flex flex-col lg:flex-row px-6 lg:px-20 py-[92px] gap-10">
        {/* Image/Avatar Block */}
        <div className="flex-1 flex justify-center ">
          <div className="bg-amber-100 rounded-lg p-8 text-center w-[400px] h-[350px] flex flex-col justify-center items-center mx-auto my-auto">
            <div className="w-16 h-16 bg-[#be1d1d] text-white rounded-full mx-auto flex items-center justify-center font-bold text-lg">
              AH
            </div>
            <p className="font-semibold mt-4">Amanda L. Heyen</p>
            <p className="text-sm text-gray-600">Founder & CEO</p>
          </div>
        </div>
        {/* Story Text */}
        <div className="flex-1">
          <h2 className="archivobold text-[36px] mb-4">The Story Behind FieldTripLink</h2>
          <p className=" text-[#555555] interregular  mb-[24px]  ">
           Amanda L. Heyen founded FieldTripLink after witnessing firsthand how transportation shortages were preventing students from accessing valuable educational experiences. As a former educator, she saw how field trips could transform learning and inspire students, but too often these opportunities were missed due to driver availability.
          </p>
          <p className="text-[#555555] interregular   mb-[24px]">The turning point came when she learned about a school district that had to cancel multiple field trips in a single semester, leaving hundreds of students without access to hands-on learning experiences at museums, nature centers, and cultural sites.</p>
          <p className="text-[#555555] interregular   ">
            Determined to solve this problem, Amanda developed FieldTripLink as a secure,
            transparent platform that connects schools with certified drivers while maintaining the
            highest safety standards and promoting educational equity.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="px-6 lg:px-20 flex flex-col justify-center items-center lg:flex-row gap-6 flex-1 bg-[#f8f9fb] py-[64px]">
        <div className="flex-1 bg-white shadow-md rounded-lg px-[35px] py-[41px] flex flex-col  justify-center w-[500px] h-[250px]">
          <div className="text-[#be1d1d] text-2xl mb-2">🎯</div>
          <h3 className="archivobold text-[24px] mb-2">Our Mission</h3>
          <p className="text-gray-700 interregular text-[16px]">
            To connect schools with certified school bus drivers through a secure, easy-to-use
            platform that ensures students never miss out on enrichment opportunities due to
            transportation shortages.
          </p>
        </div>
        <div className="flex-1 bg-white shadow-md rounded-lg px-[35px] py-[41px] flex flex-col  justify-center w-[500px] h-[250px]">
          <div className="text-yellow-400 text-2xl mb-2">💛</div>
          <h3 className="archivobold text-[24px] mb-2">Our Vision</h3>
          <p className="text-gray-700 interregular text-[16px]">
            A world where every student has equal access to field trips and educational experiences,
            creating a more equitable and enriching learning environment for all.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white text-center px-6 lg:px-20 py-[96px]">
        <h2 className="text-[36px] archivobold mb-2">Our Core Values</h2>
        <p className="text-[#555555] interregular text-[18px] mb-10">
          These principles guide everything we do at FieldTripLink.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left md:text-center px-[272px]">
          <div>
            <div className="text-[#be1d1d] text-3xl mb-2">🛡️</div>
            <h4 className="archivobold text-[20px] mb-1">Safety First</h4>
            <p className="interregular text-[16px] text-[#555555] ">
              Every driver is thoroughly vetted and certified, ensuring the highest safety standards
              for all students.
            </p>
          </div>
          <div>
            <div className="text-yellow-400 text-3xl mb-2">🎓</div>
            <h4 className="archivobold text-[20px] mb-1">Educational Equity</h4>
            <p className="interregular text-[16px] text-[#555555] ">
              Every student deserves access to enriching experiences, regardless of their school’s
              transportation limitations.
            </p>
          </div>
          <div>
            <div className="text-green-500 text-3xl mb-2">⚖️</div>
            <h4 className="archivobold text-[20px] mb-1">Transparency</h4>
            <p className="interregular text-[16px] text-[#555555] ">
              Our platform promotes fairness through transparent processes and clear communication
              between all parties.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#111827] text-white px-6 lg:px-20 py-[96px] text-center">
        <h2 className="archivobold text-[36px] mb-2">Our Team</h2>
        <p className="text-[18px] interregular mb-10">
          Dedicated professionals working to make field trips accessible for all students.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-cente px-[216px]">
          {/* Amanda */}
          <div>
            <div className="w-20 h-20 bg-[#f44336] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              AH
            </div>
            <p className="mt-3 font-semibold">Amanda L. Heyen</p>
            <p className="text-sm text-gray-400">Founder & CEO</p>
          </div>
          {/* Tech */}
          <div>
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              TM
            </div>
            <p className="mt-3 font-semibold">Tech Team</p>
            <p className="text-sm text-gray-400">Platform Development</p>
          </div>
          {/* Safety */}
          <div>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ST
            </div>
            <p className="mt-3 font-semibold">Safety Team</p>
            <p className="text-sm text-gray-400">Driver Vetting & Compliance</p>
          </div>
        </div>
      </section>

      {/* Final Banner */}
      <section className="bg-[#be1d1d] text-white text-center py-[62px] px-4">
        <h2 className="archivobold text-[36px] mb-3">
          "Shared Drivers. Connected Trips. Enriched Learning."
        </h2>
        <p className='interregular text-[18px]'>
          Join us in creating a world where transportation never stands in the way of education.
        </p>
      </section>
    </div>
  );
};

export default About;
