const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => console.log("Succesful connection to MongoDB"))
  .catch(error => console.log('Cannot connect to DATABASE'))


const sample = (array) => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 300; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000)+ 1
        const price = Math.floor(Math.random() * 20)+ 10
        const camp = new Campground({
            author: '65efe75096027dde8c19c847',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia illum, sint quasi ducimus a laboriosam laudantium ea iure non ad doloremque molestiae consequatur deleniti porro quo corporis vitae amet recusandae.",
            geometry: {
              type: "Point",
              coordinates: [cities[random1000].longitude,cities[random1000].latitude]
            },
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dvuif2x20/image/upload/v1710995329/YelpCamp/ktwg3x7puxiczbn4vbtv.jpg',
                  filename: 'YelpCamp/ktwg3x7puxiczbn4vbtv',
                }
              ]
            })
        await camp.save()    
    }
}
seedDB().then(() => mongoose.connection.close())