import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import heroImage from '@/assets/hero-bg.jpg';
import coverImage from '@/assets/groot-cover.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Animated Background Elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-accent rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-hero rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-none tracking-tight">
                Exploring the
                <span className="text-gradient block animate-glow">
                  Future of Science
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-foreground/90 leading-relaxed font-light">
                Dive deep into cutting-edge research, breakthrough technologies, and the minds 
                shaping tomorrow's world. From AI to quantum computing, we bring you the stories 
                that matter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 animate-scale-in" style={{animationDelay: '0.3s'}}>
              <Button size="lg" className="group bg-gradient-cta hover:scale-105 transition-all duration-300 hover-glow text-xl px-8 py-4 rounded-2xl font-semibold" asChild>
                <Link to="/articles">
                  Read Latest Articles
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="glass-effect border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all duration-300 text-xl px-8 py-4 rounded-2xl font-semibold" asChild>
                <Link to="/issues">
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse Issues
                </Link>
              </Button>
            </div>
          </div>

          {/* Current Issue Preview */}
          <div className="flex justify-center lg:justify-end animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div className="relative group">
              <div className="absolute -inset-8 bg-gradient-primary rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="absolute -inset-4 bg-gradient-accent rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500" />
              <Link to="/issues/current" className="relative block hover-lift">
                <img
                  src={coverImage}
                  alt="Current Issue"
                  className="w-80 lg:w-96 rounded-2xl shadow-2xl group-hover:shadow-glow-lg transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 glass-effect rounded-xl p-6 border border-primary/30">
                  <h3 className="font-bold text-lg text-gradient">September 2025</h3>
                  <p className="text-sm text-muted-foreground">The AI Revolution</p>
                  <div className="mt-3 flex items-center text-primary font-medium">
                    <span className="text-sm">Read Issue</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}