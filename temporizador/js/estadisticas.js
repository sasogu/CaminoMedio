let offsetSemanas = parseInt(localStorage.getItem('offsetSemanas') || '0');

export function toggleModoOscuro() {
  document.body.classList.toggle('dark-mode');
  const oscuro = document.body.classList.contains('dark-mode');
  localStorage.setItem('modoOscuro', oscuro ? '1' : '0');
}

export function cambiarSemana(direccion) {
  offsetSemanas += direccion;
  localStorage.setItem('offsetSemanas', offsetSemanas);
  mostrarEstadisticas();
}

export function resetSemana() {
  offsetSemanas = 0;
  localStorage.setItem('offsetSemanas', 0);
  mostrarEstadisticas();
}

export function mostrarEstadisticasHistorial() {
  const totalSesiones = localStorage.getItem('totalSesiones') || 0;
  const totalTiempo = localStorage.getItem('tiempoTotal') || 0;
  const historial = JSON.parse(localStorage.getItem('historialSesiones') || '{}');

  const estadisticasElement = document.getElementById('estadisticas');
  if (estadisticasElement) {
      estadisticasElement.innerHTML = `
          <p>Total de sesiones: ${totalSesiones}</p>
          <p>Tiempo total: ${Math.floor(totalTiempo / 60)} minutos</p>
          <h3>Historial:</h3>
          <ul>
              ${Object.entries(historial).map(([fecha, tiempo]) => `
                  <li>${fecha}: ${Math.floor(tiempo / 60)} minutos</li>
              `).join('')}
          </ul>
      `;
  }
}

export function registrarFin(duracionSegundos) {
  let totalSesiones = parseInt(localStorage.getItem('totalSesiones') || '0');
  let totalTiempo = parseInt(localStorage.getItem('tiempoTotal') || '0');

  totalSesiones += 1;
  totalTiempo += duracionSegundos;

  localStorage.setItem('totalSesiones', totalSesiones);
  localStorage.setItem('tiempoTotal', totalTiempo);

  const hoy = new Date().toISOString().split('T')[0];
  const historial = JSON.parse(localStorage.getItem('historialSesiones') || '{}');
  historial[hoy] = (historial[hoy] || 0) + duracionSegundos;

  localStorage.setItem('historialSesiones', JSON.stringify(historial));
  console.log(`Tiempo registrado: ${duracionSegundos} segundos.`);
}

export function calcularRacha(historial) {
  const dias = Object.keys(historial).sort().reverse();
  let racha = 0;
  let fecha = new Date(dias[0] || new Date());

  for (let i = 0; i < dias.length; i++) {
    const esperado = new Date(fecha);
    esperado.setDate(esperado.getDate() - i);
    const esperadoStr = esperado.toISOString().split('T')[0];
    if (historial[esperadoStr]) {
      racha++;
    } else {
      break;
    }
  }
  return racha;
}

export function mostrarGrafico(historial) {
  const fechas = [];
  const hoy = new Date();
  hoy.setDate(hoy.getDate() - offsetSemanas * 7);
  for (let i = 6; i >= 0; i--) {
    const dia = new Date(hoy);
    dia.setDate(dia.getDate() - i);
    fechas.push(dia.toISOString().split('T')[0]);
  }

  const datos = fechas.map(f => Math.floor((historial[f] || 0) / 60));
  const colores = datos.map(min => {
    if (min >= 30) return 'green';
    if (min >= 10) return 'goldenrod';
    return 'tomato';
  });

  const ctx = document.getElementById('graficoHistorial').getContext('2d');
  if (window.graficoAnterior) window.graficoAnterior.destroy();

  window.graficoAnterior = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Minutos de meditación',
        data: datos,
        backgroundColor: colores
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const diasConPractica = datos.filter(min => min > 0).length;
  const promedio = datos.reduce((a, b) => a + b, 0) / datos.length;
  let mensaje = '';
  if (diasConPractica === 7 && promedio >= 30) mensaje = '🌸 Semana excelente. Constancia y profundidad.';
  else if (diasConPractica >= 5) mensaje = '🌿 Muy bien, práctica sólida. Sigue así.';
  else if (diasConPractica >= 3) mensaje = '🍃 Buena intención. Puedes afianzar la regularidad.';
  else if (diasConPractica > 0) mensaje = '🪷 Primeros pasos. La práctica te espera.';
  else mensaje = '🌑 Esta semana está vacía. Silencio como potencial.';

  document.getElementById('resumenSemana').textContent = mensaje;
}

export function mostrarEstadisticas() {
  const sesiones = localStorage.getItem('totalSesiones') || '0';
  const tiempo = localStorage.getItem('tiempoTotal') || '0';
  const minutos = Math.floor(tiempo / 60);
  const historial = JSON.parse(localStorage.getItem('historialSesiones') || '{}');
  const racha = calcularRacha(historial);

  let tabla = '<table><tr><th>Fecha</th><th>Minutos</th></tr>';
  Object.entries(historial).sort().reverse().forEach(([fecha, segundos]) => {
    tabla += `<tr><td>${fecha}</td><td>${Math.floor(segundos / 60)}</td></tr>`;
  });
  tabla += '</table>';

  document.getElementById('estadisticas').innerHTML = `
    <p>🧘 Sesiones completadas: ${sesiones}</p>
    <p>⏳ Tiempo total: ${minutos} minutos</p>
    <p>🔥 Racha actual: ${racha} día(s)</p>
    <h4>🗓 Historial completo:</h4>
    ${tabla}
  `;

  const ultimaImportacion = localStorage.getItem('ultimaImportacion');
  if (ultimaImportacion) {
    const fecha = new Date(ultimaImportacion).toLocaleString();
    document.getElementById('estadisticas').innerHTML += `<p>📤 Última importación: ${fecha}</p>`;
  }

  document.getElementById('estadisticas').classList.add('fade-in');
  setTimeout(() => {
    document.getElementById('estadisticas').classList.remove('fade-in');
  }, 700);

  mostrarGrafico(historial);
}

export function exportarHistorialCSV() {
  const historial = JSON.parse(localStorage.getItem('historialSesiones') || '{}');
  let csv = 'Fecha,Minutos\n';
  Object.entries(historial).sort().forEach(([fecha, segundos]) => {
    csv += `${fecha},${Math.floor(segundos / 60)}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'historial_meditacion.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.addEventListener('DOMContentLoaded', () => {
  const importarCSV = document.getElementById('importarCSV');
  if (importarCSV) {
    importarCSV.addEventListener('change', function(event) {
      const archivo = event.target.files[0];
      if (!archivo) return;

      const lector = new FileReader();
      lector.onload = function(e) {
        const contenido = e.target.result;
        const lineas = contenido.split('\n').filter(l => l.trim().length > 0);

        const nuevoHistorial = {};
        for (let i = 1; i < lineas.length; i++) {
          const [fecha, minutos] = lineas[i].split(',');
          if (fecha && minutos) {
            const segundos = parseInt(minutos.trim()) * 60;
            nuevoHistorial[fecha.trim()] = segundos;
          }
        }

        const historialActual = JSON.parse(localStorage.getItem('historialSesiones') || '{}');
        const fechasComunes = Object.keys(nuevoHistorial).filter(f => historialActual[f]);

        if (fechasComunes.length > 0) {
          const confirmar = confirm(
            `⚠️ Atención: Se han encontrado ${fechasComunes.length} fecha(s) que ya existen en el historial.\n` +
            `Si continúas, se sumará el tiempo del CSV a esas fechas.\n\n¿Quieres continuar?`
          );
          if (!confirmar) {
            alert('❌ Importación cancelada.');
            return;
          }
        }

        for (let fecha in nuevoHistorial) {
          if (historialActual[fecha]) {
            historialActual[fecha] += nuevoHistorial[fecha];
          } else {
            historialActual[fecha] = nuevoHistorial[fecha];
          }
        }

        const fechas = Object.keys(historialActual).sort();
        const totalSesiones = fechas.length;
        const tiempoTotal = Object.values(historialActual).reduce((a, b) => a + b, 0);
        const desde = fechas[0];
        const hasta = fechas[fechas.length - 1];

        localStorage.setItem('historialSesiones', JSON.stringify(historialActual));
        localStorage.setItem('totalSesiones', totalSesiones);
        localStorage.setItem('tiempoTotal', tiempoTotal);
        localStorage.setItem('ultimaImportacion', new Date().toISOString());

        alert(`✅ Historial fusionado con éxito\n\n📅 Desde: ${desde}\n📅 Hasta: ${hasta}\n📌 Total días: ${totalSesiones}\n⏳ Tiempo total: ${Math.floor(tiempoTotal / 60)} minutos`);

        mostrarEstadisticas();
      };
      lector.readAsText(archivo);
    });
  } else {
    console.error('El elemento con ID "importarCSV" no existe en el DOM.');
  }

  if (localStorage.getItem('modoOscuro') === '1') {
    document.body.classList.add('dark-mode');
  }
  mostrarEstadisticas();
});
