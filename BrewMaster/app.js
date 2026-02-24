let timerInterval;
let seconds = 0;
let isRunning = false;
const ring = document.getElementById('progress-ring');
const circumference = 58 * 2 * Math.PI; // 364.4

function toggleTimer() {
    const btn = document.getElementById('btn-timer');
    if (!isRunning) {
        isRunning = true;
        btn.innerText = "Pausar";
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        stopTimer();
        btn.innerText = "Continuar";
    }
}

function updateTimer() {
    seconds++;
    const display = document.getElementById('timer-display');
    display.innerText = `${seconds.toString().padStart(2, '0')}s`;

    // Animación del anillo (basada en un máximo ideal de 40s)
    const offset = circumference - (seconds / 40) * circumference;
    ring.style.strokeDashoffset = Math.max(0, offset);

    // Feedback visual en el rango de oro (25-30s)
    if (seconds >= 25 && seconds <= 30) {
        display.classList.add('text-emerald-400');
        ring.classList.replace('text-[#d4a373]', 'text-emerald-400');
    } else {
        display.classList.remove('text-emerald-400');
        ring.classList.replace('text-emerald-400', 'text-[#d4a373]');
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById('timer-display').innerText = "00s";
    document.getElementById('btn-timer').innerText = "Iniciar";
    ring.style.strokeDashoffset = circumference;
}
function calcularExtraccion() {
    const cafe = parseFloat(document.getElementById('input-cafe').value);
    const agua = parseFloat(document.getElementById('input-agua').value);
    const resultDiv = document.getElementById('resultado');
    const displayRatio = document.getElementById('display-ratio');
    const displayMsg = document.getElementById('display-msg');

    if (!cafe || !agua || cafe <= 0) {
        alert("¡Che Nacho! Falta la dosis de café para el cálculo.");
        return;
    }

    const ratio = (agua / cafe).toFixed(1);
    displayRatio.innerText = `1:${ratio}`;
    
    if (ratio < 1.5) {
        displayMsg.innerText = "Ristretto - Corto y Fuerte";
    } else if (ratio >= 1.5 && ratio <= 2.5) {
        displayMsg.innerText = "Espresso - Punto Dulce";
    } else {
        displayMsg.innerText = "Lungo - Extracción Larga";
    }

    resultDiv.classList.add('visible');
}

// Array para almacenar las extracciones
let historial = JSON.parse(localStorage.getItem('brewHistory')) || [];

// Al cargar la página, mostramos lo que ya esté guardado
window.onload = () => {
    actualizarVistaHistorial();
};

function guardarBrew() {
    const cafe = document.getElementById('input-cafe').value;
    const agua = document.getElementById('input-agua').value;
    const ratio = (agua / cafe).toFixed(1);
    const tiempo = document.getElementById('timer-display').innerText;
    
    if(!cafe || !agua) return alert("Primero hacé un cálculo!");

    // Creamos el objeto de la extracción
    const nuevaExtraccion = {
        id: Date.now(),
        cafe: cafe,
        agua: agua,
        ratio: `1:${ratio}`,
        tiempo: tiempo,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Guardar en el array y en localStorage
    historial.unshift(nuevaExtraccion); // Lo pone al principio
    localStorage.setItem('brewHistory', JSON.stringify(historial));

    actualizarVistaHistorial();
}

function actualizarVistaHistorial() {
    const lista = document.getElementById('lista-brews');
    const container = document.getElementById('historial-container');
    
    if (historial.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    lista.innerHTML = '';

    historial.forEach(item => {
        lista.innerHTML += `
            <div class="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center animate-fade-in">
                <div>
                    <div class="text-[10px] text-[#d4a373] font-bold uppercase">${item.fecha}</div>
                    <div class="text-lg font-black italic text-[#fefae0]">${item.ratio}</div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-white/40">${item.cafe}g / ${item.agua}g</div>
                    <div class="text-xs font-mono text-emerald-400">${item.tiempo}</div>
                </div>
            </div>
        `;
    });
}

function borrarHistorial() {
    if(confirm("¿Borramos todo el historial?")) {
        historial = [];
        localStorage.removeItem('brewHistory');
        actualizarVistaHistorial();
    }
}