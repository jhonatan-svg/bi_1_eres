const etlButton = document.querySelector('#run-etl');

if (etlButton) {
  const progressBar = document.querySelector('#etl-progress');
  const progress = document.querySelector('.etl-progress');
  const message = document.querySelector('#etl-message');
  const state = document.querySelector('#etl-state');
  const rows = document.querySelector('#etl-rows');
  const steps = [
    { value: 25, title: 'EXTRACT · 25%', text: 'Se leyeron 3 registros de ventas desde el archivo CSV.' },
    { value: 55, title: 'TRANSFORM · 55%', text: 'Se estandarizaron nombres y fechas; se validaron unidades y precios.' },
    { value: 82, title: 'VALIDATE · 82%', text: 'Un registro con unidades negativas se apartó para revisión.' },
    { value: 100, title: 'LOAD · 100%', text: '2 registros limpios quedaron listos para alimentar un informe.' }
  ];

  etlButton.addEventListener('click', () => {
    etlButton.disabled = true;
    etlButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Procesando datos';
    progressBar.style.width = '0%';
    progress.setAttribute('aria-valuenow', '0');
    rows.innerHTML = '<tr><td> cuaderno A4 </td><td>2026/04/03</td><td>2</td><td>3.50</td></tr><tr class="raw-invalid"><td>Lapiz HB</td><td>04-03-26</td><td>-1</td><td>0.50</td></tr><tr><td>Marcador azul</td><td>2026/04/04</td><td>5</td><td>1.20</td></tr>';

    steps.forEach((step, index) => {
      window.setTimeout(() => {
        progressBar.style.width = `${step.value}%`;
        progress.setAttribute('aria-valuenow', String(step.value));
        state.textContent = step.title;
        message.textContent = step.text;
        if (index === steps.length - 1) {
          rows.innerHTML = '<tr class="clean-row"><td>Cuaderno A4</td><td>03/04/2026</td><td>2</td><td>$3.50</td></tr><tr class="clean-row"><td>Marcador azul</td><td>04/04/2026</td><td>5</td><td>$1.20</td></tr>';
          etlButton.disabled = false;
          etlButton.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Repetir simulación';
        }
      }, index * 850);
    });
  });
}

const navCollapse = document.querySelector('#mainNav');
navCollapse?.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 991.98px)').matches && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }
  });
});