import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark } from 'lucide-react';
import { mockArticles } from '@/data/mockData';

export default function ArticleDetail() {
  const { id } = useParams();
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <Button asChild className="mt-4">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Article Header */}
      <article className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {article.summary}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
            <Button size="sm" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" variant="outline">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>

          {/* Hero Image */}
          {article.imageUrl && (
            <div className="mb-12">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            {article.content ? (
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n/g, '<br />') 
                }} 
              />
            ) : (
              <div className="text-foreground leading-relaxed space-y-6">
                <p>
                  This is where the full article content would be displayed. In a real application, 
                  this would be rich text content stored in a database and rendered with proper 
                  formatting, images, and interactive elements.
                </p>
                <p>
                  The content management system would allow editors to create rich, engaging articles 
                  with features like:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Rich text formatting with headings, bold, and italic text</li>
                  <li>Embedded images with captions and alt text</li>
                  <li>Code blocks with syntax highlighting</li>
                  <li>Interactive charts and data visualizations</li>
                  <li>Internal links to related articles</li>
                  <li>Footnotes and citations</li>
                </ul>
                <p>
                  For now, this serves as a placeholder to demonstrate the article reading 
                  experience and layout.
                </p>
              </div>
            )}
          </div>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {mockArticles
                .filter(a => a.id !== article.id && a.category === article.category)
                .slice(0, 2)
                .map(relatedArticle => (
                  <Link
                    key={relatedArticle.id}
                    to={`/articles/${relatedArticle.id}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                      <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {relatedArticle.summary}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{relatedArticle.author}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedArticle.readingTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}