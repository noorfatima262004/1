// Import Schema
const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');

const updateInventoryQuantity = async (pizza, qty) => {
  const { bases = [], sauces = [], cheeses = [], veggies = [] } = pizza;

  const updateQuantity = async (item) => {
    if (item) {
      if (item.quantity >= qty) {
        item.quantity -= qty;
        const updateditem = await item.save();
        return updateditem;
      } else {
        throw new Error(
          `Not enough ${item.name} in inventory! Please update inventory!`
        );
      }
    } else {
      throw new Error('Item Not Found!');
    }
  };

  // Update base quantity
  for (const baseId of bases.filter(Boolean)) {
    const baseItem = await Base.findById(baseId);
    await updateQuantity(baseItem);
  }

  // Update sauce quantity
  for (const sauceId of sauces.filter(Boolean)) {
    const sauceItem = await Sauce.findById(sauceId);
    await updateQuantity(sauceItem);
  }

  // Update cheese quantity
  for (const cheeseId of cheeses.filter(Boolean)) {
    const cheeseItem = await Cheese.findById(cheeseId);
    await updateQuantity(cheeseItem);
  }

  // Update veggie quantity
  for (const veggieId of veggies.filter(Boolean)) {
    const veggieItem = await Veggie.findById(veggieId);
    await updateQuantity(veggieItem);
  }
};


module.exports = { updateInventoryQuantity };
