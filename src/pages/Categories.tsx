import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingFallback, SkeletonLoader } from '@/components/ui/loading-fallback';
import {
  FileText,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Zap,
  Cpu,
  Globe,
  Leaf,
  Heart,
  Building,
  Palette,
  Scale,
  BookOpen,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  article_count: number;
  subscriber_count: number;
  color: string;
  icon: string;
  featured_image: string;
  is_trending: boolean;
  latest_article?: {
    title: string;
    author: string;
    published_at: string;
  };
}

const CATEGORY_ICONS = {
  'technology': Cpu,
  'science': Zap,
  'space-technology': Globe,
  'artificial-intelligence': Cpu,
  'environment': Leaf,
  'health': Heart,
  'business': Building,
  'culture': Palette,
  'politics': Scale,
  'education': BookOpen
};

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'tech',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest developments in technology, gadgets, and digital innovation that are shaping our future.',
    article_count: 124,
    subscriber_count: 5420,
    color: 'bg-blue-500',
    icon: 'technology',
    featured_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    is_trending: true,
    latest_article: {
      title: 'The Future of Artificial Intelligence in Healthcare',
      author: 'Dr. Sarah Johnson',
      published_at: '2024-01-22T10:00:00Z'
    }
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Exploring AI breakthroughs, machine learning advances, and the impact of intelligent systems on society.',
    article_count: 89,
    subscriber_count: 6890,
    color: 'bg-purple-500',
    icon: 'artificial-intelligence',
    featured_image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop',
    is_trending: true,
    latest_article: {
      title: 'GPT-4 and Beyond: The Next Generation of Language Models',
      author: 'Dr. Michael Chen',
      published_at: '2024-01-20T14:30:00Z'
    }
  },
  {
    id: 'space',
    name: 'Space Technology',
    slug: 'space-technology',
    description: 'Space exploration, astronomy discoveries, and the latest missions to explore our universe.',
    article_count: 67,
    subscriber_count: 4250,
    color: 'bg-indigo-500',
    icon: 'space-technology',
    featured_image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&h=400&fit=crop',
    is_trending: true,
    latest_article: {
      title: 'Mars Mission Updates: Latest Discoveries from Perseverance',
      author: 'Mark Thompson',
      published_at: '2024-01-18T09:15:00Z'
    }
  },
  {
    id: 'env',
    name: 'Environment',
    slug: 'environment',
    description: 'Climate change, sustainability, and environmental innovations for a greener future.',
    article_count: 78,
    subscriber_count: 3890,
    color: 'bg-green-500',
    icon: 'environment',
    featured_image: 'https://images.unsplash.com/photo-1569163139851-1928d022c53?w=800&h=400&fit=crop',
    is_trending: false,
    latest_article: {
      title: 'Renewable Energy Breakthrough: Solar Panel Efficiency Reaches 40%',
      author: 'Elena Rodriguez',
      published_at: '2024-01-15T16:45:00Z'
    }
  },
  {
    id: 'health',
    name: 'Health',
    slug: 'health',
    description: 'Medical breakthroughs, health technology, and wellness innovations improving human life.',
    article_count: 92,
    subscriber_count: 5670,
    color: 'bg-red-500',
    icon: 'health',
    featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    is_trending: false,
    latest_article: {
      title: 'Gene Therapy Breakthrough: New Treatment for Rare Diseases',
      author: 'Dr. Lisa Wang',
      published_at: '2024-01-12T11:20:00Z'
    }
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Startup stories, market trends, and business innovations in the digital economy.',
    article_count: 156,
    subscriber_count: 4120,
    color: 'bg-orange-500',
    icon: 'business',
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    is_trending: false,
    latest_article: {
      title: 'The Rise of B2B SaaS: Market Analysis 2024',
      author: 'James Rodriguez',
      published_at: '2024-01-10T13:30:00Z'
    }
  },
  {
    id: 'culture',
    name: 'Culture',
    slug: 'culture',
    description: 'Art, design, and cultural movements in the digital age and their impact on society.',
    article_count: 64,
    subscriber_count: 2890,
    color: 'bg-pink-500',
    icon: 'culture',
    featured_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop',
    is_trending: false,
    latest_article: {
      title: 'Digital Art Revolution: NFTs and Creative Expression',
      author: 'Anna Peterson',
      published_at: '2024-01-08T15:45:00Z'
    }
  },
  {
    id: 'politics',
    name: 'Politics',
    slug: 'politics',
    description: 'Political analysis, policy discussions, and governance in the digital era.',
    article_count: 43,
    subscriber_count: 2150,
    color: 'bg-gray-600',
    icon: 'politics',
    featured_image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    is_trending: false,
    latest_article: {
      title: 'Digital Democracy: How Technology is Changing Politics',
      author: 'David Kim',
      published_at: '2024-01-05T10:15:00Z'
    }
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'education',
    description: 'Educational technology, learning innovations, and the future of knowledge sharing.',
    article_count: 85,
    subscriber_count: 3450,
    color: 'bg-teal-500',
    icon: 'education',
    featured_image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop',
    is_trending: false,
    latest_article: {
      title: 'Online Learning Revolution: Post-Pandemic Education Trends',
      author: 'Prof. Alan Foster',
      published_at: '2024-01-03T14:20:00Z'
    }
  }
];

export default function Categories(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on search query
    if (searchQuery.trim()) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, searchQuery]);

  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data
      
      // Sort categories by article count (most popular first)
      const sortedCategories = [...MOCK_CATEGORIES].sort((a, b) => {
        // Trending categories first
        if (a.is_trending && !b.is_trending) return -1;
        if (!a.is_trending && b.is_trending) return 1;
        // Then by article count
        return b.article_count - a.article_count;
      });
      
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getIcon = (iconName: string) => {
    const IconComponent = CATEGORY_ICONS[iconName as keyof typeof CATEGORY_ICONS] || FileText;
    return IconComponent;
  };

  const trendingCategories = filteredCategories.filter(cat => cat.is_trending);
  const otherCategories = filteredCategories.filter(cat => !cat.is_trending);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover articles and insights across diverse topics. From cutting-edge technology 
              to environmental sustainability, find content that interests you.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="bg-white border border-gray-200 shadow-sm">
                  <div className="aspect-video bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <SkeletonLoader lines={3} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="space-y-12">
            {/* Trending Categories */}
            {trendingCategories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                  Trending Categories
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {trendingCategories.map((category) => {
                    const IconComponent = getIcon(category.icon);
                    return (
                      <Card key={`trending-${category.id}`} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow group">
                        <div className="flex">
                          {/* Featured Image */}
                          <div className="w-1/3">
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={category.featured_image} 
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="w-2/3">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 ${category.color} rounded-lg`}>
                                    <IconComponent className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      <Link to={`/categories/${category.slug}`}>
                                        {category.name}
                                      </Link>
                                    </h3>
                                    <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      Trending
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {category.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {category.article_count} articles
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {formatCount(category.subscriber_count)}
                                    </span>
                                  </div>
                                </div>
                                
                                {category.latest_article && (
                                  <div className="border-t border-gray-100 pt-3">
                                    <p className="text-xs text-gray-500 mb-1">Latest:</p>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                      {category.latest_article.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      by {category.latest_article.author} • {formatDate(category.latest_article.published_at)}
                                    </p>
                                  </div>
                                )}
                                
                                <Link 
                                  to={`/categories/${category.slug}`}
                                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
                                >
                                  Explore {category.name}
                                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* All Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-gray-700" />
                All Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCategories.map((category) => {
                  const IconComponent = getIcon(category.icon);
                  return (
                    <Card key={category.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                      {/* Featured Image */}
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={category.featured_image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 ${category.color} rounded-lg`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              <Link to={`/categories/${category.slug}`}>
                                {category.name}
                              </Link>
                            </h3>
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {category.article_count} articles
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {formatCount(category.subscriber_count)}
                            </span>
                          </div>
                          
                          {category.latest_article && (
                            <div className="border-t border-gray-100 pt-3">
                              <p className="text-xs text-gray-500 mb-1">Latest:</p>
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                {category.latest_article.title}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? `No categories match "${searchQuery}"` : 'No categories available at the moment'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
