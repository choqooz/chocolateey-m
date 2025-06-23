import React from 'react';
import './ResultsSection.css';
import ResultCard from './ResultCard';
import { Card, CardContent } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Music } from 'lucide-react';

const ResultsSection = ({ results, searchType, searchQuery, onSongSelect }) => {
  // Filter results based on search type with more flexible logic
  let filteredResults = results;
  let showingAlternativeResults = false;

  const expectedType =
    searchType === 'songs'
      ? 'SONG'
      : searchType === 'artists'
        ? 'ARTIST'
        : searchType === 'albums'
          ? 'ALBUM'
          : null;

  if (expectedType) {
    // First try to get exact matches
    filteredResults = results.filter((result) => {
      return result.type === expectedType;
    });

    // If no exact matches found, show related results with a note
    if (filteredResults.length === 0 && results.length > 0) {
      showingAlternativeResults = true;

      // Define related types
      const relatedTypes = {
        SONG: ['ARTIST', 'ALBUM', 'PLAYLIST', 'VIDEO'],
        ARTIST: ['SONG', 'ALBUM', 'PLAYLIST'],
        ALBUM: ['SONG', 'ARTIST', 'PLAYLIST'],
      };

      // Show related results
      if (relatedTypes[expectedType]) {
        filteredResults = results.filter((result) =>
          relatedTypes[expectedType].includes(result.type)
        );
      }

      // If still no results, show all results
      if (filteredResults.length === 0) {
        filteredResults = results;
      }
    }
  }

  if (filteredResults.length === 0) {
    return (
      <Card className="bg-gray-800/90 backdrop-blur-lg border-gray-700">
        <CardContent className="text-center py-12">
          <div className="text-gray-300 mb-4">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              Não encontrei nenhum resultado
            </h3>
            <p>Tenta com outro termo de busca</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActualTypeLabel = (resultType) => {
    switch (resultType) {
      case 'SONG':
        return 'Música';
      case 'ARTIST':
        return 'Artista';
      case 'ALBUM':
        return 'Álbum';
      case 'PLAYLIST':
        return 'Playlist';
      case 'VIDEO':
        return 'Vídeo';
      default:
        return resultType;
    }
  };

  const uniqueTypes = [...new Set(results.map((r) => r.type))];

  // Get search improvement tips
  const getSearchTips = (searchType, actualTypes, query) => {
    if (searchType === 'songs' && actualTypes.includes('ARTIST')) {
      return {
        icon: '🎵',
        message: 'Para encontrar canções específicas, tenta:',
        tips: [
          `"${query} - nome da canção"`,
          `"canções de ${query}"`,
          `"melhores hits ${query}"`,
        ],
      };
    }

    if (searchType === 'albums' && actualTypes.includes('ARTIST')) {
      return {
        icon: '💿',
        message: 'Para encontrar álbuns, tenta:',
        tips: [
          `"álbuns de ${query}"`,
          `"discografia ${query}"`,
          `"${query} álbum nome"`,
        ],
      };
    }

    if (searchType === 'artists' && actualTypes.includes('SONG')) {
      return {
        icon: '👨‍🎤',
        message: 'Os resultados mostram canções. Para artistas específicos:',
        tips: [
          `Busca apenas o nome do artista`,
          `"artista ${query.split(' ')[0]}"`,
          `Evita incluir nomes de canções`,
        ],
      };
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Search Tips Card - Show when displaying alternative results */}
      {showingAlternativeResults &&
        (() => {
          const tips = getSearchTips(searchType, uniqueTypes, searchQuery);
          if (tips) {
            return (
              <Card className="bg-blue-900/40 backdrop-blur-lg border-blue-700/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tips.icon}</span>
                    <div>
                      <p className="text-blue-200 font-medium mb-2">
                        {tips.message}
                      </p>
                      <ul className="text-blue-300 text-sm space-y-1">
                        {tips.tips.map((tip, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-blue-400">•</span>
                            <span className="font-mono bg-blue-800/30 px-2 py-1 rounded">
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null;
        })()}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResults.map((result, index) => (
          <div
            key={`${result.type}-${
              result.videoId || result.artistId || result.albumId || index
            }`}
            className="relative">
            {showingAlternativeResults && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 z-10 text-xs bg-blue-600 text-white border-0">
                {getActualTypeLabel(result.type)}
              </Badge>
            )}
            <ResultCard
              result={result}
              searchType={searchType}
              index={index}
              onSongSelect={onSongSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
