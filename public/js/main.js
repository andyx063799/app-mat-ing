        // Variables globales
        const math = window.math;
        let numVars = 2; // Por defecto: 2 variables (x, y)

        // Referencias a elementos del DOM
        const htmlElement = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        const functionInput = document.getElementById('function-input');
        const calculateBtn = document.getElementById('calculate-btn');
        const clearBtn = document.getElementById('clear-btn');
        const varButtons = document.querySelectorAll('.var-btn');
        const pointInputsContainer = document.getElementById('point-inputs');
        const pointZContainer = document.getElementById('point-z-container');
        const resultPanel = document.getElementById('result-panel');
        const procedureContent = document.getElementById('procedure-content');
        const finalResultContent = document.getElementById('final-result-content');
        const messageBox = document.getElementById('message-box');

        // Referencias a inputs de puntos
        const pointInputs = {
            x: document.getElementById('point-x'),
            y: document.getElementById('point-y'),
            z: document.getElementById('point-z'),
        };

        // Lógica de Modo Oscuro
        
        /**
         * Alterna la clase 'dark' en el elemento HTML y actualiza los iconos.
         * Se simplificó para solo modificar el elemento HTML, lo estándar en Tailwind.
         * @param {boolean} isDark - True para modo oscuro, false para modo claro.
         */
        function applyTheme(isDark) {
            if (isDark) {
                htmlElement.classList.add('dark');
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                htmlElement.classList.remove('dark');
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
            // Importante: Volver a aplicar los estilos de los botones de variables
            // para que se ajusten al nuevo tema si ya estaban inicializados.
            // setVariableMode(numVars); // Esto no es necesario si las clases dark: ya están en el HTML
        }

        /**
         * Carga el tema guardado en localStorage o detecta la preferencia del sistema.
         */
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            let isDark;

            if (savedTheme) {
                // Usar el tema guardado
                isDark = savedTheme === 'dark';
            } else {
                // Detectar preferencia del sistema
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            applyTheme(isDark);
        }
        
        /**
         * Alterna entre modo claro y oscuro y guarda la preferencia.
         */
        function toggleTheme() {
            const isDark = htmlElement.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            
            applyTheme(!isDark);
            localStorage.setItem('theme', newTheme);
        }

        // Asignación de listener para el toggle de tema
        themeToggle.addEventListener('click', toggleTheme);

        // Función para mostrar mensajes de error/éxito
        function showMessage(type, message) {
            messageBox.textContent = message;
            // Configurar clases para modos claro/oscuro
            const isDark = htmlElement.classList.contains('dark');
            
            let classes = [];
            if (type === 'error') {
                // Clases robustas para modo oscuro y claro
                classes = isDark ? ['bg-red-900', 'text-red-300'] : ['bg-red-100', 'text-red-800'];
            } else if (type === 'success') {
                classes = isDark ? ['bg-green-900', 'text-green-300'] : ['bg-green-100', 'text-green-800'];
            }
            
            messageBox.className = 'mt-6 p-4 text-sm rounded-lg transition-all duration-300';
            messageBox.classList.add(...classes);
            messageBox.classList.remove('hidden');
        }

        function clearMessage() {
            messageBox.classList.add('hidden');
            messageBox.className = 'mt-6 p-4 text-sm rounded-lg transition-all duration-300 hidden';
        }

        // Lógica de cambio de variables
        function setVariableMode(vars) {
            numVars = vars;
            
            // Actualizar el estilo de los botones (adaptado para dark mode)
            varButtons.forEach(btn => {
                const isSelected = parseInt(btn.dataset.vars) === vars;
                
                // Limpiar clases de modo
                btn.classList.remove('text-white', 'bg-indigo-600', 'hover:bg-indigo-700', 'dark:bg-indigo-700', 'dark:hover:bg-indigo-600', 'text-indigo-700', 'bg-indigo-100', 'hover:bg-indigo-200', 'dark:text-indigo-200', 'dark:bg-indigo-900/50', 'dark:hover:bg-indigo-900');

                if (isSelected) {
                    // Seleccionado
                    btn.classList.add('text-white', 'bg-indigo-600', 'hover:bg-indigo-700', 'dark:bg-indigo-700', 'dark:hover:bg-indigo-600');
                } else {
                    // No seleccionado
                    btn.classList.add('text-indigo-700', 'bg-indigo-100', 'hover:bg-indigo-200', 'dark:text-indigo-200', 'dark:bg-indigo-900/50', 'dark:hover:bg-indigo-900');
                }
            });

            // Mostrar/Ocultar input de 'z'
            if (vars === 3) {
                pointZContainer.classList.remove('hidden');
                pointInputsContainer.classList.remove('grid-cols-2');
                pointInputsContainer.classList.add('grid-cols-3');
            } else {
                pointZContainer.classList.add('hidden');
                pointInputsContainer.classList.add('grid-cols-2');
                pointInputsContainer.classList.remove('grid-cols-3');
            }
        }

        // Manejador de botones de variables
        varButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setVariableMode(parseInt(btn.dataset.vars));
                clearMessage();
            });
        });

        // Función principal de cálculo (sin cambios en la lógica matemática)
        function calculateGradient() {
            clearMessage();
            resultPanel.classList.add('hidden');
            procedureContent.innerHTML = '';
            finalResultContent.textContent = '';

            const funcStr = functionInput.value.trim();
            if (!funcStr) {
                showMessage('error', 'Por favor, ingresa una función.');
                return;
            }

            try {
                // 1. Parsing de la función
                const expression = math.parse(funcStr);
                const variables = numVars === 2 ? ['x', 'y'] : ['x', 'y', 'z'];
                const derivatives = [];
                let procedureHtml = '';
                let gradientComponents = [];

                // 2. Cálculo de derivadas parciales (Procedimiento Simbólico)
                variables.forEach(v => {
                    const derivative = math.derivative(expression, v);
                    derivatives.push(derivative);
                    
                    const derivativeStr = derivative.toString({ parenthesis: 'auto', implicit: 'hide' });
                    procedureHtml += `
                        <p>
                            <span class="font-bold">∂f/∂${v}:</span>
                            <span class="math-expr">${derivativeStr}</span>
                        </p>
                    `;
                    gradientComponents.push(derivativeStr);
                });

                // Mostrar gradiente simbólico
                procedureHtml = `
                    <p class="font-bold">Vector Gradiente (∇f) Simbólico:</p>
                    <p class="math-expr text-lg">∇f = [ ${gradientComponents.join(', ')} ]</p>
                    <hr class="my-3 border-indigo-200 dark:border-indigo-700">
                    <p class="font-bold">Derivadas Parciales:</p>
                ` + procedureHtml;

                
                // 3. Verificación de punto de evaluación
                const scope = {};
                let isEvaluationPointProvided = false;

                variables.forEach(v => {
                    const input = pointInputs[v];
                    if (numVars === 3 || v !== 'z') { // 'z' solo se considera en 3D
                         if (input && input.value !== "") {
                            scope[v] = parseFloat(input.value);
                            isEvaluationPointProvided = true;
                        }
                    }
                });
                
                // Validar que si uno se llena, todos los necesarios se llenen
                const requiredVars = variables.length;
                const filledVars = Object.keys(scope).length;

                if (isEvaluationPointProvided && filledVars !== requiredVars) {
                    showMessage('error', `Se deben ingresar valores para todas las variables (${variables.join(', ')}) si se desea evaluar el punto.`);
                    return;
                }
                
                // 4. Evaluación en el punto (si es aplicable)
                let finalResultText;
                
                if (isEvaluationPointProvided) {
                    const evaluatedComponents = [];
                    procedureHtml += `<hr class="my-3 border-indigo-200 dark:border-indigo-700">
                                      <p class="font-bold">Evaluación en el punto P(${variables.map(v => scope[v]).join(', ')}):</p>`;

                    derivatives.forEach((d, index) => {
                        const v = variables[index];
                        const result = d.evaluate(scope);
                        evaluatedComponents.push(math.format(result, { precision: 5 }));
                        procedureHtml += `
                            <p>
                                <span class="font-bold">∂f/∂${v}(P) =</span>
                                <span class="math-expr">${d.toString({ parenthesis: 'auto', implicit: 'hide' }).replace(v, `(${scope[v]})`)} ≈ ${math.format(result, { precision: 5 })}</span>
                            </p>
                        `;
                    });

                    finalResultText = `∇f(P) ≈ ⟨ ${evaluatedComponents.join(', ')} ⟩`;
                } else {
                    // Resultado final es la expresión simbólica
                    finalResultText = `∇f = ⟨ ${gradientComponents.join(', ')} ⟩`;
                    procedureHtml += `<p class="mt-2 text-indigo-700 dark:text-indigo-300 font-semibold">Nota: No se proporcionó un punto, el resultado final es la expresión simbólica.</p>`;
                }

                // 5. Mostrar resultados
                procedureContent.innerHTML = procedureHtml;
                finalResultContent.textContent = finalResultText;
                resultPanel.classList.remove('hidden');
                showMessage('success', 'Cálculo del gradiente realizado con éxito.');

            } catch (error) {
                // Manejo de errores de Math.js o parsing
                console.error("Error de cálculo:", error);
                showMessage('error', `Error en la función o punto: ${error.message}. Verifica la sintaxis (ej: usa '*' para multiplicación, 'sin(x)', 'x^2').`);
            }
        }

        // Limpiar campos
        function clearFields() {
            functionInput.value = '';
            pointInputs.x.value = '';
            pointInputs.y.value = '';
            pointInputs.z.value = '';
            resultPanel.classList.add('hidden');
            clearMessage();
        }

        // Asignación de Event Listeners
        calculateBtn.addEventListener('click', calculateGradient);
        clearBtn.addEventListener('click', clearFields);

        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Cargar el tema (Light/Dark)
            loadTheme();

            // 2. Inicializar modo 2 variables
            setVariableMode(2);
            
            // 3. Mostrar ejemplos de uso
            showMessage('success', 'Ejemplos: 3x^2 + y^3 (2D), sin(x*y) + z^2 (3D). Usa * para multiplicación.');
        });