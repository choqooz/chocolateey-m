import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { motion } from 'framer-motion';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { Search } from 'lucide-react';

const SearchInput = forwardRef(
  (
    {
      onSearch,
      placeholder = 'Escribí nomás que sale wachoooo',
      defaultValue = '',
      clearOnSearch = false,
      autoFocus = false,
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState(defaultValue);
    const inputRef = useRef(null);

    // Expose focus method to parent
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      setSearchValue(defaultValue);
    }, [defaultValue]);

    // Auto focus when requested
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    }, [autoFocus]);

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && searchValue.trim()) {
        onSearch(searchValue.trim());
        if (clearOnSearch) {
          setSearchValue('');
        }
      }
    };

    const handleClick = () => {
      if (searchValue.trim()) {
        onSearch(searchValue.trim());
        if (clearOnSearch) {
          setSearchValue('');
        }
      }
    };

    const handleChange = (e) => {
      setSearchValue(e.target.value);
    };

    return (
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={handleChange}
              placeholder={placeholder}
              className="px-4 py-3 bg-slate-900/90 backdrop-blur-xl border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl shadow-lg text-base hover:bg-slate-800/90 hover:border-slate-600/50 transition-all duration-200 focus-visible:ring-purple-500/20 focus-visible:ring-offset-0"
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button
            onClick={handleClick}
            disabled={!searchValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
