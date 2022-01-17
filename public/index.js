// import axios from 'axios';
// const axios = require('axios');

const renderProducts = () => {
	// axios.get('/api/productos').then((res) => console.log('res', res));
	let html = productos
		.map((prod) => {
			return `
      <form action="/api/productos" method="POST">
        <div class="card border mr-2" style="width: 20rem">
					<img class="card-img-top" src="${prod.thumbnail}" alt="fruta" />
					<div class="card-body">
						<h5 class="card-title">${prod.name}</h5>
						<p class="card-text">${prod.description}</p>
            <div class="d-flex">
              <button class="btn btn-primary">Agregar</button>
            </div>
					</div>
				</div>
      </form>
			`;
		})
		.join(' ');
	document.getElementById('productsContainer').innerHTML = html;
};

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
		stock: 5,
	},
];

let carritos = [];

(function () {
	console.log('conectado');
	renderProducts();
})();
