import React from 'react';
import { Target, Eye, Award, CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">About TechcodeSolution</h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
          We are dedicated to providing the best environment for developers to grow, learn, and excel in the world of programming.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-blue-100 text-primary rounded-2xl flex items-center justify-center mb-6">
            <Target size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            To empower aspiring and professional developers by providing high-quality roadmaps, practice problems, and competitive environments that bridge the gap between theory and industry standards.
          </p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Eye size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            To become the world's most trusted platform for coding education and recruitment, where every developer finds the resources they need to build the future.
          </p>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Modern UI/UX', desc: 'Clean and intuitive interface designed for focus.' },
            { title: 'Real-time Execution', desc: 'Run your code instantly using our powerful API.' },
            { title: 'Expert Roadmaps', desc: 'Curated paths to guide your career journey.' },
            { title: 'Global Contests', desc: 'Compete with developers from around the world.' }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-lg font-bold mb-2">{item.title}</h4>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary rounded-3xl p-12 text-center text-white">
        <Award size={64} className="mx-auto mb-6 opacity-80" />
        <h2 className="text-4xl font-bold mb-4">Ready to start your journey?</h2>
        <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">Join thousands of developers who are already mastering their craft on TechcodeSolution.</p>
        <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default About;
