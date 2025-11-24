import React, { useState } from 'react';
import { Menu, X, Plane, MapPin, Calendar, Users, Star, Phone, Mail, Clock, Facebook, Twitter, Instagram, Shield, Award, HeadphonesIcon, Globe } from 'lucide-react';

export default function InfiyWings() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageForPayment, setSelectedPackageForPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1,
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: '',
    bankName: ''
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentErrors, setPaymentErrors] = useState({});

  const packages = [
    {
      id: 1,
      name: 'Bali Beach Paradise',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
      duration: '7 Days / 6 Nights',
      price: 1299,
      rating: 4.8,
      description: 'Experience the magic of Bali with pristine beaches and cultural wonders',
      badge: 'Popular'
    },
    {
      id: 2,
      name: 'Swiss Alps Adventure',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
      duration: '10 Days / 9 Nights',
      price: 2499,
      rating: 4.9,
      description: 'Breathtaking mountain scenery and alpine adventures await you',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Paris Romance Getaway',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
      duration: '5 Days / 4 Nights',
      price: 1799,
      rating: 4.7,
      description: 'Fall in love with the City of Light and its timeless charm',
      badge: null
    },
    {
      id: 4,
      name: 'Tokyo Cultural Experience',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
      duration: '8 Days / 7 Nights',
      price: 2199,
      rating: 4.9,
      description: 'Immerse yourself in ancient traditions and modern marvels',
      badge: null
    },
    {
      id: 5,
      name: 'Maldives Luxury Escape',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
      duration: '6 Days / 5 Nights',
      price: 3299,
      rating: 5.0,
      description: 'Ultimate luxury in overwater villas with crystal clear waters',
      badge: 'Luxury'
    },
    {
      id: 6,
      name: 'Safari in Kenya',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
      duration: '9 Days / 8 Nights',
      price: 2899,
      rating: 4.8,
      description: 'Witness the majesty of African wildlife in their natural habitat',
      badge: null
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'Infiy Wings made our dream vacation a reality! The Bali package was perfectly organized.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      location: 'London, UK',
      text: 'Outstanding service from booking to return. The Swiss Alps trip was unforgettable!',
      rating: 5
    },
    {
      name: 'Emma Williams',
      location: 'Sydney, Australia',
      text: 'Professional, reliable, and truly care about their customers. Highly recommend!',
      rating: 5
    }
  ];

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 3000);
  };

  const handleViewDetails = (packageId) => {
    setSelectedPackageId(packageId);
    setCurrentPage('packages');
    setTimeout(() => {
      const element = document.getElementById(`package-${packageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleBookNow = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    setSelectedPackageForPayment(pkg);
    setCurrentPage('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentDataChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateCardNumber = (number) => {
    return /^[0-9]{16}$/.test(number.replace(/\s/g, ''));
  };

  const validateExpiry = (expiry) => {
    return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry);
  };

  const validateCVV = (cvv) => {
    return /^[0-9]{3,4}$/.test(cvv);
  };

  const validateUPI = (upi) => {
    return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    
    if (!paymentData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!validateEmail(paymentData.email)) {
      errors.email = 'Please enter a valid email address (e.g., user@example.com)';
    }
    
    if (!validatePhone(paymentData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (paymentData.tickets < 1 || paymentData.tickets > 10) {
      errors.tickets = 'Number of tickets must be between 1 and 10';
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(paymentData.cardNumber)) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!paymentData.cardName.trim()) {
        errors.cardName = 'Cardholder name is required';
      }
      
      if (!paymentData.cardExpiry.trim()) {
        errors.cardExpiry = 'Expiry date is required';
      } else if (!validateExpiry(paymentData.cardExpiry)) {
        errors.cardExpiry = 'Please enter expiry in MM/YY format (e.g., 12/25)';
      }
      
      if (!paymentData.cardCVV.trim()) {
        errors.cardCVV = 'CVV is required';
      } else if (!validateCVV(paymentData.cardCVV)) {
        errors.cardCVV = 'Please enter a valid 3 or 4 digit CVV';
      }
    }

    if (paymentData.paymentMethod === 'upi') {
      if (!paymentData.upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!validateUPI(paymentData.upiId)) {
        errors.upiId = 'Please enter a valid UPI ID (e.g., username@upi)';
      }
    }

    if (paymentData.paymentMethod === 'netbanking' && !paymentData.bankName) {
      errors.bankName = 'Please select a bank';
    }

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setPaymentErrors({});
    const totalPrice = selectedPackageForPayment.price * paymentData.tickets;
    
    setPaymentDetails({
      bookingId: 'INF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: paymentData.name,
      email: paymentData.email,
      phone: paymentData.phone,
      package: selectedPackageForPayment.name,
      tickets: paymentData.tickets,
      pricePerTicket: selectedPackageForPayment.price,
      totalPrice: totalPrice,
      paymentMethod: paymentData.paymentMethod,
      date: new Date().toLocaleDateString()
    });
    
    setPaymentSuccess(true);
  };

  const closePaymentPopup = () => {
    setPaymentSuccess(false);
    setPaymentData({
      name: '',
      email: '',
      phone: '',
      tickets: 1,
      paymentMethod: 'card',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCVV: '',
      upiId: '',
      bankName: ''
    });
    setPaymentErrors({});
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Infiy Wings</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'packages', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`text-gray-700 hover:text-blue-600 capitalize font-medium transition ${
                    currentPage === page ? 'text-blue-600 border-b-2 border-blue-600' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="text-white ">
                  _____________________________
            </button>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {['home', 'about', 'packages', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 capitalize ${
                    currentPage === page ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {currentPage === 'home' && (
        <div className="mt-16">
          <div className="relative h-screen bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="text-white max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Your Next Adventure</h1>
                <p className="text-xl md:text-2xl mb-8">Explore the world with Infiy Wings</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setCurrentPage('packages')}
                    className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Explore Packages
                  </button>
                  <button
                    onClick={() => setCurrentPage('about')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { icon: Award, title: 'Best Prices', desc: 'Guaranteed competitive rates' },
                  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round the clock assistance' },
                  { icon: Shield, title: 'Secure Booking', desc: 'Safe and protected transactions' },
                  { icon: Globe, title: 'Expert Guides', desc: 'Experienced travel professionals' }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition">
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center mb-12">Popular Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.slice(0, 3).map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                    <div className="relative">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
                      {pkg.badge && (
                        <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({pkg.rating})</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">From ${pkg.price}</span>
                        <button 
                          onClick={() => handleViewDetails(pkg.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentPage('packages')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
                >
                  View All Packages
                </button>
              </div>
            </div>
          </div>

          <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center mb-12">What Our Travelers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'about' && (
        <div className="mt-16">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative text-center text-white">
              <h1 className="text-5xl font-bold mb-2">About Infiy Wings</h1>
              <p className="text-xl">Crafting Unforgettable Travel Experiences</p>
            </div>
          </div>

          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                  <p className="text-gray-700 mb-4">
                    Since 2010, Infiy Wings has been passionate about creating extraordinary travel experiences. 
                    What started as a small dream has grown into a trusted travel partner for thousands of adventurers 
                    around the globe.
                  </p>
                  <p className="text-gray-700 mb-4">
                    We believe that travel is more than just visiting new places. It is about creating memories, 
                    discovering cultures, and transforming perspectives. Our dedicated team works tirelessly to 
                    ensure every journey with us is seamless and unforgettable.
                  </p>
                  <p className="text-gray-700">
                    From exotic beaches to mountain peaks, bustling cities to serene countryside, we curate 
                    experiences that cater to every traveler dream.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-orange-100 h-96 rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { title: 'Integrity', desc: 'Honest and transparent in all our dealings' },
                  { title: 'Customer Focus', desc: 'Your satisfaction is our top priority' },
                  { title: 'Innovation', desc: 'Constantly evolving to serve you better' },
                  { title: 'Sustainability', desc: 'Committed to responsible tourism' }
                ].map((value, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="h-16 w-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{value.title[0]}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { number: '10,000+', label: 'Happy Travelers' },
                  { number: '50+', label: 'Destinations' },
                  { number: '15', label: 'Years Experience' }
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-xl text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-20 bg-blue-600 text-white text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
              <p className="text-xl mb-8">Join thousands of satisfied travelers and start your journey today</p>
              <button
                onClick={() => setCurrentPage('packages')}
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse Packages
              </button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'packages' && (
        <div className="mt-16">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative text-center text-white">
              <h1 className="text-5xl font-bold mb-2">Travel Packages</h1>
              <p className="text-xl">Find Your Perfect Getaway</p>
            </div>
          </div>

          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    id={`package-${pkg.id}`}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition ${selectedPackageId === pkg.id ? 'ring-4 ring-blue-500' : ''}`}
                  >
                    <div className="relative">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-56 object-cover" />
                      {pkg.badge && (
                        <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-3">{pkg.name}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-gray-600">({pkg.rating})</span>
                      </div>
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 mr-1" />
                          <span>Flights</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Hotels</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Guide</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <div className="text-sm text-gray-600">From</div>
                          <div className="text-3xl font-bold text-blue-600">${pkg.price}</div>
                        </div>
                        <button 
                          onClick={() => handleBookNow(pkg.id)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'payment' && selectedPackageForPayment && (
        <div className="mt-16">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative text-center text-white">
              <h1 className="text-5xl font-bold mb-2">Complete Your Booking</h1>
              <p className="text-xl">Secure Payment Gateway</p>
            </div>
          </div>

          <div className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-6">Payment Details</h2>
                    
                    {Object.keys(paymentErrors).length > 0 && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {Object.values(paymentErrors).map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={paymentData.name}
                          onChange={handlePaymentDataChange}
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Enter your full name"
                        />
                        {paymentErrors.name && <p className="text-red-500 text-sm mt-1">{paymentErrors.name}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={paymentData.email}
                            onChange={handlePaymentDataChange}
                            required
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="your@email.com"
                          />
                          {paymentErrors.email && <p className="text-red-500 text-sm mt-1">{paymentErrors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={paymentData.phone}
                            onChange={handlePaymentDataChange}
                            required
                            pattern="[0-9]{10}"
                            maxLength="10"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="10-digit number"
                          />
                          {paymentErrors.phone && <p className="text-red-500 text-sm mt-1">{paymentErrors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Number of Tickets *</label>
                        <input
                          type="number"
                          name="tickets"
                          value={paymentData.tickets}
                          onChange={handlePaymentDataChange}
                          required
                          min="1"
                          max="10"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.tickets ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {paymentErrors.tickets && <p className="text-red-500 text-sm mt-1">{paymentErrors.tickets}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Payment Method *</label>
                        <select
                          name="paymentMethod"
                          value={paymentData.paymentMethod}
                          onChange={handlePaymentDataChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="card">Credit/Debit Card</option>
                          <option value="upi">UPI</option>
                          <option value="netbanking">Net Banking</option>
                        </select>
                      </div>

                      {paymentData.paymentMethod === 'card' && (
                        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-lg mb-4">Card Details</h3>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Card Number *</label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={paymentData.cardNumber}
                              onChange={handlePaymentDataChange}
                              required
                              maxLength="16"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="1234567890123456"
                            />
                            {paymentErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{paymentErrors.cardNumber}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Cardholder Name *</label>
                            <input
                              type="text"
                              name="cardName"
                              value={paymentData.cardName}
                              onChange={handlePaymentDataChange}
                              required
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Name on card"
                            />
                            {paymentErrors.cardName && <p className="text-red-500 text-sm mt-1">{paymentErrors.cardName}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Expiry *</label>
                              <input
                                type="text"
                                name="cardExpiry"
                                value={paymentData.cardExpiry}
                                onChange={handlePaymentDataChange}
                                required
                                placeholder="MM/YY"
                                maxLength="5"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.cardExpiry ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              {paymentErrors.cardExpiry && <p className="text-red-500 text-sm mt-1">{paymentErrors.cardExpiry}</p>}
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">CVV *</label>
                              <input
                                type="text"
                                name="cardCVV"
                                value={paymentData.cardCVV}
                                onChange={handlePaymentDataChange}
                                required
                                maxLength="4"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentErrors.cardCVV ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="123"
                              />
                              {paymentErrors.cardCVV && <p className="text-red-500 text-sm mt-1">{paymentErrors.cardCVV}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentData.paymentMethod === 'upi' && (
                        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-lg mb-4">UPI Details</h3>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">UPI ID *</label>
                            <input
                              type="text"
                              name="upiId"
                              value={paymentData.upiId}
                              onChange={handlePaymentDataChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="yourname@upi"
                            />
                          </div>
                        </div>
                      )}

                      {paymentData.paymentMethod === 'netbanking' && (
                        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-lg mb-4">Net Banking</h3>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Select Bank *</label>
                            <select
                              name="bankName"
                              value={paymentData.bankName}
                              onChange={handlePaymentDataChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                              <option value="">Choose your bank</option>
                              <option value="SBI">State Bank of India</option>
                              <option value="HDFC">HDFC Bank</option>
                              <option value="ICICI">ICICI Bank</option>
                              <option value="Axis">Axis Bank</option>
                              <option value="PNB">Punjab National Bank</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                      >
                        Pay ${selectedPackageForPayment.price * paymentData.tickets}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                    <h3 className="text-2xl font-bold mb-4">Booking Summary</h3>
                    <img 
                      src={selectedPackageForPayment.image} 
                      alt={selectedPackageForPayment.name} 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h4 className="text-xl font-semibold mb-2">{selectedPackageForPayment.name}</h4>
                    <p className="text-gray-600 mb-4">{selectedPackageForPayment.duration}</p>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per ticket:</span>
                        <span className="font-semibold">${selectedPackageForPayment.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of tickets:</span>
                        <span className="font-semibold">{paymentData.tickets}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span className="text-blue-600">${selectedPackageForPayment.price * paymentData.tickets}</span>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        Secure Payment
                      </h5>
                      <p className="text-sm text-gray-600">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'contact' && (
        <div className="mt-16">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative text-center text-white">
              <h1 className="text-5xl font-bold mb-2">Get In Touch</h1>
              <p className="text-xl">We are here to help you plan your perfect trip</p>
            </div>
          </div>

          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                  {formSubmitted && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      Thank you! We will get back to you soon.
                    </div>
                  )}
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>General Inquiry</option>
                        <option>Booking</option>
                        <option>Support</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        required
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Office Address</h3>
                        <p className="text-gray-600">123 Travel Street, Suite 456</p>
                        <p className="text-gray-600">New York, NY 10001</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-600">info@infiywings.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Business Hours</h3>
                        <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                        <p className="text-gray-600">Sat: 10:00 AM - 4:00 PM</p>
                        <p className="text-gray-600">Sun: Closed</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                      <Facebook className="h-8 w-8 text-blue-600 hover:text-blue-700 cursor-pointer" />
                      <Twitter className="h-8 w-8 text-blue-400 hover:text-blue-500 cursor-pointer" />
                      <Instagram className="h-8 w-8 text-pink-600 hover:text-pink-700 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentSuccess && paymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
              
              <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold">{paymentDetails.bookingId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{paymentDetails.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-sm">{paymentDetails.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">{paymentDetails.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold">{paymentDetails.package}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="font-semibold">{paymentDetails.tickets}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">{paymentDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{paymentDetails.date}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-gray-900">Total Paid:</span>
                  <span className="text-green-600">${paymentDetails.totalPrice}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                A confirmation email has been sent to {paymentDetails.email}
              </p>
              
              <button
                onClick={closePaymentPopup}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6" />
                <span className="text-xl font-bold">Infiy Wings</span>
              </div>
              <p className="text-gray-400 text-sm">
                Crafting unforgettable travel experiences since 2010.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => setCurrentPage('packages')} className="hover:text-white">Packages</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Top Destinations</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Bali</li>
                <li className="hover:text-white cursor-pointer">Switzerland</li>
                <li className="hover:text-white cursor-pointer">Paris</li>
                <li className="hover:text-white cursor-pointer">Tokyo</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@infiywings.com</span>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
                <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
                <Instagram className="h-5 w-5 hover:text-pink-400 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Infiy Wings. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}