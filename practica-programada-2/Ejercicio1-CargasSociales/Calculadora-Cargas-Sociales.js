function calcularDeducciones() {
    const salarioBruto = parseFloat(document.getElementById("salario").value);

    if (isNaN(salarioBruto) || salarioBruto <= 0) {
        alert("Por favor, ingrese un salario válido.");
        return;
    }

    const deduccionesCCSS = 0.0917;
    const porcentajeAsociacionSolidarista = 0.05
    const asociacionSolidarista = salarioBruto * porcentajeAsociacionSolidarista;
    const cargasSociales = salarioBruto * deduccionesCCSS;

    let impuestoRenta = 0;

    if (salarioBruto <= 863000) {
        impuestoRenta = 0;
    } else if (salarioBruto <= 1267000) {
        impuestoRenta = (salarioBruto - 863000) * 0.10;
    } else if (salarioBruto <= 2223000) {
        impuestoRenta = (salarioBruto - 1267000) * 0.15;
    } else if (salarioBruto <= 4445000) {
        impuestoRenta = (salarioBruto - 2223000) * 0.20;
    } else {
        impuestoRenta = (salarioBruto - 4445000) * 0.25;
    }

 
    const salarioNeto = salarioBruto - cargasSociales - impuestoRenta - asociacionSolidarista;

    document.getElementById("seguro-social").textContent = `Seguro Social: ₡${cargasSociales.toFixed(2)}`;
    document.getElementById("asociacionSolidarista").textContent = `Asociación Solidarista: ₡${asociacionSolidarista.toFixed(2)}`;
    document.getElementById("impuesto-renta").textContent = `Impuesto sobre la Renta: ₡${impuestoRenta.toFixed(2)}`;
    document.getElementById("salario-neto").textContent = `Salario Neto: ₡${salarioNeto.toFixed(2)}`;
}
