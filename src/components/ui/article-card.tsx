import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './card';

interface ArticleCardProps {
  id: string;
  title: string;
  summary: string;
  author: string;
  readingTime: number;
  publishedAt: string;
  category: string;
  imageUrl?: string;
  featured?: boolean;
}

export function ArticleCard({
  id,
  title,
  summary,
  author,
  readingTime,
  publishedAt,
  category,
  imageUrl,
  featured = false,
}: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className={`group hover-lift transition-all duration-500 overflow-hidden glass-effect border-border/50 hover:border-primary/30 ${
      featured ? 'lg:col-span-2 lg:row-span-2' : ''
    }`}>
      <Link to={`/articles/${id}`}>
        {imageUrl && (
          <div className={`relative overflow-hidden ${
            featured ? 'h-72 lg:h-96' : 'h-64'
          }`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-6 left-6">
              <span className="bg-gradient-cta text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                {category}
              </span>
            </div>
            {featured && (
              <div className="absolute top-6 right-6">
                <span className="bg-gradient-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        
        <CardContent className={`p-8 ${featured ? 'lg:p-10' : ''}`}>
          <h3 className={`font-bold text-foreground group-hover:text-gradient transition-all duration-300 mb-4 line-clamp-2 leading-tight ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
          }`}>
            {title}
          </h3>
          
          <p className={`text-muted-foreground mb-6 line-clamp-3 leading-relaxed ${
            featured ? 'text-lg lg:text-xl' : 'text-base lg:text-lg'
          }`}>
            {summary}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-semibold text-foreground/80">{author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            <span className="text-xs uppercase tracking-wider">{formatDate(publishedAt)}</span>
          </div>
          
          {/* Read More Indicator */}
          <div className="flex items-center text-primary font-semibold group-hover:text-accent transition-colors">
            <span>Read Article</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}