import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import api from "@/lib/api";
import { MainNavbar } from "@/components/ui/MainNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  Search,
  ArrowRight,
  ShoppingBag,
  Store,
  Zap,
  Clock,
  Tag,
  Percent,
  Star,
} from "lucide-react";
import { Promotion } from "@/types";
import { calculateDiscountPercentage, formatPrice, getTimeRemaining } from "@/lib/utils";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

// Category interface
interface Category {
  id: string;
  name: string;
  icon: string;
}

// Promotion card component
interface PromotionCardProps {
  promotion: Partial<Promotion>;
  loading?: boolean;
}

const PromotionCard = ({ promotion, loading }: PromotionCardProps) => {
  if (loading || !promotion.id) {
    return (
      <Card className="overflow-hidden h-full">
        <div className="aspect-video w-full bg-muted">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </CardFooter>
      </Card>
    );
  }

  const discountPercentage = promotion.discountPercentage || 
    (promotion.originalPrice && promotion.discountedPrice
      ? calculateDiscountPercentage(promotion.originalPrice, promotion.discountedPrice)
      : 0);

  const timeRemaining = promotion.endDate ? getTimeRemaining(promotion.endDate) : '';

  return (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
      <Link to={`/promotions/${promotion.id}`} className="block">
        <div className="aspect-video w-full bg-muted relative overflow-hidden group">
          <img
            src={promotion.images?.[0] || '/placeholder-image.jpg'}
            alt={promotion.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-primary">
            {discountPercentage}% OFF
          </Badge>
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Store className="h-4 w-4" />
            <span>{typeof promotion.business === 'object' ? promotion.business.name : 'Business'}</span>
          </div>
          <CardTitle className="text-lg line-clamp-1">{promotion.title}</CardTitle>
          <CardDescription className="line-clamp-2">{promotion.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">
              {promotion.discountedPrice !== undefined 
                ? formatPrice(promotion.discountedPrice) 
                : ''}
            </div>
            {promotion.originalPrice !== undefined && (
              <div className="text-sm line-through text-muted-foreground">
                {formatPrice(promotion.originalPrice)}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeRemaining}</span>
          </Badge>
          <Button size="sm" className="gap-1">
            View Deal
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredPromotions, setFeaturedPromotions] = useState<Partial<Promotion>[]>([]);
  const [promotions, setPromotions] = useState<Partial<Promotion>[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuredRef, featuredInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [categoriesRef, categoriesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [dealsRef, dealsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [promotionsRes, featuredRes, categoriesRes] = await Promise.all([
          api.get('/promotions'),
          api.get('/promotions/featured'),
          api.get('/promotions/categories')
        ]);
        
        setPromotions(promotionsRes.data.data || []);
        setFeaturedPromotions(featuredRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Use placeholder data if API returns empty results
  const placeholderPromotions = loading ? Array(6).fill({}) : [];
  const displayFeatured = featuredPromotions.length > 0 ? featuredPromotions : placeholderPromotions;
  const displayPromotions = promotions.length > 0 ? promotions : placeholderPromotions;
  
  const placeholderCategories = [
    { id: '1', name: "Food & Restaurants", icon: "🍔" },
    { id: '2', name: "Fashion & Apparel", icon: "👕" },
    { id: '3', name: "Electronics", icon: "📱" },
    { id: '4', name: "Home & Garden", icon: "🏠" },
    { id: '5', name: "Beauty & Health", icon: "💄" },
    { id: '6', name: "Sports & Fitness", icon: "🏃" },
  ];

  const displayCategories = categories.length > 0 ? categories : placeholderCategories;

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-primary/10 to-background">
        <div 
          ref={heroRef}
          className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center"
        >
          <motion.div 
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Discover Amazing Deals from Top Brands
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-[700px]">
              Find exclusive offers, discounts, and promotions from your favorite brands all in one place.
            </p>
            
            <motion.form 
              onSubmit={handleSearch}
              variants={fadeIn}
              className="flex w-full max-w-lg mx-auto items-center space-x-2 pt-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for deals..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </motion.form>
            
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-2 pt-2"
            >
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Food", "Fashion", "Electronics", "Home"].map((tag) => (
                <Link key={tag} to={`/category/${tag.toLowerCase()}`}>
                  <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </section>
      
      {/* Featured Deals */}
      <section className="py-16 px-4">
        <div 
          ref={featuredRef}
          className="container mx-auto"
        >
          <motion.div 
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold">Featured Deals</h2>
              <p className="text-muted-foreground">Handpicked offers you shouldn't miss</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/featured" className="flex items-center gap-1">
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayFeatured.slice(0, 3).map((promotion, index) => (
              <motion.div key={promotion.id || index} variants={fadeIn}>
                <PromotionCard promotion={promotion} loading={loading} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 px-4 bg-muted/30">
        <div 
          ref={categoriesRef}
          className="container mx-auto"
        >
          <motion.div 
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore deals across different categories to find exactly what you're looking for
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {displayCategories.map((category, index) => (
              <motion.div key={category.id || index} variants={scaleUp}>
                <Link to={`/category/${category.name.toLowerCase().split(' ')[0]}`}>
                  <Card className="h-full hover:shadow-md transition-shadow text-center">
                    <CardHeader className="pb-2">
                      <div className="text-3xl mb-1">{category.icon}</div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0 justify-center">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <span>Explore</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* All Deals */}
      <section className="py-16 px-4">
        <div 
          ref={dealsRef}
          className="container mx-auto"
        >
          <motion.div 
            initial="hidden"
            animate={dealsInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold">All Deals</h2>
            <p className="text-muted-foreground">Explore all the latest offers</p>
          </motion.div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Deals</TabsTrigger>
              <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
              <TabsTrigger value="new">Newly Added</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <motion.div 
                initial="hidden"
                animate={dealsInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {displayPromotions.slice(0, 8).map((promotion, index) => (
                  <motion.div key={promotion.id || index} variants={fadeIn}>
                    <PromotionCard promotion={promotion} loading={loading} />
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-10 text-center">
                <Button size="lg" asChild>
                  <Link to="/search" className="gap-2">
                    <span>Browse All Deals</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="ending-soon" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* We'd populate this with filtered promotions */}
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <PromotionCard key={index} promotion={{}} loading={true} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No ending soon deals available right now.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <PromotionCard key={index} promotion={{}} loading={true} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No new deals available right now.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <PromotionCard key={index} promotion={{}} loading={true} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No popular deals available right now.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 px-4 bg-muted/30">
        <div 
          ref={howItWorksRef}
          className="container mx-auto"
        >
          <motion.div 
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Finding and using deals has never been easier
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={scaleUp}>
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Discover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse through our extensive collection of deals from top brands and retailers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleUp}>
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                    <Tag className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Select</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose the deals that interest you and click to see detailed information.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleUp}>
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Save</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get redirected to the official store and enjoy your savings instantly.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Are You a Business Owner?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              List your promotions on our platform and reach thousands of potential customers looking for deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register?type=business">Join as Business</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/business/learn-more">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of customers and businesses
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Regular Shopper",
                comment: "I've saved over $500 in the last few months using DealFinder. The interface is so easy to use and I love getting notifications for new deals!",
                stars: 5
              },
              {
                name: "Michael Chen",
                role: "Business Owner",
                comment: "Since listing our promotions on DealFinder, we've seen a 40% increase in online traffic. It's been a game-changer for our small business.",
                stars: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Deal Hunter",
                comment: "The best deals platform I've found! I especially love the 'ending soon' feature that helps me never miss out on a good offer.",
                stars: 4
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.stars ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-muted-foreground">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <ShoppingBag className="h-5 w-5" />
                <span>DealFinder</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Your one-stop destination for the best deals and promotions from top brands.
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/category/food" className="text-muted-foreground hover:text-foreground">Food & Restaurants</Link></li>
                <li><Link to="/category/fashion" className="text-muted-foreground hover:text-foreground">Fashion & Apparel</Link></li>
                <li><Link to="/category/electronics" className="text-muted-foreground hover:text-foreground">Electronics</Link></li>
                <li><Link to="/category/home" className="text-muted-foreground hover:text-foreground">Home & Garden</Link></li>
                <li><Link to="/category/beauty" className="text-muted-foreground hover:text-foreground">Beauty & Health</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                <li><Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} DealFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}