import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PlusCircle,
  FileText,
  Upload,
  Clock,
  User,
  Calendar,
  Eye,
  Edit3,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  FileImage,
  Save,
  Send,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'review';
  createdAt: Date;
  views: number;
  category: string;
  content?: string;
  summary?: string;
}

interface Upload {
  id: string;
  fileName: string;
  type: 'image' | 'pdf' | 'document';
  uploadedAt: Date;
  size: string;
  url?: string;
}

interface Analytics {
  totalViews: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  monthlyGrowth: number;
}

interface ArticleForm {
  title: string;
  summary: string;
  category: string;
  tags: string;
  content: string;
}

export function AuthorAdmin(): JSX.Element {
  const { profile, refreshUserData } = useSupabaseAuth();
  const [selectedTab, setSelectedTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Article form state
  const [articleForm, setArticleForm] = useState<ArticleForm>({
    title: '',
    summary: '',
    category: '',
    tags: '',
    content: ''
  });

  // Mock data - In real app, this would come from Supabase
  const myArticles: Article[] = [
    {
      id: '1',
      title: 'The Future of AI in Web Development',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      views: 1250,
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Understanding Quantum Computing Basics',
      status: 'draft',
      createdAt: new Date('2024-01-20'),
      views: 0,
      category: 'Science'
    },
    {
      id: '3',
      title: 'Machine Learning Ethics Guide',
      status: 'review',
      createdAt: new Date('2024-01-18'),
      views: 0,
      category: 'Technology'
    }
  ];

  const recentUploads: Upload[] = [
    {
      id: '1',
      fileName: 'ai-development-cover.jpg',
      type: 'image',
      uploadedAt: new Date('2024-01-15T10:30:00'),
      size: '2.4 MB'
    },
    {
      id: '2',
      fileName: 'quantum-computing-draft.pdf',
      type: 'pdf',
      uploadedAt: new Date('2024-01-20T14:45:00'),
      size: '8.7 MB'
    }
  ];

  const analytics: Analytics = {
    totalViews: 8450,
    totalArticles: 12,
    publishedArticles: 8,
    draftArticles: 4,
    monthlyGrowth: 15
  };

  const getStatusColor = (status: Article['status']): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleArticleFormChange = useCallback((field: keyof ArticleForm, value: string): void => {
    setArticleForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSaveArticle = async (isDraft: boolean = true): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!articleForm.title.trim()) {
        throw new Error('Title is required');
      }
      if (!articleForm.content.trim()) {
        throw new Error('Content is required');
      }

      // In a real app, save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: 'Success',
        description: `Article ${isDraft ? 'saved as draft' : 'published'} successfully`,
      });

      // Reset form
      setArticleForm({
        title: '',
        summary: '',
        category: '',
        tags: '',
        content: ''
      });

      // Switch to articles tab
      setSelectedTab('articles');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save article';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const file = files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // In a real app, upload to Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload

      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Author Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {profile?.name}. Manage your content and track performance.
              </p>
            </div>
            <Button 
              onClick={() => setSelectedTab('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-4 max-w-md bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Articles
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Create
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Media
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{analytics.monthlyGrowth}% this month</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Articles</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalArticles}</p>
                      <p className="text-sm text-gray-600">
                        {analytics.publishedArticles} published
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.publishedArticles}</p>
                      <p className="text-sm text-gray-600">
                        {analytics.draftArticles} drafts pending
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Send className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className="text-2xl font-bold text-gray-900">+{analytics.monthlyGrowth}%</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myArticles.slice(0, 3).map((article) => (
                    <div 
                      key={article.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900">{article.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {article.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {upload.type === 'image' ? (
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileImage className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{upload.fileName}</h4>
                        <p className="text-sm text-gray-600">
                          {upload.uploadedAt.toLocaleString()} • {upload.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Articles Management */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Articles</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-300">
                  Filter
                </Button>
                <Button 
                  onClick={() => setSelectedTab('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Article
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {myArticles.map((article) => (
                <Card key={article.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {article.createdAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()} views
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create New Article */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Create New Article</CardTitle>
                <p className="text-gray-600">Share your insights with the world</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Title</label>
                    <Input
                      type="text"
                      placeholder="Enter article title..."
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={articleForm.title}
                      onChange={(e) => handleArticleFormChange('title', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Category</label>
                    <Input
                      type="text"
                      placeholder="Select category..."
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={articleForm.category}
                      onChange={(e) => handleArticleFormChange('category', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Summary</label>
                  <Textarea
                    placeholder="Brief description of your article..."
                    className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={articleForm.summary}
                    onChange={(e) => handleArticleFormChange('summary', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Tags</label>
                  <Input
                    type="text"
                    placeholder="Enter tags separated by commas..."
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={articleForm.tags}
                    onChange={(e) => handleArticleFormChange('tags', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Content</label>
                  <Textarea
                    placeholder="Write your article content here..."
                    className="min-h-[300px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={articleForm.content}
                    onChange={(e) => handleArticleFormChange('content', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleSaveArticle(true)}
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Draft
                  </Button>
                  <Button 
                    onClick={() => handleSaveArticle(false)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Library */}
          <TabsContent value="media" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Media Library</h2>
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  disabled={loading}
                />
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload Files
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentUploads.map((upload) => (
                <Card key={upload.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      {upload.type === 'image' ? (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      ) : (
                        <FileImage className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {upload.fileName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {upload.size}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
