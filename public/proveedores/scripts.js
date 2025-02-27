function hideModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modal.style.display = 'none';

    modalContent.classList.remove('animate');
    setTimeout(() => {
        modal.style.display = 'none'; 
    }, 300); 
}

function showModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');
    const modalContent = document.getElementById('modal-content');
   
        modalTitle.innerText = 'Agregar Proveedor';
        modalForm.action = '/api/proveedores'; // Cambia la acción según sea necesario

    modal.style.display = 'flex';
    setTimeout(() => {
        modalContent.classList.add('animate');
    }, 5);
}


document.getElementById('modal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/proveedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la inserción');
        }
        return response.json();
    })
    .then(data => {
        alert('Proveedor insertado ');
        this.reset(); // Reinicia el formulario
        hideModal(); // Oculta el modal después de insertar
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al insertar el proveedor');
    });
});

function listProviders() {
    fetch('/api/proveedores') // Asegúrate de que esta URL sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los proveedores');
            }
            return response.json();
        })
        .then(data => {
            const listaProveedores = document.getElementById('lista-proveedores');
            listaProveedores.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

            data.forEach(proveedor => {
                const li = document.createElement('li');
                li.textContent = `RIF: ${proveedor.rif}, Nombre: ${proveedor.nombre}, Teléfono: ${proveedor.telefono}, Email: ${proveedor.email}`; // Ajusta según los campos de tu proveedor
                listaProveedores.appendChild(li);
            });

            // Mostrar el contenedor de la lista de proveedores
            document.getElementById('lista-proveedores-container').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al listar los proveedores');
        });
}