import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

const services = [
  {
    name: "Tyre Puncture Repair",
    description:
      "Connect with local pros for reliable tyre repairs at your location.",
    icon: (
      <svg
        className="w-12 h-12 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M8 12h8" />
      </svg>
    ),
  },
  {
    name: "Battery Replacement",
    description: "Find nearby service providers for fast battery replacements.",
    icon: (
      <svg
        className="w-12 h-12 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
        <path d="M6 7V5a2 2 0 0 1 4 0v2" />
        <path d="M6 17v2a2 2 0 0 0 4 0v-2" />
      </svg>
    ),
  },
  {
    name: "Oil Change",
    description:
      "Browse local professionals offering eco-friendly oil changes.",
    icon: (
      <svg
        className="w-12 h-12 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 5h6v14H3z" />
        <path d="M9 7v10" />
        <path d="M9 13h6v2H9z" />
        <path d="M16 7h2a2 2 0 0 1 0 4h-2v6h-2V7z" />
      </svg>
    ),
  },
];

const features = [
  {
    title: "Easy Booking",
    desc: "Quickly find and connect with the right service providers.",
    icon: (
      <svg
        className="w-10 h-10 text-pink-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10h4l3 7 4-14 3 7h4" />
      </svg>
    ),
  },
  {
    title: "Verified Network",
    desc: "Only verified, trusted service providers are listed on Fixonway.",
    icon: (
      <svg
        className="w-10 h-10 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14l2-2 4 4" />
      </svg>
    ),
  },
  {
    title: "Support Anytime",
    desc: "Need help with a booking? Our support is here for you 24/7.",
    icon: (
      <svg
        className="w-10 h-10 text-yellow-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 3.866 3.134 7 7 7s7-3.134 7-7z" />
        <path d="M12 12v4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Browse Providers",
    desc: "Explore trusted service professionals near your location.",
    icon: (
      <svg
        className="w-8 h-8 text-indigo-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    step: "Step 2",
    title: "Make a Booking",
    desc: "Choose a service, select your time, and confirm your request.",
    icon: (
      <svg
        className="w-8 h-8 text-indigo-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
        <path d="M16 2v4" />
      </svg>
    ),
  },
  {
    step: "Step 3",
    title: "Service Delivered",
    desc: "Your chosen provider completes the job at your location.",
    icon: (
      <svg
        className="w-8 h-8 text-indigo-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10h2l1 5h12l1-5h2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Vehicle Owner",
    quote: "Found a service provider in minutes! Fixonway is a lifesaver.",
  },
  {
    name: "Neha Singh",
    role: "Customer",
    quote: "Easy to book and reliable professionals. Highly recommend it.",
  },
  {
    name: "Ravi Kumar",
    role: "Service Provider",
    quote: "I get more customers through Fixonway than ever before!",
  },
];

export default function FixonwayLandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 text-gray-800 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight tracking-wide animate-fadeInDown">
              Fixonway
            </h1>
            <p className="text-lg md:text-xl max-w-xl animate-fadeIn delay-200">
              Your on-demand vehicle service platform connecting you to trusted
              providers anytime, anywhere.
            </p>
            <Link
              to="/register"
              className="mt-6 bg-pink-500 hover:bg-pink-600 transition-colors text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-110 focus:ring-4 focus:ring-pink-300 inline-block"
            >
              Get Started
            </Link>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="w-full h-64 md:h-96 bg-gradient-to-tr from-pink-400 to-indigo-500 rounded-xl shadow-xl animate-wave">
              {/* Hero image placeholder */}
              <svg
                className="w-full h-full object-cover opacity-80"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="512" height="512" fill="none" />
                <path
                  fill="white"
                  d="M256 48c-103 0-187 84-187 188 0 103 84 187 187 187s187-84 187-187c0-104-84-188-187-188zm0 344c-86 0-156-69-156-156s70-156 156-156 156 69 156 156-70 156-156 156z"
                />
                <path
                  fill="white"
                  d="M256 160a96 96 0 1 0 0 192 96 96 0 0 0 0-192zm0 176a80 80 0 1 1 0-160 80 80 0 0 1 0 160z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Services You Can Book
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {services.map(({ name, description, icon }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition"
            >
              <div className="mb-6">{icon}</div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-indigo-100 py-20 px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Fixonway?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 justify-items-center max-w-6xl mx-auto">
          {features.map(({ title, desc, icon }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-8 shadow-md w-72 justify-items-center text-center"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map(({ step, title, desc, icon }, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-pink-400 to-indigo-500 text-white rounded-xl p-8 text-center justify-items-center"
            >
              <div className="mb-3">{icon}</div>
              <h4 className="font-semibold">{step}</h4>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-indigo-50 py-20 px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-12">What People Say</h2>
        <div className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow-xl">
          <p className="italic text-lg mb-6">
            “{testimonials[currentTestimonial].quote}”
          </p>
          <p className="font-bold">{testimonials[currentTestimonial].name}</p>
          <p className="text-sm text-gray-500">
            {testimonials[currentTestimonial].role}
          </p>
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx === currentTestimonial ? "bg-indigo-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentTestimonial(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-20 px-6 md:px-12 text-center">
        <h2 className="text-4xl font-extrabold mb-6">
          Looking for Vehicle Help?
        </h2>
        <p className="text-lg mb-8">
          Get connected with the right providers — quickly and easily through
          Fixonway.
        </p>
        <Link to="/register">
          <button className="bg-white text-pink-600 font-bold px-10 py-4 rounded-full hover:bg-pink-50 transition">
            Get Started Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />

      {/* Animations with Tailwind + keyframes */}
      <style>{`


  @keyframes fadeInDown {
    0% {opacity: 0; transform: translateY(-20px);}
    100% {opacity: 1; transform: translateY(0);}
  }
  @keyframes fadeInUp {
    0% {opacity: 0; transform: translateY(20px);}
    100% {opacity: 1; transform: translateY(0);}
  }
  @keyframes popIn {
    0% {opacity: 0; transform: scale(0.95);}
    100% {opacity: 1; transform: scale(1);}
  }
 
  @keyframes wave {
    0%, 100% {transform: translateY(0);}
    50% {transform: translateY(-15px);}
  }

  .animate-fadeInDown {
    animation: fadeInDown 1s ease forwards;
  }
  .animate-fadeInUp {
    animation: fadeInUp 1s ease forwards;
  }
  .animate-popIn {
    animation: popIn 0.6s ease forwards;
  }

 
  .animate-wave {
    animation: wave 4s ease infinite;

  }


`}</style>
    </div>
  );
}
