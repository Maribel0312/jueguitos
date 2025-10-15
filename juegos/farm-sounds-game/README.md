Juego: Sonidos de la granja

Descripción

Un juego web estático para aprender onomatopeyas de animales de la granja. Tiene dos modos:

- Modo quiz: se reproduce una onomatopeya y debes elegir el animal correcto.
- Modo libre: al hacer clic en un animal, escucharás su onomatopeya.

Cómo usar

1. Abre `index.html` en un navegador moderno (Chrome, Edge, Firefox).
2. Pulsa "Nuevo (Quiz)" para iniciar un quiz.
3. Escucha la onomatopeya y selecciona el animal correspondiente.
4. Alterna "Modo libre" para escuchar onomatopeyas haciendo clic en animales.

Notas técnicas

- Usa la Web Speech API (SpeechSynthesis) para pronunciar las onomatopeyas. Si el navegador no la soporta, se usa una señal de audio como fallback.
- Para añadir imágenes o sonidos reales, colócalos en la carpeta `assets` y actualiza `app.js`.

Siguientes pasos sugeridos

- Añadir sonidos reales (archivos .mp3) y un conmutador para usarlos en lugar de SpeechSynthesis.
- Añadir niveles y temporizador.
- Internacionalización para onomatopeyas en otros idiomas.

Mejoras realizadas en esta versión

- Onomatopeyas más largas y detalladas para mejor comprensión.
- Más animales añadidos (perro, gato, pato, cabra, burro, etc.).
- Configurable: número de preguntas por sesión (3/5/8) y contador de preguntas restantes.

Cómo probar las mejoras

1. Abrir `index.html` en el navegador o servir la carpeta mediante un servidor local.
2. Selecciona el número de preguntas en "Preguntas por sesión".
3. Pulsa "Nuevo (Quiz)" para empezar. La onomatopeya será más larga y vendrá con una pregunta de voz.

Notas

- Si quieres usar archivos de audio reales en `assets/`, puedo añadir una opción en la UI para alternar entre "voz" y "sonidos reales" y crear una muestra de archivo por animal.

Añadir imágenes reales de animales

Coloca imágenes en la carpeta `assets/images/` usando el identificador del animal como nombre de archivo. El juego buscará, en este orden, `webp`, `png` y `jpg`:

```
assets/images/cow.webp
assets/images/pig.jpg
assets/images/dog.png
```

Si no existe la imagen para un animal, el juego usará el emoji como fallback.

Recomendaciones:
- Usa imágenes cuadradas o recortadas al centro. El CSS usa `object-fit: cover`.
- Formato `webp` es preferido para menor tamaño.
