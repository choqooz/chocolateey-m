# Configuración de Vistas Previas (SEO) para Chocolateey

## ¿Qué se ha implementado?

### 1. Metadatos Open Graph

- **og:title**: Título que aparece en las vistas previas
- **og:description**: Descripción de la app
- **og:image**: Imagen de vista previa (1200x630px recomendado)
- **og:url**: URL de la página
- **og:type**: Tipo de contenido (website)

### 2. Metadatos Twitter Cards

- **twitter:card**: Tipo de tarjeta (summary_large_image)
- **twitter:title**: Título para Twitter
- **twitter:description**: Descripción para Twitter
- **twitter:image**: Imagen para Twitter

### 3. Metadatos adicionales

- **description**: Descripción para motores de búsqueda
- **keywords**: Palabras clave
- **author**: Autor de la app
- **theme-color**: Color del tema para navegadores móviles
- **canonical**: URL canónica

### 4. Web App Manifest

- Configuración PWA para instalación en dispositivos móviles
- Iconos y colores del tema

### 5. Componente SEO React

- Permite actualizar metadatos dinámicamente según el contenido
- Se puede usar en diferentes páginas con diferentes metadatos

## Pasos para completar la configuración:

### 1. Reemplazar URLs

En `index.html`, cambia todas las URLs de `https://tu-dominio.com/` por tu dominio real:

```html
<meta property="og:url" content="https://tu-dominio-real.com/" />
<meta property="twitter:url" content="https://tu-dominio-real.com/" />
<link rel="canonical" href="https://tu-dominio-real.com/" />
```

### 2. Crear imagen de vista previa optimizada

- Crea una imagen de 1200x630 píxeles
- Incluye el logo y nombre de tu app
- Usa colores que contrasten bien
- Guárdala como `og-image.png` en la carpeta `public/`
- Actualiza las referencias en `index.html`:

```html
<meta property="og:image" content="https://tu-dominio.com/og-image.png" />
<meta property="twitter:image" content="https://tu-dominio.com/og-image.png" />
```

### 3. Personalizar metadatos por página

Usa el componente SEO en diferentes páginas:

```jsx
// Para la página de búsqueda
<SEO
  title="Buscar Música - Chocolateey"
  description="Encuentra tu música favorita en Chocolateey"
  image="/search-preview.png"
  url={window.location.href}
/>

// Para la página de biblioteca
<SEO
  title="Mi Biblioteca - Chocolateey"
  description="Tu biblioteca personal de música"
  image="/library-preview.png"
  url={window.location.href}
/>
```

### 4. Probar las vistas previas

#### Facebook/Instagram:

1. Ve a [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Pega tu URL
3. Haz clic en "Debug"
4. Si hay caché, haz clic en "Scrape Again"

#### Twitter:

1. Ve a [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Pega tu URL
3. Haz clic en "Preview card"

#### WhatsApp/Telegram:

- Simplemente pega el link en un chat
- Debería mostrar la vista previa automáticamente

### 5. Configurar servidor (si es necesario)

Si usas un servidor como Express.js, asegúrate de que sirva los archivos estáticos correctamente:

```javascript
app.use(express.static('public'));
```

### 6. Verificar con herramientas online

- [Open Graph Checker](https://www.opengraph.xyz/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## Consejos adicionales:

1. **Imágenes**: Usa formatos modernos como WebP para mejor rendimiento
2. **Títulos**: Mantén títulos entre 50-60 caracteres
3. **Descripciones**: Mantén descripciones entre 150-160 caracteres
4. **URLs**: Usa URLs amigables y descriptivas
5. **Actualización**: Los cambios pueden tardar hasta 24 horas en propagarse

## Solución de problemas:

### Las vistas previas no aparecen:

1. Verifica que las URLs sean absolutas (https://...)
2. Asegúrate de que las imágenes sean accesibles públicamente
3. Limpia el caché de las redes sociales
4. Verifica que el servidor esté configurado correctamente

### Las imágenes no se cargan:

1. Verifica que la ruta de la imagen sea correcta
2. Asegúrate de que la imagen sea menor a 8MB
3. Usa formatos soportados (PNG, JPG, GIF)

### Los metadatos no se actualizan:

1. Verifica que el componente SEO esté importado correctamente
2. Asegúrate de que las props se pasen correctamente
3. Verifica la consola del navegador por errores
