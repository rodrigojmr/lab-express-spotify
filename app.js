require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
// const { request } = require('http');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );
// Our routes go here:

app.get('/artist-search', (req, res) => {
  const term = req.query.term;
  spotifyApi
    .searchArtists(term)
    .then(data => {
      res.render('artist-search-results', {
        artists: data.body.artists.items
      });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items;
      res.render('albums', { albums: albums });
    })
    .catch(err =>
      console.log('The error while searching albums occurred: ', err)
    );
});

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  console.log('albumId: ', albumId);
  spotifyApi
    .getAlbumTracks(albumId, { limit: 10, offset: 0 })
    .then(data => {
      const tracks = data.body.items;
      res.render('tracks', { tracks: tracks });
    })
    .catch(err =>
      console.log('The error while searching albums occurred: ', err)
    );
});

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
