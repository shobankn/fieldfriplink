import React from 'react';

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden max-w-[1920px] mx-auto">
      

      {/* Hero Section */}
      <section className="bg-[#d02323] text-white px-[80px] flex flex-col lg:flex-row items-center justify-between gap-10 h-[500px]">
        <div className="lg:w-1/2">
          <h1 className="archivobold text-[48px]">
            Connecting Schools to Drivers
          </h1>
          <p className="mb-6 text-[18px] leading-relaxed interregular">
            Ensure students never miss out on enrichment opportunities due to transportation shortages. Our secure platform connects schools with certified bus drivers instantly.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-[#facc15] text-black text-[14px] rounded-[6px] interbold w-[206px] h-[40px]">
              Get Started<i className="fas fa-arrow-right ms-2"></i>

            </button>
            <button className="border border-white w-[153px] h-[40px] rounded-[6px] interbold text-[14px]">
              How It Works
            </button>
          </div>
        </div>
        <div className="w-[300px] bg-[#da3737] text-center rounded-[6px] py-6 px-8 flex flex-col items-center gap-2 text-xl  text-[#FFC34C]">
          <p className='archivobold  text-[48px]'>100%</p>
          <p className=" text-[18px] interregular">Vetted Drivers</p>
          <p className='archivobold  text-[48px]'>100%</p>
          <p className=" text-[18px] interregular">Schools Trust</p>
          <p className='archivobold  text-[48px]' >24/7</p>
          <p className=" text-[18px] interregular">Platform Access</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="text-center h-[512px] flex items-center justify-center ">
        <div>
        <h2 className="archivobold text-[36px] mb-[19px]  ">
          How FieldTripLink Works
        </h2>
        <p className="interregular text-[18px] text-[#555555]">
          Our platform streamlines the process of connecting schools with qualified drivers through a simple, secure workflow.
        </p>
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-10">
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
            <div className="flex flex-col items-center max-w-sm text-center" key={title}>
              <div className={`${color} text-white w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold`}>
                {step}
              </div>
              <h3 className="archivobold text-[20px] mt-[20px] mb-[6px]">{title}</h3>
              <p className="interregular text-[14px] text-[#555555] ">{desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Why Choose FieldTripLink */}
      <section className="p-[80px] pe-[168px] flex justify-between bg-gray-50">
        <div>
        <h2 className="archivobold text-[36px] mb-8">
          Why Choose FieldTripLink?
        </h2>
        <div className="">
          <div className="flex items-start gap-2 mb-[23px]">
            <i
  className="fas fa-shield-alt"
  style={{
    borderRadius: '50%',
    padding: '10px',
    color: 'red',
  }}
></i>

            <div>
              <h3 className="archivobold text-[18px]">Verified & Certified</h3>
              <p className="interregular text-[14px] text-[#555555]">All drivers undergo comprehensive background checks and maintain current certifications.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 mb-[23px]">
             <i
  className="fas fa-shield-alt"
  style={{
    borderRadius: '50%',
    padding: '10px',
    color: 'red',
  }}
></i>
            <div>
              <h3 className="archivobold text-[18px]">Transparent & Fair</h3>
              <p className="interregular text-[14px] text-[#555555]">Internal posting first ensures equity while external posting expands opportunities.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <i
  className="fas fa-shield-alt"
  style={{
    borderRadius: '50%',
    padding: '10px',
    color: 'red',
  }}
></i>
            <div>
              <h3 className="archivobold text-[18px]">Quick & Reliable</h3>
              <p className="interregular text-[14px] text-[#555555]">Reduce delays and ensure every student gets to participate in enrichment activities.</p>
            </div>
          </div>
        </div>
        </div>
        <div className="text-center mt-10">
          <h1 className='archivobold text-[36px]'>Ready to Get Started?</h1>
          <button className="bg-red-500 w-[400px] h-[40px] interbold text-[14px] text-white px-6 py-2 me-2 rounded-[6px] mt-[32px]  hover:bg-red-600">I'm a School Administrator</button><br></br>
          <button className="bg-yellow-400 w-[400px] h-[40px] interbold text-[14px] text-black  py-2 rounded-[6px] mt-4 hover:bg-yellow-500">I'm a Bus Driver</button>
        </div>
      </section>

      {/* What Our Users Say */}
      <section className="py-16 px-4 lg:px-20 bg-gray-100">
        <h2 className="archivobold text-[36px] text-center mb-[19px]">
          What Our Users Say
        </h2>
        <p className="text-center interregular text-[18px] text-[#555555] mb-8">Schools and drivers trust FieldTripLink to make field trips happen.</p>
        <div className="flex justify-center gap-5 ">
          <div className="bg-[#2A2A2A] p-[32px] shadow-md w-[550px] rounded-[8px] text-[white]">
            <p className="text-white italic">"FieldTripLink saved our science museum trip when our regular driver called in sick. The replacement driver was professional, on time, and the kids had a great experience."</p>
            <p className="mt-4 text-right font-semibold">SM<br />Sarah Mitchell<br />Transportation Director, Lincoln Elementary</p>
          </div>
          <div className="bg-[#2A2A2A] p-[32px] shadow-md w-[550px] rounded-[8px] text-[white]">
            <p className="text-white italic">"As a retired driver, FieldTripLink lets me stay connected to the community while earning extra income. The platform is easy to use and the schools are always grateful."</p>
            <p className="mt-4 text-right font-semibold">RJ<br />Robert Johnson<br />Certified Bus Driver</p>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default Home;