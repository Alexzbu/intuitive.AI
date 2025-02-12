Parse.Cloud.define('getCars', async (req) => {
   const query = new Parse.Query('Car')

   try {
      const carsList = await query.find()
      return carsList.map(car => ({
         objectId: car.id,
         brand: car.get('brand'),
         year: car.get('year'),
         price: car.get('price'),
         description: car.get('description'),
      }));
   } catch (error) {
      throw new Error(`Failed to fetch cars: ${error.message}`)
   }
})
Parse.Cloud.define('addCar', async (req) => {
   const { brand, year, price, description } = req.params

   const car = new Parse.Object('Car')
   car.set('brand', brand)
   car.set('year', year)
   car.set('price', price)
   car.set('description', description)
   try {
      const savedCar = await car.save()
      return savedCar.toJSON()
   } catch (error) {
      console.error('Failed to save Car:', error)
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, 'Failed to save Car')
   }
})
Parse.Cloud.define("upCar", async (req) => {
   const { id, brand, year, price, description } = req.params

   if (!id) {
      throw new Error("Car ID is required.")
   }
   const Car = Parse.Object.extend("Car")
   const query = new Parse.Query(Car)

   try {
      const car = await query.get(id)

      if (!car) {
         throw new Error("Car not found.")
      }
      car.set("brand", brand);
      car.set("year", year);
      car.set("price", price);
      car.set("description", description)

      const updatedCar = await car.save()
      return car.toJSON()
   } catch (error) {
      throw new Error(`Failed to update car: ${error.message}`)
   }
});

Parse.Cloud.define("delCar", async (req) => {
   const { id } = req.params

   if (!id) {
      throw new Error("Car ID is required.")
   }
   const Car = Parse.Object.extend("Car")
   const query = new Parse.Query(Car)

   try {
      const car = await query.get(id)
      await car.destroy()
      return car.toJSON()
   } catch (error) {
      throw new Error(`Failed to delete car: ${error.message}`)
   }
});


