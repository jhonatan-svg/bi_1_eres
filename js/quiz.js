const quizQuestions = [
  { question: '¿Cuál es el propósito principal de Business Intelligence?', options: ['Almacenar todos los datos sin analizarlos', 'Convertir datos en información útil para decidir', 'Reemplazar a las personas que toman decisiones', 'Crear gráficos aunque no haya una pregunta de negocio'], answer: 1, explanation: 'BI integra datos, análisis y visualización para respaldar decisiones informadas.' },
  { question: '¿Qué ocurre durante la etapa de extracción en ETL?', options: ['Se presentan los resultados en un dashboard', 'Se obtienen datos desde una o más fuentes', 'Se eliminan todos los registros antiguos', 'Se elige una alternativa de negocio'], answer: 1, explanation: 'Extract obtiene los datos desde fuentes como archivos, hojas de cálculo o bases de datos.' },
  { question: 'Una fecha aparece como 03/04/26 y 2026-04-03. ¿Qué tarea ETL ayuda a analizarlas juntas?', options: ['Transformar y estandarizar el formato', 'Cargar sin revisar', 'Crear un KPI nuevo', 'Eliminar la fuente de datos'], answer: 0, explanation: 'La transformación normaliza formatos para que las fechas se puedan comparar correctamente.' },
  { question: '¿Cuál es un ejemplo de KPI deportivo?', options: ['El color del uniforme', 'Puntos obtenidos por jornada', 'El nombre del estadio', 'La hora de publicación de un informe'], answer: 1, explanation: 'Los puntos por jornada miden una dimensión del rendimiento deportivo.' },
  { question: '¿Qué conviene hacer con un registro que tiene unidades vendidas iguales a -1?', options: ['Usarlo sin comprobar', 'Validarlo y apartarlo si no es válido', 'Duplicarlo para compensar', 'Cambiarlo a 1 sin documentarlo'], answer: 1, explanation: 'La calidad de datos exige validar valores y tratar las anomalías de forma transparente.' },
  { question: 'Una tienda detecta que bajaron sus ventas. ¿Cuál es el siguiente paso más sólido?', options: ['Cambiar todos los precios de inmediato', 'Recopilar datos relevantes y analizar la caída', 'Asumir que el problema es la publicidad', 'Dejar de medir las ventas'], answer: 1, explanation: 'Primero se reúne evidencia relevante; después se comparan causas y acciones posibles.' },
  { question: '¿Qué describe mejor un dashboard?', options: ['Una colección de datos sin contexto', 'Una vista visual de indicadores para seguir y explorar resultados', 'Un respaldo automático de archivos', 'Un proceso de captura manual'], answer: 1, explanation: 'Un dashboard reúne visualizaciones e indicadores relacionados para facilitar el seguimiento.' },
  { question: '¿Para qué sirve la etapa Load de ETL?', options: ['Guardar los datos preparados en un destino de análisis', 'Buscar errores tipográficos en las fuentes', 'Elegir una meta comercial', 'Recopilar opiniones de clientes'], answer: 0, explanation: 'Load carga los datos procesados en un almacén u otro destino para informes y análisis.' },
  { question: '¿Cuál es un ejemplo de un problema de calidad de datos?', options: ['Dos formatos distintos para la misma fecha', 'Una visualización con título', 'Un indicador con una meta definida', 'Un informe con filtros'], answer: 0, explanation: 'Formatos inconsistentes pueden impedir comparaciones y cálculos fiables.' },
  { question: '¿Qué distingue una conclusión de un dato observado?', options: ['La conclusión interpreta uno o varios datos', 'El dato observado siempre es una opinión', 'Son exactamente lo mismo', 'La conclusión no necesita evidencia'], answer: 0, explanation: 'El dato registra algo medido; la conclusión explica qué podría significar ese patrón.' },
  { question: '¿Por qué se comparan alternativas antes de decidir?', options: ['Para evitar medir los resultados', 'Para valorar opciones con criterios y evidencia', 'Para hacer más grande el dashboard', 'Para sustituir los datos por intuición'], answer: 1, explanation: 'Comparar alternativas permite elegir una acción considerando sus posibles resultados.' },
  { question: 'Después de ajustar el inventario, ¿cómo se evalúa si la decisión ayudó?', options: ['Se deja de revisar el stock', 'Se comparan KPI definidos con un periodo de referencia', 'Se cambia la decisión cada día', 'Se cuentan solo las visitas a la tienda'], answer: 1, explanation: 'Los KPI vinculados al objetivo ayudan a medir el efecto de una decisión en un periodo definido.' }
];

const startButton = document.querySelector('#start-quiz');

if (startButton) {
  const startPanel = document.querySelector('#quiz-start');
  const gamePanel = document.querySelector('#quiz-game');
  const resultPanel = document.querySelector('#quiz-result');
  const questionLabel = document.querySelector('#quiz-question');
  const optionsPanel = document.querySelector('#quiz-options');
  const counter = document.querySelector('#quiz-counter');
  const scoreLabel = document.querySelector('#quiz-score');
  const progressBar = document.querySelector('#quiz-progress');
  const feedback = document.querySelector('#quiz-feedback');
  const nextButton = document.querySelector('#next-question');
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const item = quizQuestions[currentIndex];
    answered = false;
    counter.textContent = `PREGUNTA ${currentIndex + 1} / ${quizQuestions.length}`;
    scoreLabel.textContent = `${score} PUNTOS`;
    progressBar.style.width = `${(currentIndex / quizQuestions.length) * 100}%`;
    questionLabel.textContent = item.question;
    feedback.classList.add('d-none');
    feedback.classList.remove('feedback-wrong');
    nextButton.classList.add('d-none');
    nextButton.innerHTML = currentIndex === quizQuestions.length - 1 ? 'Ver resultados <i class="bi bi-arrow-right ms-2"></i>' : 'Siguiente pregunta <i class="bi bi-arrow-right ms-2"></i>';
    optionsPanel.innerHTML = '';

    item.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span>${option}`;
      button.addEventListener('click', () => chooseAnswer(index));
      optionsPanel.append(button);
    });
  }

  function chooseAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
    const item = quizQuestions[currentIndex];
    const optionButtons = optionsPanel.querySelectorAll('.quiz-option');
    optionButtons.forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add('correct');
      if (index === selectedIndex && selectedIndex !== item.answer) button.classList.add('incorrect');
    });
    const isCorrect = selectedIndex === item.answer;
    if (isCorrect) score += 100;
    scoreLabel.textContent = `${score} PUNTOS`;
    feedback.textContent = `${isCorrect ? '¡Correcto!' : 'No exactamente.'} ${item.explanation}`;
    feedback.classList.toggle('feedback-wrong', !isCorrect);
    feedback.classList.remove('d-none');
    nextButton.classList.remove('d-none');
  }

  function showResult() {
    const percentage = Math.round((score / (quizQuestions.length * 100)) * 100);
    const ranks = [
      { minimum: 90, name: 'Maestro BI', icon: 'bi-trophy-fill', message: 'Conectas los datos con decisiones de alto impacto.' },
      { minimum: 70, name: 'Analista BI', icon: 'bi-graph-up-arrow', message: 'Lees patrones con criterio y sabes cómo convertirlos en acciones.' },
      { minimum: 40, name: 'Aprendiz BI', icon: 'bi-stars', message: 'Ya tienes buenas bases. Sigue practicando con preguntas de negocio.' },
      { minimum: 0, name: 'Explorador de datos', icon: 'bi-compass', message: 'Cada análisis comienza con curiosidad. Sigue explorando los fundamentos.' }
    ];
    const rank = ranks.find((entry) => percentage >= entry.minimum);
    gamePanel.classList.add('d-none');
    resultPanel.innerHTML = `<div class="result-badge"><i class="bi ${rank.icon}"></i></div><p class="eyebrow">DESAFÍO COMPLETADO</p><h3>${rank.name}</h3><div class="result-score">${score}<small> / ${quizQuestions.length * 100} puntos</small></div><p><strong>${percentage}% de aciertos</strong></p><p class="result-note">${rank.message}</p><button class="btn btn-ink" id="retry-quiz"><i class="bi bi-arrow-repeat me-2"></i>Repetir desafío</button>`;
    resultPanel.classList.remove('d-none');
    resultPanel.querySelector('#retry-quiz').addEventListener('click', resetQuiz);
  }

  function resetQuiz() {
    currentIndex = 0;
    score = 0;
    resultPanel.classList.add('d-none');
    gamePanel.classList.remove('d-none');
    renderQuestion();
  }

  startButton.addEventListener('click', () => {
    startPanel.classList.add('d-none');
    gamePanel.classList.remove('d-none');
    resetQuiz();
  });

  nextButton.addEventListener('click', () => {
    if (!answered) return;
    currentIndex += 1;
    if (currentIndex >= quizQuestions.length) showResult();
    else renderQuestion();
  });
}