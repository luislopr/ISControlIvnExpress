const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Crear tablas
db.serialize(() => {
    db.run(`CREATE TABLE proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        rif TEXT NOT NULL,
        nombre TEXT NOT NULL,
        telefono TEXT,
        email TEXT NOT NULL,
        direccion TEXT,
        dias_credito INTEGER DEFAULT 0 NOT NULL,
        dias_promedio_entrega REAL DEFAULT 1
    )`);

    db.run(`CREATE TABLE catalogo_proveedor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_proveedor INTEGER NOT NULL,
        articulo_proveedor TEXT NOT NULL,
        codigo_barra TEXT NOT NULL,
        costo REAL DEFAULT 0.1 NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
    )`);

    db.run(`CREATE TABLE clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        numero_identidad INTEGER NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        telefono TEXT
    )`);

    db.run(`CREATE TABLE facturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha_factura TIMESTAMP NOT NULL,
        id_proveedor INTEGER NOT NULL,
        numero_factura INTEGER NOT NULL,
        numero_control INTEGER NOT NULL,
        subtotal REAL DEFAULT 0 NOT NULL,
        total_impuesto REAL DEFAULT 0 NOT NULL,
        total_descuento REAL DEFAULT 0 NOT NULL,
        total_neto REAL DEFAULT 0 NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
    )`);

    db.run(`CREATE TABLE inventario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        existencia INTEGER DEFAULT 0 NOT NULL,
        proveedor_id INTEGER NOT NULL,
        costo REAL NOT NULL,
        precio REAL NOT NULL,
        codigo_articulo TEXT NOT NULL,
        descripcion_articulo TEXT NOT NULL,
        codigo_barra TEXT NOT NULL,
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
    )`);

    db.run(`CREATE TABLE roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rol TEXT NOT NULL,
        descripcion TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE usuarios (
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        nombre_completo TEXT NOT NULL,
        password TEXT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        role_id INTEGER DEFAULT 1 NOT NULL,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estado INTEGER DEFAULT 1 NOT NULL
        )`);
//        FOREIGN KEY (role_id) REFERENCES roles(id)

    db.run(`CREATE TABLE ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_factura INTEGER NOT NULL,
        fecha_factura TIMESTAMP NOT NULL,
        porcentaje_iva REAL NOT NULL,
        monto_base REAL NOT NULL,
        monto_iva REAL DEFAULT 0 NOT NULL,
        numero_control INTEGER NOT NULL,
        cliente_id INTEGER NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )`);
});


// Registrar usuario
app.post('/register', (req, res) => {
    const { username, password, nombre_completo, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`INSERT INTO usuarios 
        (username, password, nombre_completo, email, role_id, estado) 
        VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(username, hashedPassword, nombre_completo, email, 1, 1, (err) => {
        if (err) {
            // Manejo de errores, como usuario ya existente
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'El usuario o el email ya existen' });
            }
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }
        res.status(200).json({ message: 'Usuario registrado' });
    });
    stmt.finalize();
});

// Login usuario
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM usuarios WHERE username = ?`, [username], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        if (bcrypt.compareSync(password, row.password)) {
            return res.status(200).json({ message: 'Login exitoso' });
        } else {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
    });
});


// Ruta para insertar un proveedor
app.post('/api/proveedores', (req, res) => {
    const { rif, nombre, telefono, email, direccion, dias_credito, dias_promedio_entrega } = req.body;
    db.run(`INSERT INTO proveedores (rif, nombre, telefono, email, direccion, dias_credito, dias_promedio_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [rif, nombre, telefono, email, direccion, dias_credito, dias_promedio_entrega], 
        function(err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.status(201).send({ id: this.lastID });
        });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
