
import React from 'react';
import { Target, Users, Shield, Zap, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage = () => {
  const values = [
    {
      icon: <Target className="text-indigo-600" />,
      title: "Our Mission",
      description: "To make high-quality toy play accessible and sustainable for every child through our innovative rental platform."
    },
    {
      icon: <Shield className="text-indigo-600" />,
      title: "Guaranteed Safety",
      description: "Every toy undergoes a multi-stage sanitization process using medical-grade UV sterilization before it reaches your home."
    },
    {
      icon: <Users className="text-indigo-600" />,
      title: "Community First",
      description: "We are building a community of conscious parents who believe in sharing resources and reducing environmental impact."
    },
    {
      icon: <Zap className="text-indigo-600" />,
      title: "Fast Delivery",
      description: "Our logistics team ensures your chosen toys are delivered within 48 hours, so the fun never has to wait."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-indigo-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Revolutionizing How Kids <span className="text-indigo-600">Play</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              PlayPro was born out of a simple observation: children grow fast, and their toy preferences change even faster. We provide a sustainable way for children to access a world of toys without the clutter.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10">
          <Heart size={400} className="text-indigo-600" />
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">The PlayPro Story</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Founded in 2024, PlayPro started in a small garage with just 50 toys and a dream to make premium education and play accessible to all children, regardless of their background.
              </p>
              <p>
                As parents ourselves, we understood the frustration of buying expensive toys that would be forgotten within a week. We realized that 'access' is more valuable than 'ownership' when it comes to early development.
              </p>
              <p>
                Today, PlayPro serves thousands of families across the country, offering a curated library of over 10,000 international and Indian toy brands aimed at cognitive, social, and physical development.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-indigo-100 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000" 
                alt="Children playing" 
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-indigo-50">
              <p className="text-4xl font-bold text-indigo-600 font-display">10k+</p>
              <p className="text-gray-500 font-medium">Happy Families</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 font-display">What We Stand For</h2>
            <p className="mt-4 text-gray-600">Our values drive every decision we make at PlayPro.</p>
          </motion.div>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, idx) => (
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                key={idx} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sustainable Section */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 italic tracking-tight italic">Better for your kids, better for the planet.</h2>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
              By renting toys, you help reduce plastic waste and promote a circular economy. Together, we can build a greener future for our children to inherit.
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
              Explore Our Toys
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay translate-x-1/3 translate-y-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
};
