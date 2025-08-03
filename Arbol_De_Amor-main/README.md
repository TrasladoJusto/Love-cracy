# Árbol de Amor - Proyecto Web

## Cómo subir a GitHub Pages para compartir en WhatsApp

### Pasos:

1. **Crear un repositorio en GitHub:**
   - Ve a [github.com](https://github.com)
   - Haz clic en "New repository"
   - Nombra el repositorio: `arbol-de-amor`
   - Marca "Public"
   - Haz clic en "Create repository"

2. **Subir los archivos:**
   ```bash
   # En tu carpeta del proyecto
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/arbol-de-amor.git
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Ve a "Settings" → "Pages"
   - En "Source" selecciona "Deploy from a branch"
   - Selecciona "main" branch
   - Haz clic en "Save"

4. **Tu sitio estará disponible en:**
   `https://TU_USUARIO.github.io/arbol-de-amor`

5. **Compartir en WhatsApp:**
   - Copia la URL del sitio
   - Pégala en WhatsApp
   - Se abrirá en el navegador del destinatario

### Estructura del proyecto:
```
arbol-de-amor/
├── index.html
├── Css/
│   ├── style.css
│   └── style.mobile.css
├── Js/
│   └── script.js
├── Img/
│   ├── treelove.svg
│   └── hermoso-ramo-flores-dibujado-mano_44538-13746.svg
└── Music/
    ├── music1.mp3
    └── music2.mp3
```

## Opciones alternativas:

### Netlify (Gratis):
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra tu carpeta del proyecto
3. Obtienes una URL automática

### Vercel (Gratis):
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Se despliega automáticamente

### Firebase Hosting (Gratis):
1. Instala Firebase CLI
2. Ejecuta `firebase init hosting`
3. Ejecuta `firebase deploy` 