const estudiantes = [
    { nombre: 'Justyn', apellido: 'Sánchez', nota: 99 },
    { nombre: 'María', apellido: 'Gomez', nota: 70 },
    { nombre: 'Rachel', apellido: 'Rodríguez', nota: 78 },
    { nombre: 'Ana', apellido: 'López', nota: 92 },
    { nombre: 'Carlos', apellido: 'Martínez', nota: 68 }
];

const listaEstudiantesDiv = document.getElementById('lista-estudiantes');

let sumaNotas = 0;

for (let i = 0; i < estudiantes.length; i++) {
    const estudiante = estudiantes[i];
    
    const estudianteParrafo = document.createElement('p');
    estudianteParrafo.textContent = `${i + 1}. ${estudiante.nombre} ${estudiante.apellido} - Nota: ${estudiante.nota}`;
    
    listaEstudiantesDiv.appendChild(estudianteParrafo);
    
    sumaNotas += estudiante.nota;
}

const promedio = sumaNotas / estudiantes.length;

const promedioParrafo = document.createElement('p');
promedioParrafo.textContent = `Promedio de las notas: ${promedio.toFixed(2)}`;

listaEstudiantesDiv.appendChild(promedioParrafo);
