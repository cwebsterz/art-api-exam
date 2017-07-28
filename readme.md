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

You'll need to copy the contents of the **.env-example** file and paste them into your own **.env** file and then set up the following environment variables with your own CouchDB or MySQL information:

For MySQL you'll want to be sure to set up the following variables:

- `MYSQL_HOST=127.0.0.1`
- `MYSQL_PORT=3306`
- `MYSQL_USER="root"`
- `MYSQL_PASSWORD=<your password here>`
- `MYSQL_DATABASE=art`

>Tip: you can just copy the variables and input your own password.

And, for CouchDB you'll want to set up some variables like this:

- `COUCHDB_URL`
- `COUCHDB_NAME`

Here is an example of a value for the `COUCHDB_URL` environment variable for an instance of CouchDB within Cloudant.

```
COUCHDB_URL=https://<DB KEY>:<SECRET>@<BASE URL TO CLOUDANT>.com/
```

## Loading Data & Indexes

Wether you're using CouchDB or MySQL, I've made it easy for you to load your data and indexes.

For MySQL, just copy and paste this into your command line:

```
$ cd sql-scripts
$ mysql < art.sql -u root -p -h 127.0.0.1 -P 3306
```
You'll be prompted to enter your password, go ahead and then you're all set.

For CouchDB All you have to do is to run these two commands:

```
$ npm run load
$ npm run loadIndex
```

## Starting Up

Similar to the previous steps, there are two different routes to go here depending on what database you are using. It's going to default to MySQL, but both are easy.

For MySQL, just run `npm start`

And for CouchDB, copy and paste this into your command line: `DAL=dal node app.js`

>The port will default to 4000, and you'll see that indicated in your terminal after you run either of the two commands.

## Endpoints

#### POST /art/paintings
Using a `POST` you can create a new painting item in the database. `name`,`movement`,`artist`,`yearCreated`, `museumName`, and `museumLocation` are the required inputs in this case. An example input could be:

```
{
    "name": "The Scream",
    "type": "painting",
    "movement": "expressionism",
    "artist": "Edvard Munch",
    "yearCreated": 1893,
    "museumName": "National Gallery",
    "museumLocation": "Oslo"
}
```

#### GET /art/paintings/:id
This will allow you to  look up a single item by it's `_id` property.

In CouchDB your request will look like this:

`GET` - `localhost:4000/art/paintings/painting_mona_lisa`

In MySQL, it'll just be a numbered id and will look like this:

`GET` - `localhost:4000/art/paintings/5`

Both will return the same information about The Mona Lisa, however the object format will differ slightly.

#### PUT /art/paintings/:id
This will allow you to update an item in the database. Paintings are sometimes moved to different museums, or we learn new things about when they were painted

>For example:  The Mona Lisa is believed to have been painted between 1503 and 1506; however, Leonardo may have continued working on it as late as 1517.

It's important to have accurate data and you may want to update some of the fields in order to reflect the most up-to-date information. In that case, you'll want to use this endpoint!

You'll need to be sure to include the `_id`, `_rev`, `name`, `movement`, `artist`, `yearCreated`, `museumName`, and `museumLocation` fields in your request.

Example MySQL request:

`PUT` - `localhost:4000/art/paintings/5`

Example body:
```
{
    "name": "The Mona Lisa",
    "artist": "Leonardo da Vinci",
    "movement": "renaissance",
    "museumName": "The Louvre",
    "museumLocation": "Paris",
    "yearCreated": "1503",
    "_id": 7,
    "type": "painting",
    "_rev": null
}
```

Example CouchDB request:

`PUT` - `localhost:4000/art/paintings/painting_mona_lisa`

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
Change the values as needed and then send your request.

#### DELETE /art/paintings/:id
This one is pretty straightforward. Simply put the `_id` you want to delete into your request and send it. Hasta la vista, baby!

Example MySQL request:
`DELETE` - `localhost:4000/art/paintings/5`

Example CouchDB request:
`DELETE` - `localhost:4000/art/paintings/painting_mona_lisa`

#### GET /art/paintings
Using a `GET` to `localhost:4000/art/paintings` will display all of the paintings in the database. This is the same wether you are using CouchDB or MySQL.

##### Paginating and Limiting Results

This API will default to showing you 5 paintings at a time, so if you want to move to the next page or change the limit you will need to modify your request.

Example request to modify the limit:

`GET` - `localhost:4000/art/paintings?limit=2`

That will limit you to two paintings and this is also going to be the same no matter which database you are using.

However, this part is going to differ slightly between the two database options within this API. If you want to go to the next page of two, your CouchDB request would look like this:

`GET` - `localhost:4000/art/paintings?limit=2&lastItem=painting_guernica`

Whereas your MySQL request would look like this:

`GET` - `localhost:4000/art/paintings?limit=2&lastItem=5`

By using the `lastItem` query parameter you will be telling the API what the last listed item on the page was and it will show you the next two (or whatever number you've set your `limit` to).

>Remember: This API defaults to 5 items per page.

##### Filtering

You can also filter the results by `name`, `movement`, `artist` and `yearCreated` fields. This is going to be a pretty similar to limiting and paginating and the requests are the same with both database options. Here's an example request and response:

Request: `GET` - `localhost:4000/art/paintings?filter=movement:impressionism`

Response:
```
[
    {
        "_id": 1 "painting_bal_du_moulin_de_la_galette",
        "_rev": "null",
        "name": "Bal du moulin de la Galette",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Pierre-Auguste Renoires",
        "yearCreated": 1876,
        "museumName": "Musée d’Orsay",
        "museumLocation": "Paris"
    },
    {
        "_id": "2",
        "_rev": "null",
        "name": "A Sunday Afternoon on the Island of La Grande Jatte",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Georges Seurat",
        "yearCreated": 1884,
        "museumName": "Art Institute of Chicago",
        "museumLocation": "Chicago"
    }
```

#### Grouping

There are two additional endpoints you can check out, however these two are going to be read-only; they're just another way to look at the data you're storing.

The first of which is: `localhost:4000/art/reports/countbymovement`

This will return an array with how many paintings you have in your database that are associated with a particular movement. Here's an example response:

```
{
    "reportName": "Painting count by movement",
    "reportData": [
        {
            "movementCount": 1,
            "movement": "baroque"
        },
        {
            "movementCount": 1,
            "movement": "expressionism"
        },
        {
            "movementCount": 1,
            "movement": "post-impressionism"
        },
        {
            "movementCount": 2,
            "movement": "renaissance"
        },
        {
            "movementCount": 1,
            "movement": "surrealism"
        }
    ]
}
```

The second endpoint is `localhost:4000/art/reports/countbycity`, and it returns a similar array, but instead is grouping by which city the paintings in your database are located in.

Here's an example response:

```
{
    "reportName": "Painting count by city",
    "reportData": [
        {
            "cityCount": 1,
            "museumLocation": "Madrid"
        },
        {
            "cityCount": 1,
            "museumLocation": "Milan"
        },
        {
            "cityCount": 1,
            "museumLocation": "New York"
        },
        {
            "cityCount": 1,
            "museumLocation": "Oslo"
        },
        {
            "cityCount": 1,
            "museumLocation": "Paris"
        },
        {
            "cityCount": 1,
            "museumLocation": "The Hague"
        }
    ]
}
```

### The End
