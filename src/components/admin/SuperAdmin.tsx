import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  Settings,
  Shield,
  FileText,
  BarChart3,
  AlertTriangle,
  Globe,
  Database,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Mail,
  Activity,
  Clock,
  TrendingUp,
  Server,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'super_admin';
  status: 'active' | 'inactive' | 'banned';
  lastLogin: Date;
  articlesCount: number;
  totalViews: number;
  joinedAt: Date;
}

interface Content {
  id: string;
  title: string;
  author: string;
  type: 'article' | 'issue';
  status: 'published' | 'draft' | 'review';
  views: number;
  downloads?: number;
  isVisible: boolean;
  publishedAt?: Date;
  category: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  monthlyGrowth: number;
  storageUsed: number;
  storageLimit: number;
  bandwidth: number;
}

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  type: 'user' | 'content' | 'system';
}

interface SiteSettings {
  isMaintenanceMode: boolean;
  allowRegistration: boolean;
  showContent: boolean;
}

export function SuperAdmin(): JSX.Element {
  const { profile } = useSupabaseAuth();
  const [selectedTab, setSelectedTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    isMaintenanceMode: false,
    allowRegistration: true,
    showContent: true
  });

  // Mock data - In real app, this would come from Supabase
  const systemStats: SystemStats = {
    totalUsers: 125,
    activeUsers: 98,
    totalArticles: 289,
    publishedArticles: 245,
    totalViews: 156000,
    monthlyGrowth: 23,
    storageUsed: 4.2,
    storageLimit: 10,
    bandwidth: 45.6
  };

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'author',
      status: 'active',
      lastLogin: new Date('2024-01-20'),
      articlesCount: 15,
      totalViews: 8450,
      joinedAt: new Date('2023-06-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'author',
      status: 'inactive',
      lastLogin: new Date('2024-01-15'),
      articlesCount: 23,
      totalViews: 12300,
      joinedAt: new Date('2023-04-10')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: new Date('2024-01-22'),
      articlesCount: 0,
      totalViews: 0,
      joinedAt: new Date('2023-01-01')
    }
  ];

  const allContent: Content[] = [
    {
      id: '1',
      title: 'The Future of AI in Healthcare',
      author: 'John Doe',
      type: 'article',
      status: 'published',
      views: 2450,
      isVisible: true,
      publishedAt: new Date('2024-01-20'),
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Quantum Computing Breakthrough',
      author: 'Jane Smith',
      type: 'article',
      status: 'published',
      views: 1850,
      isVisible: true,
      publishedAt: new Date('2024-01-18'),
      category: 'Science'
    },
    {
      id: '3',
      title: 'Climate Change Solutions',
      author: 'John Doe',
      type: 'article',
      status: 'draft',
      views: 0,
      isVisible: false,
      publishedAt: undefined,
      category: 'Environment'
    }
  ];

  const recentActivity: ActivityLog[] = [
    {
      id: '1',
      action: 'User registration',
      user: 'Sarah Wilson',
      timestamp: new Date('2024-01-22T14:30:00'),
      type: 'user'
    },
    {
      id: '2',
      action: 'Article published',
      user: 'John Doe',
      timestamp: new Date('2024-01-22T12:15:00'),
      type: 'content'
    },
    {
      id: '3',
      action: 'Settings updated',
      user: 'Admin',
      timestamp: new Date('2024-01-22T10:45:00'),
      type: 'system'
    }
  ];

  const getStatusColor = (status: User['status']): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'banned':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: User['role']): string => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'author':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContentStatusColor = (status: Content['status']): string => {
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

  const handleSettingChange = useCallback(async (setting: keyof SiteSettings, value: boolean): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // In a real app, save to Supabase
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      setSiteSettings(prev => ({ ...prev, [setting]: value }));
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUserAction = useCallback(async (userId: string, action: 'activate' | 'deactivate' | 'ban' | 'delete'): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // In a real app, perform action via Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: 'Success',
        description: `User ${action}d successfully`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${action} user`;
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleContentVisibility = useCallback(async (contentId: string, isVisible: boolean): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // In a real app, update via Supabase
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      toast({
        title: 'Success',
        description: `Content ${isVisible ? 'shown' : 'hidden'} successfully`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content visibility';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const exportData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // In a real app, generate and download export
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export generation

      toast({
        title: 'Success',
        description: 'Data export completed successfully',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Complete platform control and monitoring
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={exportData}
                disabled={loading}
                className="border-gray-300"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Data
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
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
          <TabsList className="grid w-full grid-cols-6 max-w-2xl bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                      <p className="text-sm text-green-600">
                        {systemStats.activeUsers} active
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Articles</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalArticles}</p>
                      <p className="text-sm text-gray-600">
                        {systemStats.publishedArticles} published
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{systemStats.monthlyGrowth}% this month</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Storage Used</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed} GB</p>
                      <p className="text-sm text-gray-600">
                        of {systemStats.storageLimit} GB limit
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Database className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          by {activity.user} • {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Approve Pending Users
                  </Button>
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200">
                    <FileText className="mr-2 h-4 w-4" />
                    Review Draft Articles
                  </Button>
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Newsletter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-gray-300">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span>{user.articlesCount} articles</span>
                            <span>{user.totalViews.toLocaleString()} views</span>
                            <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                            <span>Last login {user.lastLogin.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleUserAction(user.id, 'activate')}
                          disabled={loading}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleUserAction(user.id, user.status === 'active' ? 'deactivate' : 'activate')}
                          disabled={loading}
                        >
                          {user.status === 'active' ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleUserAction(user.id, 'delete')}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-300">
                  Bulk Actions
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Moderate Content
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {allContent.map((content) => (
                <Card key={content.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{content.title}</h3>
                          <Badge className={getContentStatusColor(content.status)}>
                            {content.status}
                          </Badge>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {content.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>By {content.author}</span>
                          <span>{content.views.toLocaleString()} views</span>
                          {content.publishedAt && (
                            <span>Published {content.publishedAt.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleContentVisibility(content.id, !content.isVisible)}
                          disabled={loading}
                        >
                          {content.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Platform Analytics</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Traffic Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Traffic Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">User Growth Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Security & Audit</h2>
            
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Security Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Security audit logs and activity monitoring would be displayed here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>
            
            <div className="grid gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Site Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                      <p className="text-sm text-gray-600">
                        Show maintenance page to all visitors
                      </p>
                    </div>
                    <Switch
                      checked={siteSettings.isMaintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('isMaintenanceMode', checked)}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">User Registration</h4>
                      <p className="text-sm text-gray-600">
                        Allow new user signups
                      </p>
                    </div>
                    <Switch
                      checked={siteSettings.allowRegistration}
                      onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Public Content</h4>
                      <p className="text-sm text-gray-600">
                        Show content to public visitors
                      </p>
                    </div>
                    <Switch
                      checked={siteSettings.showContent}
                      onCheckedChange={(checked) => handleSettingChange('showContent', checked)}
                      disabled={loading}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">System Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Advanced system configuration options would be available here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
