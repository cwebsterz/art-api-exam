# Paintings API

This API manages paintings, their names, the artists who painted them, the movements, years of creation and locations.

## Getting Started

First, you'll need to login to your Github account and fork this repo:

```
https://github.com/cwebsterz/art-api-exam
```

Then, clone the fork locally and install the dependencies. Follow these steps:

```
$ git clone <your-forked-url>
$ cd art-api-exam
$ npm install
```

## Setting up your Environment

You'll need to copy the contents of the **.env-example** file and paste them into your own **.env** file and then set up the following environment variables with your own CouchDB information:

- `COUCHDB_URL`
- `COUCHDB_NAME`

Here is an example of a value for the `COUCHDB_URL` environment variable for an instance of CouchDB within Cloudant.

```
COUCHDB_URL=https://<DB KEY>:<SECRET>@<BASE URL TO CLOUDANT>.com/
```

## Loading Data & Indexes

I made it easy for you to load your data and indexes. All you have to do is to run these two commands:

```
$ npm run load
$ npm run loadIndex
```

## Starting Up

After you've done all those steps, run the `npm start` command and start it up! It's going to default to port 4000. Enjoy!

## Endpoints

#### POST /paintings
Using a `POST` you can create a new painting item in the database. `name`,`movement`,`artist`,`yearCreated`, and `museum` are the required inputs in this case. An example input could be:

```
{
    "name": "The Scream",
    "type": "painting",
    "movement": "expressionism",
    "artist": "Edvard Munch",
    "yearCreated": 1893,
    "museum": {
        "name": "National Gallery",
        "location": "Oslo"
    }
}
```

#### GET /paintings/:id
This will allow you to  look up a single item by it's `_id` property. For example:

`GET` - `localhost:4000/paintings/painting_mona_lisa`

Returns:

```
{
    "_id": "painting_mona_lisa",
    "_rev": "5-a8dedd6f6b5b302334cb05eaa03cb6e8",
    "name": "The Mona Lisa",
    "type": "painting",
    "movement": "renaissance",
    "artist": "Leonardo da Vinci",
    "yearCreated": 1503,
    "museum": {
        "name": "The Louvre",
        "location": "Paris"
    }
}
```

#### PUT /paintings/:id
This will allow you to update an item in the database. Paintings are sometimes moved to or borrowed by different museums and you may want to update to the location in order to keep all of your data accurate and up-to-date.

You'll need to be sure to include the `_id`, `_rev`, `name`, `movement`, `artist`, `yearCreated`, and `museum` fields in your request.

Example request:

`PUT` - `localhost:4000/paintings/painting_mona_lisa`

Example body:

```
{
    "_id": "painting_mona_lisa",
    "_rev": "5-a8dedd6f6b5b302334cb05eaa03cb6e8",
    "name": "The Mona Lisa",
    "type": "painting",
    "movement": "renaissance",
    "artist": "Leonardo da Vinci",
    "yearCreated": 1503,
    "museum": {
        "name": "The Louvre",
        "location": "Paris"
    }
}
```
Change the values to whatever you want and then send your request.

#### DELETE /paintings/:id
This one is pretty straightforward. Simply put the `_id` you want to delete into your request and send it. Hasta la vista, baby!

Example request:
`DELETE` - `localhost:4000/paintings/painting_mona_lisa`



#### GET /paintings
Using a `GET` to `localhost:4000/paintings` will display all of the paintings in the database.

###### Paginating and Limiting Results

This API will default to showing you 5 paintings at a time, so if you want to move to the next page or change the limit you will need to modify your request.

Example request to modify the limit:

`GET` - `localhost:4000/paintings?limit=2`

That will limit you to two paintings.

If you want to go to the next page of two, your request would look like this:

`GET` - `localhost:4000/paintings?limit=2&lastItem=painting_guernica`

By using the `lastItem` query parameter you will be telling the API what the last listed item on the page was and it will show you the next two (or whatever number you've set your `limit` to).

>Remember: This API defaults to 5 items per page.

###### Filtering

You can also filter the results by `name`, `movement`, `artist` and `yearCreated` fields. This is going to be a pretty similar to limiting and paginating. Here's an example request and response:

Request: `GET` - `localhost:4000/paintings?filter=movement:impressionism`

Response:
```
[
    {
        "_id": "painting_bal_du_moulin_de_la_galette",
        "_rev": "1-681fd34c1b4819f308f7d92974503000",
        "name": "Bal du moulin de la Galette",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Pierre-Auguste Renoires",
        "yearCreated": 1876,
        "museum": {
            "name": "Musée d’Orsay",
            "location": "Paris"
        }
    },
    {
        "_id": "painting_sunday_afternoon_on_the_island_of_la_grande_jatte",
        "_rev": "1-19e6ee468fe4e3487b77b73e0c8f87fa",
        "name": "A Sunday Afternoon on the Island of La Grande Jatte",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Georges Seurat",
        "yearCreated": 1884,
        "museum": {
            "name": "Art Institute of Chicago",
            "location": "Chicago"
        }
    }
```
