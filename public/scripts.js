function showModal(type) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');

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
    const action = event.target.action;

    fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
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
