import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import TrustSection from '../components/landing/TrustSection';
import HowItWorks from '../components/landing/HowItWorks';
import ProductShowcase from '../components/landing/ProductShowcase';
import FeaturesSection from '../components/landing/FeaturesSection';
import UseCases from '../components/landing/UseCases';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

const HomePage = () => {
  return (
    <div className="landing-page">
      <LandingNavbar />
      <HeroSection />
      <TrustSection />
      <div id="how-it-works"><HowItWorks /></div>
      <ProductShowcase />
      <div id="features"><FeaturesSection /></div>
      <UseCases />
      <div id="testimonials"><Testimonials /></div>
      <div id="faq"><FAQ /></div>
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default HomePage;
