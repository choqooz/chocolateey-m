import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import YTMusic from 'ytmusic-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? true
        : function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);

            // Allow localhost and local network IPs
            const allowedOrigins = [
              /^http:\/\/localhost:3000$/,
              /^http:\/\/127\.0\.0\.1:3000$/,
              /^http:\/\/192\.168\.\d+\.\d+:3000$/,
              /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
              /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:3000$/,
            ];

            const isAllowed = allowedOrigins.some((pattern) =>
              pattern.test(origin)
            );
            callback(null, isAllowed);
          },
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(
    `🔍 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`
  );
  if (req.path.startsWith('/api/')) {
    console.log('🎯 API Request detected:', {
      method: req.method,
      path: req.path,
      query: req.query,
      headers: {
        'content-type': req.get('content-type'),
        'user-agent': req.get('user-agent'),
        accept: req.get('accept'),
      },
    });
  }
  next();
});

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Initialize YouTube Music API with proper configuration
let ytmusic;

async function initializeYTMusic() {
  try {
    ytmusic = new YTMusic();

    // Initialize the API with proper configuration
    await ytmusic.initialize();

    console.log('✅ YouTube Music API initialized successfully');
    console.log('🔧 API Configuration loaded');
  } catch (error) {
    console.error('❌ Error initializing YouTube Music API:', error);
    console.log('🔄 Trying alternative initialization...');

    try {
      // Try alternative initialization method
      ytmusic = new YTMusic();
      console.log('✅ YouTube Music API initialized with alternative method');
    } catch (altError) {
      console.error('❌ Alternative initialization also failed:', altError);
    }
  }
}

// Initialize API on startup
initializeYTMusic();

// API Routes
app.get('/api/search', async (req, res) => {
  const { query, type = 'songs' } = req.query;

  console.log('🔍 Servidor: Búsqueda solicitada');
  console.log('📝 Query:', query);
  console.log('🎯 Tipo recibido:', type);
  console.log('🔧 Parámetros completos de req.query:', req.query);
  console.log('🔧 API Status:', ytmusic ? 'Initialized' : 'Not initialized');

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!ytmusic) {
    console.log('🔄 Attempting to reinitialize API...');
    await initializeYTMusic();

    if (!ytmusic) {
      return res
        .status(500)
        .json({ error: 'YouTube Music API not initialized' });
    }
  }

  try {
    let results;

    console.log('🎵 Executing search with API...');
    console.log('🎯 Ejecutando búsqueda de tipo:', type);

    switch (type) {
      case 'songs':
        console.log('🎵 Llamando a ytmusic.searchSongs()');
        results = await ytmusic.searchSongs(query);
        break;
      case 'artists':
        console.log('👨‍🎤 Llamando a ytmusic.searchArtists()');
        results = await ytmusic.searchArtists(query);
        break;
      case 'albums':
        console.log('💿 Llamando a ytmusic.searchAlbums()');
        results = await ytmusic.searchAlbums(query);
        break;
      default:
        console.log('🎵 Tipo no reconocido, usando searchSongs() por defecto');
        results = await ytmusic.searchSongs(query);
    }

    console.log('📊 Servidor: Resultados obtenidos:', {
      totalResults: results?.length || 0,
      searchType: type,
      query: query,
      hasResults: !!results,
    });

    // Debug: Log the structure of the first few results
    if (results && results.length > 0) {
      console.log('🔍 Debug: Estructura de los primeros resultados:');
      console.log(
        '🔍 Tipos originales de la API:',
        results.slice(0, 3).map((r) => r.type || 'NO_TYPE')
      );
      results.slice(0, 3).forEach((result, index) => {
        console.log(`📄 Resultado ${index + 1}:`, {
          keys: Object.keys(result),
          type: result.type || 'NO_TYPE_FIELD',
          name: result.name || result.title || 'NO_NAME_FIELD',
          videoId: result.videoId,
          artist: result.artist,
          duration: result.duration,
          // Mostrar thumbnails específicamente
          thumbnails: result.thumbnails
            ? JSON.stringify(result.thumbnails, null, 2)
            : 'NO_THUMBNAILS',
        });

        // Log adicional para thumbnails si existen
        if (result.thumbnails && Array.isArray(result.thumbnails)) {
          console.log(`🖼️ Thumbnails detallados para resultado ${index + 1}:`);
          result.thumbnails.forEach((thumb, thumbIndex) => {
            console.log(`  Thumbnail ${thumbIndex + 1}:`, {
              url: thumb.url,
              width: thumb.width,
              height: thumb.height,
              size: `${thumb.width}x${thumb.height}`,
            });
          });
        }
      });
    }

    // Add type field to results if it doesn't exist
    const processedResults = results.map((result) => {
      // If the result already has a type field, keep it
      if (result.type) {
        return result;
      }

      // Otherwise, add type based on search type
      let resultType;
      switch (type) {
        case 'songs':
          resultType = 'SONG';
          break;
        case 'artists':
          resultType = 'ARTIST';
          break;
        case 'albums':
          resultType = 'ALBUM';
          break;
        default:
          resultType = 'UNKNOWN';
      }

      return {
        ...result,
        type: resultType,
      };
    });

    console.log('✅ Processed results with type fields:', {
      originalCount: results.length,
      processedCount: processedResults.length,
      typesAdded: processedResults.map((r) => r.type).slice(0, 5),
    });

    res.json({
      success: true,
      data: processedResults || [],
    });
  } catch (error) {
    console.error('❌ Servidor: Error en búsqueda:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      success: false,
      error: 'Error al realizar la búsqueda',
      details: error.message,
    });
  }
});

// Get song details
app.get('/api/song/:videoId', async (req, res) => {
  const { videoId } = req.params;

  console.log('📋 Servidor: Obteniendo detalles de canción');
  console.log('🎯 Video ID:', videoId);

  if (!ytmusic) {
    return res.status(500).json({ error: 'YouTube Music API not initialized' });
  }

  try {
    const songDetails = await ytmusic.getSong(videoId);
    console.log('📋 Servidor: Detalles de canción obtenidos');
    console.log('📊 Estructura completa:', songDetails);
    console.log('🔑 Claves disponibles:', Object.keys(songDetails));

    res.json({
      success: true,
      data: songDetails,
    });
  } catch (error) {
    console.error('❌ Servidor: Error obteniendo detalles de canción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los detalles de la canción',
      details: error.message,
    });
  }
});

// Get song lyrics
app.get('/api/lyrics/:videoId', async (req, res) => {
  const { videoId } = req.params;

  console.log('🎼 Servidor: Obteniendo letras');
  console.log('🎯 Video ID:', videoId);

  try {
    const lyrics = await ytmusic.getLyrics(videoId);
    console.log('🎼 Servidor: Letras obtenidas');

    // Handle different lyrics formats
    let processedLyrics = '';

    if (lyrics) {
      if (typeof lyrics === 'string') {
        processedLyrics = lyrics;
      } else if (typeof lyrics === 'object') {
        // If lyrics is an object, try to extract the text
        if (lyrics.lyrics) {
          processedLyrics = lyrics.lyrics;
        } else if (lyrics.text) {
          processedLyrics = lyrics.text;
        } else if (lyrics.content) {
          processedLyrics = lyrics.content;
        } else {
          // Try to stringify the object and extract meaningful text
          const lyricsString = JSON.stringify(lyrics);
          processedLyrics = lyricsString;
        }
      } else {
        processedLyrics = String(lyrics);
      }
    }

    console.log('🎼 Servidor: Letras procesadas:', {
      hasLyrics: !!processedLyrics,
      length: processedLyrics.length,
      type: typeof processedLyrics,
      preview: processedLyrics.substring(0, 100) + '...',
    });

    res.json({
      success: true,
      data: processedLyrics,
    });
  } catch (error) {
    console.error('❌ Servidor: Error obteniendo letras:', error);
    console.error('❌ Servidor: Stack trace:', error.stack);

    res.status(500).json({
      success: false,
      error: 'Error al obtener las letras de la canción',
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiInitialized: !!ytmusic,
    apiType: ytmusic ? typeof ytmusic : 'undefined',
  });
});

// Catch-all handler: send back React's index.html file in production
if (process.env.NODE_ENV === 'production') {
  // Use a more specific pattern to avoid conflicts with path-to-regexp v8
  app.get('/*', (req, res, next) => {
    // Skip API routes - let them 404 naturally
    if (req.path.startsWith('/api/')) {
      return next();
    }

    console.log('🌐 Serving index.html for path:', req.path);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔧 API endpoints available at http://0.0.0.0:${PORT}/api/`);
  console.log(`🔍 Console logs habilitados para debugging`);
  console.log(`📱 Accesible desde la red local en http://[tu-ip]:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production mode: serving static files from /dist`);
  } else {
    console.log(`📱 React app will run on http://0.0.0.0:3000`);
    console.log(`🌐 Para acceso desde celular: http://[tu-ip]:3000`);
  }
});
