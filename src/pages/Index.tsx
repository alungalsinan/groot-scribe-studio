import { useEffect, useState } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { ArticleCard } from '@/components/ui/article-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/articles';
import { Category } from '@/types/categories';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        const mappedArticles = data.map((article: any) => ({
          id: article.id,
          title: article.title,
          summary: article.summary,
          author: article.author,
          readingTime: article.reading_time,
          publishedAt: article.published_at,
          category: article.category,
          imageUrl: article.image_url,
          featured: article.featured,
          content: article.content,
        }));
        setArticles(mappedArticles);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        const mappedCategories = data.map((category: any) => ({
          id: category.id,
          name: category.name,
          articleCount: category.article_count,
        }));
        setCategories(mappedCategories);
      }
    };

    fetchArticles();
    fetchCategories();
  }, []);

  const featuredArticle = articles.find(article => article.featured);
  const latestArticles = articles.filter(article => !article.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      <HeroSection />
      
      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-24 bg-gradient-secondary relative">
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-cta rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gradient">Featured Story</h2>
              </div>
              <Button variant="ghost" size="lg" className="hover-lift hidden lg:flex" asChild>
                <Link to="/articles">
                  View All Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 max-w-6xl mx-auto animate-slide-up">
              <ArticleCard {...featuredArticle} />
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gradient">Latest Articles</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
            {latestArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gradient-secondary relative">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-16 text-center animate-fade-in">Explore Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="glass-effect hover-lift rounded-2xl p-6 text-center transition-all duration-500 group border border-primary/20 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-bold text-card-foreground group-hover:text-gradient transition-all duration-300 text-lg mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.articleCount} articles
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl"></div>
            <div className="absolute inset-0 bg-grid opacity-20 rounded-3xl"></div>
            <div className="relative z-10 glass-effect rounded-3xl p-12 lg:p-16 text-center border border-primary/30 hover-glow animate-scale-in">
              <h2 className="text-4xl lg:text-6xl font-bold text-gradient mb-6">
                Stay Ahead of the Curve
              </h2>
              <p className="text-xl lg:text-2xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get the latest science and technology insights delivered to your inbox. 
                Join thousands of researchers, engineers, and curious minds.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-2xl glass-effect border border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                />
                <Button size="lg" className="px-8 py-4 bg-gradient-cta hover:scale-105 transition-all duration-300 text-lg font-semibold rounded-2xl hover-glow">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                GROOT
              </div>
              <p className="text-muted-foreground text-sm">
                Exploring the future of science and technology, one breakthrough at a time.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Content</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/articles" className="hover:text-primary transition-colors">Articles</Link></li>
                <li><Link to="/issues" className="hover:text-primary transition-colors">Issues</Link></li>
                <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                <li><Link to="/authors" className="hover:text-primary transition-colors">Authors</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-primary transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">RSS</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Groot Magazine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
