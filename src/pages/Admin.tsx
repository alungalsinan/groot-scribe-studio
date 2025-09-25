import { useState } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  FileText, 
  Image, 
  Users, 
  Settings, 
  BarChart3,
  Calendar,
  BookOpen
} from 'lucide-react';
import { mockArticles, mockCategories } from '@/data/mockData';

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const stats = {
    totalArticles: mockArticles.length,
    draftArticles: mockArticles.filter(a => !a.publishedAt).length,
    publishedArticles: mockArticles.filter(a => a.publishedAt).length,
    totalCategories: mockCategories.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage your magazine content, settings, and analytics</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Issues</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalArticles}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publishedArticles}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCategories}</div>
                  <p className="text-xs text-muted-foreground">
                    Active categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,540</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockArticles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium line-clamp-1">{article.title}</h4>
                          <p className="text-xs text-muted-foreground">{article.author}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col" variant="outline">
                      <PlusCircle className="h-6 w-6 mb-2" />
                      New Article
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <BookOpen className="h-6 w-6 mb-2" />
                      New Issue
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Image className="h-6 w-6 mb-2" />
                      Upload Media
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Settings className="h-6 w-6 mb-2" />
                      Site Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Articles */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Articles</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          By {article.author} • {article.category} • {article.readingTime} min read
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Published
                        </span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues */}
          <TabsContent value="issues" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Magazine Issues</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Issue
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-12">
                  Issue management interface would be here. This would include tools for:
                  <br />• Creating monthly issues
                  <br />• Uploading PDF files
                  <br />• Curating featured articles
                  <br />• Managing cover images
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Media Library</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-12">
                  Media management interface would be here. This would include:
                  <br />• Drag & drop file uploads
                  <br />• Image optimization and variants
                  <br />• PDF management with thumbnails
                  <br />• Search and filtering
                  <br />• Bulk operations
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">User Management</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-12">
                  User management interface would be here. Features would include:
                  <br />• Role-based access control
                  <br />• Author profiles and permissions
                  <br />• Reviewer workflows
                  <br />• Activity logging
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Site title, description, and basic configuration options would be here.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Color schemes, typography, and layout customization tools would be here.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Meta tags, sitemaps, and search engine optimization settings would be here.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Integration with analytics platforms and tracking configuration would be here.
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