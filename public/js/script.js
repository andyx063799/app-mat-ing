// --- Lógica del Modo Oscuro/Claro (CORREGIDA) ---

const html = document.documentElement;
const toggleButton = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

 // Inicializar el tema basado en la preferencia guardada o el sistema.
function inicializarTema() {
    const temaGuardado = localStorage.getItem('theme');
    // Verificamos si el sistema prefiere el modo oscuro
    const temaPreferidoDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
         // Decidimos si debe estar en modo oscuro:
        // 1. Si está guardado como 'dark', O
        // 2. Si no hay tema guardado Y el sistema lo prefiere oscuro.
        const shouldBeDark = (temaGuardado === 'dark' || (!temaGuardado && temaPreferidoDark));

        if (shouldBeDark) {
            // Modo Oscuro activo (Agregamos la clase 'dark' al <html>)
            html.classList.add('dark');
            sunIcon.classList.remove('hidden'); // Mostramos el Sol (para cambiar a Claro)
            moonIcon.classList.add('hidden'); // Ocultamos la Luna
        } else {
            // Modo Claro activo (Removemos la clase 'dark' del <html>)
            html.classList.remove('dark');
            sunIcon.classList.add('hidden'); // Ocultamos el Sol
            moonIcon.classList.remove('hidden'); // Mostramos la Luna (para cambiar a Oscuro)
        }
    }

// Manejador del alternador de tema.
function alternarTema() {
     if (html.classList.contains('dark')) {
        // Actualmente está Oscuro -> Cambiar a Claro
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        moonIcon.classList.remove('hidden'); // Muestra Luna
        sunIcon.classList.add('hidden'); // Oculta Sol
    } else {
        // Actualmente está Claro -> Cambiar a Oscuro
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        moonIcon.classList.add('hidden'); // Oculta Luna
        sunIcon.classList.remove('hidden'); // Muestra Sol
    }
}

// - Eventos
toggleButton.addEventListener('click', alternarTema);

// - Inicializamos el tema al cargar la pagina.
inicializarTema();

// --- Lógica de Scroll Suave ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});