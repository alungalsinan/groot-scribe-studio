import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import heroImage from '@/assets/hero-bg.jpg';
import coverImage from '@/assets/groot-cover.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Exploring the
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Future of Science
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Dive deep into cutting-edge research, breakthrough technologies, and the minds 
                shaping tomorrow's world. From AI to quantum computing, we bring you the stories 
                that matter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link to="/articles">
                  Read Latest Articles
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/issues">
                  <Calendar className="mr-2 h-4 w-4" />
                  Browse Issues
                </Link>
              </Button>
            </div>
          </div>

          {/* Current Issue Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-primary rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <Link to="/issues/current" className="relative block">
                <img
                  src={coverImage}
                  alt="Current Issue"
                  className="w-64 lg:w-80 rounded-xl shadow-2xl group-hover:shadow-glow transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-bold text-sm">September 2025</h3>
                  <p className="text-xs text-muted-foreground">The AI Revolution</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}