import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingFallback, SkeletonLoader } from '@/components/ui/loading-fallback';
import {
  Calendar,
  Download,
  Eye,
  FileText,
  Star,
  BookOpen,
  Zap,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MagazineIssue {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  issue_number: number;
  volume_number: number;
  cover_image: string;
  published_at: string;
  article_count: number;
  download_count: number;
  page_count: number;
  file_size: string;
  theme: string;
  featured_articles: string[];
  editors: string[];
  status: 'published' | 'draft' | 'preview';
  is_featured: boolean;
  pdf_url?: string;
}

const MOCK_ISSUES: MagazineIssue[] = [
  {
    id: '2024-01',
    title: 'The Future is Now',
    subtitle: 'Artificial Intelligence and Space Exploration',
    description: 'This groundbreaking issue explores the convergence of AI and space technology, featuring in-depth articles on Mars colonization, quantum computing, and the next generation of smart spacecraft.',
    issue_number: 1,
    volume_number: 5,
    cover_image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop',
    published_at: '2024-01-15T00:00:00Z',
    article_count: 12,
    download_count: 5420,
    page_count: 84,
    file_size: '45.2 MB',
    theme: 'Technology & Space',
    featured_articles: [
      'AI-Powered Mars Rovers: The Next Generation',
      'Quantum Computing in Space Navigation',
      'The Ethics of AI in Space Exploration'
    ],
    editors: ['Dr. Sarah Johnson', 'Mark Thompson', 'Elena Rodriguez'],
    status: 'published',
    is_featured: true,
    pdf_url: '/downloads/groot-magazine-2024-01.pdf'
  },
  {
    id: '2023-12',
    title: 'Sustainable Tomorrow',
    subtitle: 'Green Technology and Environmental Innovation',
    description: 'Dive deep into sustainable technologies that are reshaping our world. From renewable energy breakthroughs to eco-friendly innovations, this issue showcases the solutions for a greener future.',
    issue_number: 12,
    volume_number: 4,
    cover_image: 'https://images.unsplash.com/photo-1569163139851-1928d022c53?w=400&h=600&fit=crop',
    published_at: '2023-12-15T00:00:00Z',
    article_count: 10,
    download_count: 4890,
    page_count: 76,
    file_size: '38.7 MB',
    theme: 'Environment & Sustainability',
    featured_articles: [
      'Revolutionary Solar Panel Technology',
      'Ocean Cleanup: Innovation at Scale',
      'Smart Cities and Carbon Neutrality'
    ],
    editors: ['Dr. Michael Chen', 'Lisa Wang', 'James Rodriguez'],
    status: 'published',
    is_featured: false
  },
  {
    id: '2023-11',
    title: 'Digital Revolution',
    subtitle: 'The Age of Connectivity and Innovation',
    description: 'Explore how digital transformation is revolutionizing industries worldwide. From blockchain to IoT, discover the technologies shaping tomorrow\'s connected world.',
    issue_number: 11,
    volume_number: 4,
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    published_at: '2023-11-15T00:00:00Z',
    article_count: 11,
    download_count: 4250,
    page_count: 80,
    file_size: '42.1 MB',
    theme: 'Digital Technology',
    featured_articles: [
      'Blockchain Beyond Cryptocurrency',
      'The Internet of Things Revolution',
      'Digital Privacy in the Modern Age'
    ],
    editors: ['Anna Peterson', 'David Kim', 'Robert Garcia'],
    status: 'published',
    is_featured: true
  },
  {
    id: '2024-02-preview',
    title: 'Quantum Horizons',
    subtitle: 'The Next Leap in Computing and Physics',
    description: 'Get an exclusive preview of our upcoming issue on quantum technologies. From quantum computing to quantum communications, explore the science that will define the next decade.',
    issue_number: 2,
    volume_number: 5,
    cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
    published_at: '2024-02-15T00:00:00Z',
    article_count: 8,
    download_count: 0,
    page_count: 72,
    file_size: '35.8 MB',
    theme: 'Quantum Technology',
    featured_articles: [
      'Quantum Computing: Breaking the Barriers',
      'Quantum Cryptography and Security',
      'The Quantum Internet Vision'
    ],
    editors: ['Dr. Sarah Johnson', 'Prof. Alan Foster'],
    status: 'preview',
    is_featured: false
  }
];

export default function Issues(): JSX.Element {
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    fetchIssues();
  }, [selectedYear]);

  const fetchIssues = async (): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data with filtering
      let filteredIssues = [...MOCK_ISSUES];
      
      if (selectedYear !== 'all') {
        filteredIssues = filteredIssues.filter(issue => 
          new Date(issue.published_at).getFullYear().toString() === selectedYear
        );
      }
      
      // Sort by publication date (newest first)
      filteredIssues.sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
      
      setIssues(filteredIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load magazine issues. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDownloads = (downloads: number): string => {
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toString();
  };

  const getStatusColor = (status: MagazineIssue['status']): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'preview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailableYears = (): string[] => {
    const years = [...new Set(issues.map(issue => 
      new Date(issue.published_at).getFullYear().toString()
    ))];
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Magazine Issues
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our curated collection of magazine issues covering cutting-edge technology, 
              science, and innovation. Download and read offline anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter by year:</span>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {issues.length} {issues.length === 1 ? 'issue' : 'issues'} available
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-white border border-gray-200 shadow-sm">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                <CardContent className="p-6">
                  <SkeletonLoader lines={5} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : issues.length > 0 ? (
          <div className="space-y-8">
            {/* Featured Issues */}
            {issues.some(issue => issue.is_featured) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Featured Issues
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {issues.filter(issue => issue.is_featured).map((issue) => (
                    <Card key={`featured-${issue.id}`} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow group">
                      <div className="flex flex-col lg:flex-row">
                        {/* Cover Image */}
                        <div className="lg:w-1/3">
                          <div className="aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden">
                            <img 
                              src={issue.cover_image} 
                              alt={`${issue.title} Cover`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="lg:w-2/3">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge className={getStatusColor(issue.status)}>
                                  {issue.status === 'preview' ? 'Coming Soon' : issue.status}
                                </Badge>
                                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Vol. {issue.volume_number}, Issue {issue.issue_number}
                                </span>
                              </div>
                              
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  <Link to={`/issues/${issue.id}`}>
                                    {issue.title}
                                  </Link>
                                </h3>
                                <p className="text-lg text-blue-600 font-medium mt-1">
                                  {issue.subtitle}
                                </p>
                              </div>
                              
                              <p className="text-gray-600 line-clamp-3">
                                {issue.description}
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(issue.published_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>{issue.article_count} articles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Download className="h-4 w-4" />
                                  <span>{formatDownloads(issue.download_count)} downloads</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>{issue.page_count} pages</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                  <Link to={`/issues/${issue.id}`}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Read Online
                                  </Link>
                                </Button>
                                {issue.status === 'published' && (
                                  <Button variant="outline" className="border-gray-300">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* All Issues Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-gray-700" />
                All Issues
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {issues.map((issue) => (
                  <Card key={issue.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                    {/* Cover Image */}
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={issue.cover_image} 
                        alt={`${issue.title} Cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status === 'preview' ? 'Coming Soon' : issue.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Vol. {issue.volume_number}, Issue {issue.issue_number}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            <Link to={`/issues/${issue.id}`}>
                              {issue.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {issue.subtitle}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {issue.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(issue.published_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{formatDownloads(issue.download_count)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Link to={`/issues/${issue.id}`}>
                              <BookOpen className="mr-1 h-3 w-3" />
                              Read
                            </Link>
                          </Button>
                          {issue.status === 'published' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
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
              No issues found
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedYear !== 'all' ? `No issues available for ${selectedYear}` : 'No magazine issues available at the moment'}
            </p>
            {selectedYear !== 'all' && (
              <Button 
                onClick={() => setSelectedYear('all')}
                variant="outline"
              >
                Show All Years
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
