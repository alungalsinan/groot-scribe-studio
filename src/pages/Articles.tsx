import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingFallback, SkeletonLoader } from '@/components/ui/loading-fallback';
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Eye,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  author_name: string;
  author_id: string;
  category: string;
  tags?: string[];
  featured_image?: string;
  published_at: string;
  views: number;
  reading_time: number;
  status: 'published' | 'draft';
  is_featured?: boolean;
}

interface FilterOptions {
  category: string;
  sortBy: 'latest' | 'popular' | 'trending';
  timeRange: 'all' | 'week' | 'month' | 'year';
}

const CATEGORIES = [
  'Technology',
  'Science', 
  'Space Technology',
  'Artificial Intelligence',
  'Environment',
  'Health',
  'Business',
  'Culture',
  'Politics',
  'Education'
];

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    summary: 'Exploring how AI is revolutionizing medical diagnosis, treatment planning, and patient care in the 21st century.',
    author_name: 'Dr. Sarah Johnson',
    author_id: 'author1',
    category: 'Artificial Intelligence',
    tags: ['AI', 'Healthcare', 'Technology', 'Medicine'],
    featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    published_at: '2024-01-22T10:00:00Z',
    views: 2450,
    reading_time: 8,
    status: 'published',
    is_featured: true
  },
  {
    id: '2', 
    title: 'Space Exploration: Mars Mission Updates',
    summary: 'Latest developments in Mars exploration missions and what they mean for the future of space colonization.',
    author_name: 'Mark Thompson',
    author_id: 'author2',
    category: 'Space Technology',
    tags: ['Space', 'Mars', 'NASA', 'Exploration'],
    featured_image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&h=400&fit=crop',
    published_at: '2024-01-20T14:30:00Z',
    views: 1890,
    reading_time: 6,
    status: 'published',
    is_featured: false
  },
  {
    id: '3',
    title: 'Sustainable Technology Solutions for Climate Change',
    summary: 'Innovative green technologies that are making a real impact in the fight against climate change.',
    author_name: 'Elena Rodriguez',
    author_id: 'author3',
    category: 'Environment',
    tags: ['Climate', 'Green Tech', 'Sustainability'],
    featured_image: 'https://images.unsplash.com/photo-1569163139851-1928d1022c53?w=800&h=400&fit=crop',
    published_at: '2024-01-18T09:15:00Z',
    views: 1650,
    reading_time: 7,
    status: 'published',
    is_featured: false
  },
  {
    id: '4',
    title: 'Quantum Computing Breakthrough: What It Means',
    summary: 'Recent advances in quantum computing and their potential impact on various industries.',
    author_name: 'Dr. Michael Chen',
    author_id: 'author4', 
    category: 'Technology',
    tags: ['Quantum Computing', 'Innovation', 'Science'],
    featured_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    published_at: '2024-01-15T16:45:00Z',
    views: 2100,
    reading_time: 9,
    status: 'published',
    is_featured: true
  }
];

export default function Articles(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get('category') || '',
    sortBy: (searchParams.get('sort') as FilterOptions['sortBy']) || 'latest',
    timeRange: (searchParams.get('time') as FilterOptions['timeRange']) || 'all'
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    fetchArticles();
  }, [filters, searchQuery]);

  const fetchArticles = async (): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data with filtering/sorting
      let filteredArticles = [...MOCK_ARTICLES];
      
      // Apply search filter
      if (searchQuery) {
        filteredArticles = filteredArticles.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Apply category filter
      if (filters.category) {
        filteredArticles = filteredArticles.filter(article => 
          article.category === filters.category
        );
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'popular':
          filteredArticles.sort((a, b) => b.views - a.views);
          break;
        case 'trending':
          // Simple trending algorithm based on views and recency
          filteredArticles.sort((a, b) => {
            const aScore = a.views * (1 / ((Date.now() - new Date(a.published_at).getTime()) / (1000 * 60 * 60 * 24)));
            const bScore = b.views * (1 / ((Date.now() - new Date(b.published_at).getTime()) / (1000 * 60 * 60 * 24)));
            return bScore - aScore;
          });
          break;
        case 'latest':
        default:
          filteredArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
          break;
      }
      
      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load articles. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    updateSearchParams({ q: searchQuery });
  };

  const updateSearchParams = (updates: Record<string, string>): void => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string): void => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams({ 
      category: newFilters.category,
      sort: newFilters.sortBy,
      time: newFilters.timeRange
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number): string => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insightful articles on technology, science, and innovation from our expert contributors.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </form>
            
            {/* Filter Toggle */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              
              {/* Quick Sort */}
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-white border border-gray-200 shadow-sm">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <CardContent className="p-6">
                  <SkeletonLoader lines={4} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Articles */}
            {articles.some(article => article.is_featured) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {articles.filter(article => article.is_featured).map((article) => (
                    <Card key={`featured-${article.id}`} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="aspect-video overflow-hidden">
                        {article.featured_image && (
                          <img 
                            src={article.featured_image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {article.category}
                            </Badge>
                            <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            <Link to={`/articles/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                          
                          <p className="text-gray-600 line-clamp-3">
                            {article.summary}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {article.author_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(article.published_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.reading_time} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatViews(article.views)}
                              </span>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/articles/${article.id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                          >
                            Read Full Article
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-gray-700" />
                All Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Card key={article.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="aspect-video overflow-hidden">
                      {article.featured_image && (
                        <img 
                          src={article.featured_image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {article.category}
                        </Badge>
                        
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          <Link to={`/articles/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-2 text-sm">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatViews(article.views)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filters.category ? 'Try adjusting your search or filters' : 'No articles available at the moment'}
            </p>
            {(searchQuery || filters.category) && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ category: '', sortBy: 'latest', timeRange: 'all' });
                  setSearchParams({});
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
