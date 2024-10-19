const pizzas = [
  {
    name: 'Margherita',
    description: 'Tomato sauce, mozzarella, and oregano',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: ['Mozzarella'],
    veggies: ['Oregano'],
    price: 6.95,
    size: 'small',
    createdBy: 'admin', // Added this field
    imageUrl: 'https://bing.com/th?id=OSK.7f2204d1a54011ae729188f9a52ac992',
  },
  {
    name: 'Marinara',
    description: 'Tomato sauce, garlic and basil',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: [],
    veggies: ['Garlic', 'Basil'],
    price: 6.95,
    size: 'small',
    createdBy: 'admin', // Added this field
    imageUrl: 'https://th.bing.com/th/id/OIP.KCM1cIhCG5VJlAJgH8OzqgHaFj?rs=1&pid=ImgDetMain',
  },
  {
    name: 'Quattro Formaggi',
    description: 'Tomato sauce, mozzarella, parmesan, gorgonzola cheese, artichokes and basil',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: ['Mozzarella', 'Parmesan', 'Gorgonzola'],
    veggies: ['Artichokes', 'Basil'],
    price: 8.95,
    size: 'small',
    createdBy: 'admin', // Added this field
    imageUrl: 'https://th.bing.com/th/id/OIP.RtuUawrVr4nKa6ZUfAfeVQHaEc?w=1000&h=600&rs=1&pid=ImgDetMain',
  },
  {
    name: 'Carbonara',
    description: 'Tomato sauce, mozzarella, parmesan, eggs, and bacon',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: ['Mozzarella', 'Parmesan'],
    veggies: ['Eggs', 'Bacon'],
    price: 8.95,
    size: 'small',
    createdBy: 'admin', // Added this field
    imageUrl: 'https://bing.com/th?id=OSK.15716608a00e486f2d576753336df585',
  },
];

module.exports = pizzas;
