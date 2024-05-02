import React from "react";
import Banner from "../../components/Banner";
import Categories from "./Categories";
import OurServices from "./OurServices";
import SpecialProducts from "./SpecialProduct";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <div>
      <Banner />
      <Categories />
      <SpecialProducts />
      <Testimonials />
      <OurServices />
    </div>
  );
};

export default Home;