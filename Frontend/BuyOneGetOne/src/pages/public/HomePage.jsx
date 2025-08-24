import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export default function HomePage() {
  const featuredDeals = [
    {
      id: 1,
      title: 'Buy One Pizza, Get One Free',
      business: 'Tony\'s Pizza Palace',
      discount: '50%',
      image: 'https://via.placeholder.com/300x200?text=Pizza',
      category: 'Food & Beverages',
      endDate: '2024-12-31'
    },
    {
      id: 2,
      title: '2-for-1 Coffee Special',
      business: 'Brew & Bean Café',
      discount: '50%',
      image: 'https://via.placeholder.com/300x200?text=Coffee',
      category: 'Food & Beverages',
      endDate: '2024-12-25'
    },
    {
      id: 3,
      title: 'Buy One Shirt, Get 40% Off Second',
      business: 'Fashion Forward',
      discount: '40%',
      image: 'https://via.placeholder.com/300x200?text=Fashion',
      category: 'Fashion',
      endDate: '2024-12-30'
    }
  ];

  const categories = [
    { name: 'Food & Beverages', icon: '🍕', count: '120+ deals' },
    { name: 'Fashion', icon: '👕', count: '85+ deals' },
    { name: 'Electronics', icon: '📱', count: '65+ deals' },
    { name: 'Health & Beauty', icon: '💄', count: '90+ deals' },
    { name: 'Sports & Outdoors', icon: '⚽', count: '45+ deals' },
    { name: 'Home & Garden', icon: '🏠', count: '75+ deals' }
  ];

  const stats = [
    { label: 'Active Deals', value: '500+', icon: TrendingUp },
    { label: 'Happy Customers', value: '10K+', icon: Users },
    { label: 'Partner Businesses', value: '200+', icon: Award }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Discover Amazing Deals in Your Area
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Save money with exclusive buy-one-get-one offers from local businesses
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search for deals..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              
              <Link to="/browse">
                <Button size="lg" variant="secondary" className="whitespace-nowrap">
                  Browse All Deals
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Deals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't miss out on these amazing offers from our partner businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {deal.discount} OFF
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {deal.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {deal.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {deal.business}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Ends {new Date(deal.endDate).toLocaleDateString()}
                    </span>
                    
                    <Link to={`/promotion/${deal.id}`}>
                      <Button size="sm">
                        View Deal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/browse">
            <Button size="lg">View All Deals</Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find deals in the categories you love most
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/category/${encodeURIComponent(category.name)}`}>
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Are you a business owner?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our platform to attract new customers and increase sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Join as Business
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}