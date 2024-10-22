
const verificarBtn = document.getElementById('verificarBtn');
const resultado = document.getElementById('resultado');

function verificar() {
    const edad = parseInt(document.getElementById('edad').value);


    if (!isNaN(edad)) {
        if (edad >= 18) {
            resultado.innerHTML = "Eres mayor de edad.";
        } else {
            resultado.innerHTML = "Eres menor de edad.";
        }
    } else {
        resultado.innerHTML = "Por favor, ingresa una edad valida.";
    }
};
