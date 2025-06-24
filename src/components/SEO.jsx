import { useEffect } from 'react';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  useEffect(() => {
    // Actualizar el título de la página
    if (title) {
      document.title = title;
    }

    // Actualizar metadatos Open Graph
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Actualizar metadatos Twitter
    const updateTwitterMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="twitter:${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', `twitter:${name}`);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Actualizar metadatos básicos
    const updateBasicMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (title) {
      updateMetaTag('og:title', title);
      updateTwitterMeta('title', title);
    }

    if (description) {
      updateMetaTag('og:description', description);
      updateTwitterMeta('description', description);
      updateBasicMeta('description', description);
    }

    if (image) {
      updateMetaTag('og:image', image);
      updateTwitterMeta('image', image);
    }

    if (url) {
      updateMetaTag('og:url', url);
      updateTwitterMeta('url', url);
    }

    updateMetaTag('og:type', type);
  }, [title, description, image, url, type]);

  return null; // Este componente no renderiza nada
};

export default SEO;
