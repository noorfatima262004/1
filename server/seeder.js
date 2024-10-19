const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const connectDb = require('./config/db');

const Admin = require('./schemas/adminUserSchema');
const User = require('./schemas/userSchema');
const Pizza = require('./schemas/pizzaSchema');
const Order = require('./schemas/orderSchema');
const { Base, Sauce, Cheese, Veggie } = require('./schemas/inventorySchema');

const { users, admin } = require('./data/users');
const pizzas = require('./data/pizzas');
const { base, sauce, cheese, veggie } = require('./data/inventory');

dotenv.config();

// Connect to MongoDB
connectDb();

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Admin.deleteMany();
    await Base.deleteMany();
    await Sauce.deleteMany();
    await Cheese.deleteMany();
    await Veggie.deleteMany();

    // Insert data
    const createdUsers = await User.insertMany(users);
    const createdAdmin = await Admin.create(admin);
    const createdBase = await Base.insertMany(base);
    const createdSauce = await Sauce.insertMany(sauce);
    const createdCheese = await Cheese.insertMany(cheese);
    const createdVeggie = await Veggie.insertMany(veggie);

    // Create maps for inventory items
    const baseMap = createdBase.reduce((map, base) => {
      map[base.item] = base._id;
      return map;
    }, {});

    const sauceMap = createdSauce.reduce((map, sauce) => {
      map[sauce.item] = sauce._id;
      return map;
    }, {});

    const cheeseMap = createdCheese.reduce((map, cheese) => {
      map[cheese.item] = cheese._id;
      return map;
    }, {});

    const veggieMap = createdVeggie.reduce((map, veggie) => {
      map[veggie.item] = veggie._id;
      return map;
    }, {});

    // Update pizza data with ObjectId references
    const pizzasWithReferences = await Pizza.insertMany(pizzas.map(pizza => ({
      ...pizza,
      base: baseMap[pizza.base],
      sauces: pizza.sauces.map(sauce => sauceMap[sauce]),
      cheeses: pizza.cheeses.map(cheese => cheeseMap[cheese]),
      veggies: pizza.veggies.map(veggie => veggieMap[veggie])
    })));

    // Create maps for pizzas
    const pizzaMap = pizzasWithReferences.reduce((map, pizza) => {
      map[pizza.name] = pizza._id;
      return map;
    }, {});

    // Create sample orders
    const sampleOrders = [
      {
        user: createdUsers[0]._id, // Assigning the first user
        orderItems: [
          {
            pizza: pizzaMap['Margherita'], // Margherita
            qty: 1,
            price: pizzasWithReferences.find(pizza => pizza.name === 'Margherita').price
          },
          {
            pizza: pizzaMap['Marinara'], // Marinara
            qty: 2,
            price: pizzasWithReferences.find(pizza => pizza.name === 'Marinara').price
          }
        ],
        deliveryAddress: {
          phoneNumber: '123-456-7890',
          address: '123 Main St',
          city: 'City',
          postalCode: '12345',
          country: 'Country'
        },
        salesTax: 0.5,
        deliveryCharges: 2.0,
        totalPrice: pizzasWithReferences.find(pizza => pizza.name === 'Margherita').price + 
                    2 * pizzasWithReferences.find(pizza => pizza.name === 'Marinara').price + 
                    0.5 + 2.0,
        payment: {
          method: 'stripe',
          stripePaymentIntentId: 'pi_1234567890',
          status: 'succeeded'
        },
        status: 'Received',
      },
      {
        user: createdUsers[1]._id, // Assigning the second user
        orderItems: [
          {
            pizza: pizzaMap['Quattro Formaggi'], // Quattro Formaggi
            qty: 1,
            price: pizzasWithReferences.find(pizza => pizza.name === 'Quattro Formaggi').price
          }
        ],
        deliveryAddress: {
          phoneNumber: '987-654-3210',
          address: '456 Elm St',
          city: 'Another City',
          postalCode: '54321',
          country: 'Another Country'
        },
        salesTax: 0.8,
        deliveryCharges: 1.5,
        totalPrice: pizzasWithReferences.find(pizza => pizza.name === 'Quattro Formaggi').price + 
                    0.8 + 1.5,
        payment: {
          method: 'razorpay',
          razorpayOrderId: 'order_1234567890',
          status: 'paid'
        },
        status: 'In the Kitchen',
      }
    ];

    // Insert sample orders
    await Order.insertMany(sampleOrders);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany();
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Base.deleteMany();
    await Sauce.deleteMany();
    await Cheese.deleteMany();
    await Veggie.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments for data import or deletion
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
