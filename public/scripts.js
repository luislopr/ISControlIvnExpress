function showModal(type) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');

    const registerFields = document.getElementById('register-fields');

            if (type === 'register') {
                modalTitle.innerText = 'Registro';
                modalForm.action = '/register';
                registerFields.style.display = 'block'; // Mostrar campos de registro
            } else {
                modalTitle.innerText = 'Login';
                modalForm.action = '/login';
                registerFields.style.display = 'none'; // Ocultar campos de registro
            }


    modalTitle.innerText = type === 'register' ? 'Register' : 'Login';
    modalForm.action = type === 'register' ? '/register' : '/login';
    modal.style.display = 'flex';
    modalContent.classList.add('animate');
}

function hideModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('animate');
    modal.style.display = 'none';
}

document.getElementById('modal-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const nombre_completo = document.getElementById('nombre_completo').value;
    const email = document.getElementById('email').value;
    //const estado = 
    //const fecha_creacion = document.getElementById('email').value;
    const action = event.target.action;

    fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, nombre_completo, email })
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          if (data.message === 'Login exitoso') {
              window.location.href = 'dashboard.html';  // Redirigir al dashboard si el login es exitoso
          } else {
              hideModal();
          }
      }).catch(error => {
          console.error('Error:', error);
          alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
      });
});

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    if (!event.target.matches('.btn')) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
});

function openCalorieForm() {
    window.open('calorie_form.html', 'CalorieForm', 'width=400,height=400');
}


document.getElementById('proveedorForm').addEventListener('submit', function(event) {
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
        alert('Proveedor insertado con ID: ' + data.id);
        this.reset(); // Reinicia el formulario
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al insertar el proveedor');
    });
});