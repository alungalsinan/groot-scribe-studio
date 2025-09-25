import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
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
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
      featured ? 'lg:col-span-2 lg:row-span-2' : ''
    }`}>
      <Link to={`/articles/${id}`}>
        {imageUrl && (
          <div className={`relative overflow-hidden ${
            featured ? 'h-64 lg:h-80' : 'h-48'
          }`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            </div>
          </div>
        )}
        
        <CardContent className={`p-6 ${featured ? 'lg:p-8' : ''}`}>
          <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2 ${
            featured ? 'text-xl lg:text-2xl' : 'text-lg'
          }`}>
            {title}
          </h3>
          
          <p className={`text-muted-foreground mb-4 line-clamp-3 ${
            featured ? 'text-base lg:text-lg' : 'text-sm'
          }`}>
            {summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            <span>{formatDate(publishedAt)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}