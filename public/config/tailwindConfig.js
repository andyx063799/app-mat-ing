tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        // - Mapeo de los colores personalizados del usuario para Dark Mode
                        'dark-primary': '#0F172A', // - Slate 900 (Fondo Oscuro)
                        'dark-secondary': '#1E293B', // - Slate 800 (Fondo Secundario Oscuro)
                        // - Mapeo de los colores personalizados del usuario para Light Mode
                        'light-primary': '#FFFFFF', // - Blanco (Fondo Claro)
                        'light-secondary': '#F1F5F9', // - Slate 100 (Fondo Secundario Claro)
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        }