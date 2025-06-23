import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchSection.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command.jsx';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.jsx';
import { toast } from 'sonner';
import {
  Search,
  Mic,
  Sparkles,
  Music,
  Users,
  Disc3,
  TrendingUp,
  Clock,
  Zap,
  Star,
  Heart,
  Shuffle,
} from 'lucide-react';

const SearchSection = ({ searchType, onSearchTypeChange, onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const debounceTimeoutRef = useRef(null);

  // Simple debounce function to prevent rapid popover state changes
  const debouncedSetShowSuggestions = (value) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(value);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      addToRecentSearches(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query);
      addToRecentSearches(query);
    }
  };

  const addToRecentSearches = (searchQuery) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 5);
    });
  };

  const trendingSearches = [
    { query: 'Bad Bunny', type: 'artists', trending: true },
    { query: 'Taylor Swift', type: 'artists', trending: true },
    { query: 'Flowers - Miley Cyrus', type: 'songs', trending: true },
    { query: 'The Weeknd', type: 'artists', trending: false },
    { query: 'As It Was - Harry Styles', type: 'songs', trending: false },
    { query: 'Dua Lipa', type: 'artists', trending: false },
  ];

  const exampleSearches = {
    songs: [
      'Shakira - Bzrp Music Sessions #53',
      'Flowers - Miley Cyrus',
      'As It Was - Harry Styles',
      'Anti-Hero - Taylor Swift',
      'Unholy - Sam Smith ft. Kim Petras',
    ],
    artists: [
      'Bad Bunny',
      'Taylor Swift',
      'The Weeknd',
      'Dua Lipa',
      'Ed Sheeran',
    ],
    albums: [
      'Un Verano Sin Ti - Bad Bunny',
      'Midnights - Taylor Swift',
      'Dawn FM - The Weeknd',
      'Future Nostalgia - Dua Lipa',
      "Harry's House - Harry Styles",
    ],
  };

  const [currentExample, setCurrentExample] = useState('');

  useEffect(() => {
    const examples = exampleSearches[searchType] || exampleSearches.songs;
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setCurrentExample(randomExample);
    console.log('💡 Ejemplo de búsqueda sugerido:', randomExample);
  }, [searchType]);

  const getSearchTypeIcon = (type) => {
    switch (type) {
      case 'songs':
        return <Music className="w-4 h-4" />;
      case 'artists':
        return <Users className="w-4 h-4" />;
      case 'albums':
        return <Disc3 className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getSearchTypeLabel = (type) => {
    switch (type) {
      case 'songs':
        return 'Temas';
      case 'artists':
        return 'Pibes que cantan';
      case 'albums':
        return 'Discos';
      default:
        return 'Buscar';
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion.query);
    if (suggestion.type && suggestion.type !== searchType) {
      onSearchTypeChange(suggestion.type);
    }
    debouncedSetShowSuggestions(false);
    onSearch(suggestion.query, suggestion.type || searchType);
    addToRecentSearches(suggestion.query);
  };

  const quickActions = [
    {
      label: 'Lo que pega',
      icon: TrendingUp,
      action: () => {
        const suggestion = { query: 'top hits 2024', type: 'songs' };
        setQuery(suggestion.query);
        if (suggestion.type !== searchType) {
          onSearchTypeChange(suggestion.type);
        }
        onSearch(suggestion.query, suggestion.type);
        addToRecentSearches(suggestion.query);
      },
    },
    {
      label: 'A ver qué sale',
      icon: Shuffle,
      action: () => {
        const suggestion = { query: 'new music', type: 'songs' };
        setQuery(suggestion.query);
        if (suggestion.type !== searchType) {
          onSearchTypeChange(suggestion.type);
        }
        onSearch(suggestion.query, suggestion.type);
        addToRecentSearches(suggestion.query);
      },
    },
    {
      label: 'Mis favoritos',
      icon: Heart,
      action: () => toast.info('¡Viene ya, wacho! Guardá tus favoritos'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}>
      <Card className="mb-8 bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-purple-500/10 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-slate-700/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <CardTitle className="text-white text-center flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                <Search className="w-6 h-6 text-purple-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Buscar {getSearchTypeLabel(searchType)}
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-5 h-5 text-pink-400" />
              </motion.div>
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Search Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-slate-400" />
              </div>

              <Popover
                open={showSuggestions}
                onOpenChange={debouncedSetShowSuggestions}>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => debouncedSetShowSuggestions(true)}
                    placeholder={`Escribí nomás que sale: ${currentExample}`}
                    className="pl-12 pr-16 h-14 text-lg bg-slate-800/50 border-slate-600/50 focus:bg-slate-800 focus:border-purple-500/50 text-white placeholder:text-slate-400 transition-all duration-300 rounded-xl backdrop-blur-sm"
                    required
                  />
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-900/95 backdrop-blur-xl border-slate-700"
                  align="start">
                  <Command className="bg-transparent">
                    <CommandList className="max-h-[300px]">
                      {recentSearches.length > 0 && (
                        <CommandGroup heading="Lo que buscaste antes">
                          {recentSearches.map((search, index) => (
                            <CommandItem
                              key={`recent-${index}`}
                              onSelect={() => {
                                setQuery(search);
                                debouncedSetShowSuggestions(false);
                                onSearch(search, searchType);
                                addToRecentSearches(search);
                              }}
                              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800/50">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-200">{search}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}

                      <CommandGroup heading="Lo que está sonando">
                        {trendingSearches.map((trend, index) => (
                          <CommandItem
                            key={`trend-${index}`}
                            onSelect={() => handleSuggestionSelect(trend)}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-800/50">
                            {trend.trending ? (
                              <TrendingUp className="w-4 h-4 text-red-400" />
                            ) : (
                              <Star className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className="text-slate-200">
                              {trend.query}
                            </span>
                            <Badge
                              variant="outline"
                              className="ml-auto text-xs bg-slate-800 border-slate-600">
                              {getSearchTypeLabel(trend.type)}
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-purple-300 hover:bg-slate-700/50 transition-all duration-300"
                    onClick={() => setQuery(currentExample)}>
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-pink-300 hover:bg-slate-700/50 transition-all duration-300"
                    onClick={() => toast.info('Voz en camino, wacho! 🎤')}>
                    <Mic className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="flex justify-center gap-2 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}>
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-purple-500/50 hover:text-white transition-all duration-300">
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            {/* Search Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                whileFocus={{ scale: 1.02 }}>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 rounded-xl relative overflow-hidden group">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3">
                    <Search className="w-5 h-5" />
                    Buscar {getSearchTypeLabel(searchType)}
                    <Zap className="w-4 h-4" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Search Type Badges */}
            <motion.div
              className="flex justify-center gap-3 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}>
              {['songs', 'artists', 'albums'].map((type, index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={searchType === type ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      searchType === type
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/25'
                        : 'bg-slate-800/30 text-slate-300 border-slate-600/50 hover:bg-slate-700/50 hover:border-purple-500/50 hover:text-white'
                    }`}
                    onClick={() => onSearchTypeChange(type)}>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 2 }}>
                      {getSearchTypeIcon(type)}
                      {getSearchTypeLabel(type)}
                    </motion.div>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SearchSection;
