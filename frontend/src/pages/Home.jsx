import React from 'react';
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div className="overflow-x-hidden bg-rose-50">
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      <Testimonials />
    </div>
  );
};

export default Home;
