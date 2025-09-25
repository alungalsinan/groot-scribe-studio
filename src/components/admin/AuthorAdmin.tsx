import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  FileText, 
  Upload, 
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function AuthorAdmin() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('my-articles');

  // Mock data for author's content
  const myArticles = [
    {
      id: '1',
      title: 'The Future of AI in Web Development',
      status: 'published',
      createdAt: new Date('2024-01-15'),
      views: 1250
    },
    {
      id: '2',
      title: 'Understanding Quantum Computing Basics',
      status: 'draft',
      createdAt: new Date('2024-01-20'),
      views: 0
    }
  ];

  const recentUploads = [
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

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Author Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Manage your content and uploads.</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Articles
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Uploads
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* My Articles */}
        <TabsContent value="my-articles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Articles</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>

          <div className="grid gap-4">
            {myArticles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.views} views
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create New */}
        <TabsContent value="create" className="space-y-6">
          <h2 className="text-2xl font-bold">Create New Article</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Enter article title..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Excerpt</label>
                <Textarea placeholder="Brief description of the article..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="e.g., Technology, Science, Research..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input placeholder="Comma-separated tags..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea 
                  placeholder="Write your article content here..." 
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button>Save as Draft</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Uploads */}
        <TabsContent value="uploads" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Uploads</h2>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {upload.type === 'image' ? (
                          <FileText className="h-8 w-8 text-blue-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{upload.fileName}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {upload.uploadedAt.toLocaleString()}
                          <span>•</span>
                          <span>{upload.size}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{upload.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">My Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,450</div>
                <p className="text-xs text-muted-foreground">+15% this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">4 drafts pending</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}