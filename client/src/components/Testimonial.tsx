import React, { useState, useEffect } from 'react';
import { 
  StarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,

} from '@heroicons/react/24/solid';

import Image from 'next/image';
import man2 from '../assets/images/male2.jpeg'
import man1 from '../assets/images/male1.jpeg'
import man3 from '../assets/images/male3.jpeg'
import man4 from '../assets/images/male4.jpeg'
import man5 from '../assets/images/male5.jpeg'
import female1 from '../assets/images/female1.jpeg'
import female2 from '../assets/images/female2.jpeg'
import female3 from '../assets/images/female3.jpeg'
import female4 from '../assets/images/female4.jpeg'
import female5 from '../assets/images/female5.jpeg'
import { QuoteIcon } from 'lucide-react';

// Sample testimonials - replace with your actual testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    testimonial: "This platform has completely transformed my investment journey. The returns are incredible and the security gives me peace of mind. I've recommended it to all my friends!"
  },
  {
    name: "Michael Chen",
    testimonial: "I was skeptical at first, but after seeing consistent profits month after month, I'm convinced this is the future of investing. The customer service is outstanding too."
  },
  {
    name: "Emily Rodriguez",
    testimonial: "As a busy professional, I love how easy it is to manage my investments. The automated features save me so much time while maximizing my returns."
  },
  {
    name: "David Thompson",
    testimonial: "The transparency and real-time updates keep me informed about my investments. I've never felt more confident about my financial future."
  },
  {
    name: "Lisa Anderson",
    testimonial: "Outstanding platform! The risk management tools are sophisticated yet easy to understand. My portfolio has grown beyond my expectations."
  },
  {
    name: "James Wang",
    testimonial: "What impressed me most is the educational resources provided. I've learned so much about investing while earning consistent returns."
  },
  {
    name: "Maria Garcia",
    testimonial: "The mobile app makes it so convenient to track my investments on the go. The interface is intuitive and the performance is excellent."
  },
  {
    name: "Robert Kim",
    testimonial: "I've tried other investment platforms, but none compare to this one. The combination of technology and personal service is unmatched."
  },
  {
    name: "Amanda Davis",
    testimonial: "The automated portfolio rebalancing has optimized my returns without any effort on my part. It's like having a personal financial advisor 24/7."
  },
  {
    name: "Christopher Lee",
    testimonial: "The security measures give me complete confidence in the platform. My investments are safe and the returns speak for themselves."
  }
];

// Sample avatar images (you can replace these with your actual images)
const images = [female1,man1,female2,man2,female3,man3,female4,man4,female5,man5];

interface TheTestimonial {
  name: string;
  testimonial: string;
}

interface TestimonialProps {
  testimonials: TheTestimonial[];
}

const TestimonialCarousel: React.FC<TestimonialProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Render star rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon key={index} className="w-6 h-6 text-yellow-400" />
    ));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main testimonial card */}
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-green-100 p-8 md:p-12 relative overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
        
        {/* Quote icon */}
        <div className="absolute top-6 left-6 opacity-10">
          <QuoteIcon className="w-16 h-16 text-green-600" />
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Star rating */}
          <div className="flex justify-center space-x-1 mb-6">
            {renderStars()}
          </div>

          {/* Testimonial text */}
          <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic font-medium max-w-3xl mx-auto">
            &quot;{currentTestimonial.testimonial}&quot;
          </blockquote>

          {/* User info */}
          <div className="flex flex-col items-center space-y-4 pt-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-30"></div>
          <Image 
            src={images[currentIndex%images.length]}
            alt="Security" 
            width={400} 
            height={300}
            className="w-full h-auto rounded-xl"
          />
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900">
                {currentTestimonial.name}
              </h4>
              <p className="text-green-600 font-medium">Verified Investor</p>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 group"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 group"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-100 ease-linear"
          style={{
            width: `${((currentIndex + 1) / testimonials.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

const Testimonial: React.FC = () => {
  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What our{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              clients
            </span>{" "}
            say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied clients have to say about their investment experience.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <TestimonialCarousel testimonials={testimonials} />

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-100">
            <div className="flex justify-center mb-3">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
              ))}
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-100">
            <div className="text-3xl font-bold text-emerald-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Testimonial;