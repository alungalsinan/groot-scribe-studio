import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from './button';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Latest', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'Issues', href: '/issues' },
    { name: 'Categories', href: '/categories' },
    { name: 'Authors', href: '/authors' },
    { name: 'About', href: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'glass-effect shadow-xl border-b border-primary/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-3xl font-bold text-gradient hover:scale-105 transition-transform duration-300">
              GROOT
            </div>
            <div className="text-sm text-muted-foreground hidden sm:block font-medium">
              Science & Technology
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Search and Admin */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex hover-lift rounded-xl">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="sm" className="bg-gradient-cta hover:scale-105 transition-all duration-300 hover-glow rounded-xl font-semibold" asChild>
              <Link to="/admin">Admin</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover-lift rounded-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden glass-effect border-t border-primary/20 animate-fade-in">
            <div className="py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-lg font-semibold text-foreground/80 hover:text-foreground transition-colors py-2 px-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}