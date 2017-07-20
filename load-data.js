require('dotenv').config()
const PouchDB = require('pouchdb')
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .bulkDocs([
    {
      _id: 'painting_starry_night',
      name: 'The Starry Night',
      type: 'painting',
      movement: 'post-impressionism',
      artist: 'Vincent van Gogh',
      yearCreated: 1889,
      museum: { name: 'Museum of Modern Art', location: 'New York' }
    },
    {
      _id: 'painting_water_lilies_nympheas',
      name: 'Water Lilies Nympheas',
      type: 'painting',
      movement: 'impressionism',
      artist: 'Claude Monet',
      yearCreated: 1907,
      museum: { name: 'Art Gallery of Ontario', location: 'Toronto' }
    },
    {
      _id: 'painting_last_supper',
      name: 'The Last Supper',
      type: 'painting',
      movement: 'Renaissance',
      artist: 'Leonardo da Vinci',
      yearCreated: 1495,
      museum: { name: 'Santa Maria delle Grazie', location: 'Milan' }
    },
    {
      _id: 'painting_sunday_afternoon_on_the_island_of_la_grande_jatte',
      name: 'A Sunday Afternoon on the Island of La Grande Jatte',
      type: 'painting',
      movement: 'impressionism',
      artist: 'Georges Seurat',
      yearCreated: 1884,
      museum: { name: 'Art Institute of Chicago', location: 'Chicago' }
    },
    {
      _id: 'painting_guernica',
      name: 'Guernica',
      type: 'painting',
      movement: 'surrealism',
      artist: 'Pablo Picasso',
      yearCreated: 1937,
      museum: {
        name: 'Museo Nacional Centro de Arte Reina Sofía',
        location: 'Madrid'
      }
    },
    {
      _id: 'painting_bal_du_moulin_de_la_galette',
      name: 'Bal du moulin de la Galette',
      type: 'painting',
      movement: 'impressionism',
      artist: 'Pierre-Auguste Renoires',
      yearCreated: 1876,
      museum: { name: 'Musée d’Orsay', location: 'Paris' }
    }
  ])
  .then(res => {
    console.log('inspect the docs: ')
    console.log(JSON.stringify(res, null, 2))
  })
  .catch(err => {
    console.log(err)
  })
