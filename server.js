const express = require('express');
const { Router } = express;
const routerProductos = Router();
const routerCarrito = Router();
const app = express();
const PORT = process.env.PORT || 8080;
const isAdmin = true;

app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use(express.static('public'));

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));
routerCarrito.use(express.json());
routerCarrito.use(express.urlencoded({ extended: true }));

// API PRODUCTOS
// GET
routerProductos.get('/', (req, res) => {
	res.send(productos);
});

routerProductos.get('/:id', (req, res) => {
	let { id } = req.params;
	let response = null;

	const producto = productos.filter((p) => p.id === parseInt(id));

	!producto.length
		? (response = { error: 'producto no encontrado' })
		: (response = producto);
	res.json(response);
});

// POST
routerProductos.post('/', (req, res) => {
	let producto = req.body;
	let response = null;

	if (isAdmin) {
		producto.price = parseInt(producto.price);
		producto.id = parseInt(producto.id);
		let ids = [];

		const productoExistente = productos.filter((p) => p.name === producto.name);
		productos.forEach((p) => ids.push(p.id));

		if (!productoExistente.length) {
			let maxId = Math.max(...ids);
			producto['id'] = maxId + 1;
			productos.push(producto);
			response = producto;
		} else {
			response = { error: 'producto existente' };
		}
	} else {
		response = {
			error: `${req.originalUrl} método ${req.method} no autorizado`,
		};
	}

	res.json(response);
});

routerProductos.post('/:id', (req, res) => {
	let productoEditado = req.body;
	let response = null;
	if (isAdmin) {
		productoEditado.price = parseInt(productoEditado.price);
		productoEditado.id = parseInt(productoEditado.id);

		const productoOriginal = productos.filter(
			(p) => p.id === parseInt(productoEditado.id)
		);

		if (!productoOriginal.length) {
			response = { error: 'producto no encontrado' };
		} else {
			const index = productos.indexOf(productoOriginal[0]);
			if (productoEditado.hasOwnProperty('name')) {
				productos.splice(index, 1, productoEditado);
				response = productos[index];
			} else {
				productos.splice(index, 1);
				response = productos;
			}
		}
	} else {
		response = {
			error: `${req.originalUrl} método ${req.method} no autorizado`,
		};
	}
	res.send(response);
});

// PUT
routerProductos.put('/:id', (req, res) => {
	let { id } = req.params;
	let productoEditado = req.body;
	let response = null;

	if (isAdmin) {
		const productoOriginal = productos.filter((p) => p.id === parseInt(id));

		if (!productoOriginal.length) {
			response = { error: 'producto no encontrado' };
		} else {
			const index = productos.indexOf(productoOriginal[0]);
			productos.splice(index, 1, productoEditado);
			response = productos[index];
		}
	} else {
		response = {
			error: `${req.originalUrl} método ${req.method} no autorizado`,
		};
	}
	res.json(response);
});

// DELETE
routerProductos.delete('/:id', (req, res) => {
	let { id } = req.params;
	let response = null;

	if (isAdmin) {
		const producto = productos.filter((p) => p.id === parseInt(id));

		if (!producto.length) {
			response = { error: 'producto no encontrado' };
		} else {
			const index = productos.indexOf(producto[0]);
			productos.splice(index, 1);
			response = productos;
		}
	} else {
		response = {
			error: `${req.originalUrl} método ${req.method} no autorizado`,
		};
	}
	res.json(response);
});

// API CARRITO
// GET
routerCarrito.get('/:id/productos', (req, res) => {
	// muestra todos los productos del carrito
	let { id } = req.params;
	let response = null;

	const carrito = carritos.filter((p) => p.id === parseInt(id));

	if (!carrito.length) {
		response = { error: 'carrito no encontrado' };
	} else {
		response = carrito.productos;
	}
	res.send(response);
});

// POST
routerCarrito.post('/', (req, res) => {
	let ids = [];
	let carrito = { id: 1, timestamp: Date.now(), productos: [] };
	if (carritos.length) {
		carritos.forEach((carrito) => ids.push(carrito.id));
		let maxId = Math.max(...ids);
		carrito.id = maxId + 1;
	}
	carritos.push(carrito);
	res.json(carrito.id);
});

routerCarrito.post('/:id/productos', (req, res) => {
	let { id } = req.params;
	let newProducto = req.body;
	const carrito = carritos.filter((carrito) => carrito.id === parseInt(id));
	if (!carrito.length) {
		response = { error: 'carrito no encontrado' };
	} else {
		const producto = productos.filter(
			(prod) => prod.id === parseInt(newProducto.id)
		);
		if (producto[0].stock > 0) {
			carrito[0].productos.push(newProducto);
			const index = productos.indexOf(producto[0]);
			const productoStock = productos[index];
			productoStock.stock = productoStock.stock - 1;
			productos.splice(index, 1, productoStock);
			response = carrito[0];
		} else {
			response = { error: 'El producto seleccionado no tiene stock' };
		}
	}
	res.json(response);
});

// DELETE
routerCarrito.delete('/:id', (req, res) => {
	let { id } = req.params;
	let response = null;

	const carrito = carritos.filter((carrito) => carrito.id === parseInt(id));

	if (!carrito.length) {
		response = { error: 'carrito no encontrado' };
	} else {
		const index = carritos.indexOf(carrito[0]);
		carritos.splice(index, 1);
		response = carritos;
	}
	res.json(response);
});

routerCarrito.delete('/:id/productos/:id_prod', (req, res) => {
	let { id, id_prod } = req.params;
	let response = null;

	const carrito = carritos.filter((carrito) => carrito.id === parseInt(id));

	if (!carrito.length) {
		response = { error: 'carrito no encontrado' };
	} else {
		const producto = carrito[0].productos.filter(
			(prod) => prod.id === parseInt(id_prod)
		);
		if (!producto.length) {
			response = { error: 'Producto no encontrado' };
		} else {
			const index = carrito[0].productos.indexOf(producto[0]);
			carrito[0].productos.splice(index, 1);
			response = carrito;
		}
	}
	res.json(response);
});

// SERVER LISTEN
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on('error', (error) => console.log(`Error en servidor ${error}`));

let productos = [
	{
		id: 1,
		timestamp: Date.now(),
		name: 'Sandia',
		description: 'Descripcion del producto',
		code: 'ABC',
		thumbnail: 'https://cdn-icons-png.flaticon.com/512/415/415731.png',
		price: 123,
		stock: 2,
	},
	{
		id: 2,
		timestamp: Date.now(),
		name: 'Frutilla',
		description: 'Descripcion del producto',
		code: 'ABC',
		thumbnail: 'https://cdn-icons-png.flaticon.com/512/590/590685.png',
		price: 456,
		stock: 10,
	},
	{
		id: 3,
		timestamp: Date.now(),
		name: 'Manzana',
		description: 'Descripcion del producto',
		code: 'ABC',
		thumbnail: 'https://cdn-icons-png.flaticon.com/512/415/415733.png',
		price: 789,
		stock: 10,
	},
];

let carritos = [];
