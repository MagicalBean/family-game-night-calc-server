app = require('express')();
cors = require('cors');
const PORT = 3001;

require('dotenv').config();

const axios = require('axios');
const JsonBinIoApi = require('jsonbin-io-api');
const api = new JsonBinIoApi(process.env.SECRET_KEY);

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

let credentials, token;

app.use(cors());

const GAMES = [];

axios
  .get(
    'https://api.kvstore.io/collections/family-game-night-calc/items/games',
    {
      headers: {
        kvstoreio_api_key: process.env.KVSTOREIO_KEY,
      },
    }
  )
  .then((res) => {
    res.data.value.split(',').forEach((item) => {
      GAMES.push(item);
    });
  })
  .catch((err) => console.log(err));

api
  .readBin({
    id: process.env.BIN_ID,
    version: 'latest',
  })
  .then((res) => {
    credentials = res;
  })
  .catch((err) => console.log(err));

fs.readFile(TOKEN_PATH, (err, _token) => {
  if (err) return getAccessToken(oAuth2Client, callback);
  token = JSON.parse(_token);
});

app.get('/events', (req, res) => {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(token);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  calendar.events.list(
    {
      calendarId: process.env.CALENDAR_ID,
      timeMax: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    },
    (err, response) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = response.data.items;
      if (events.length) {
        let result = {
          events: [],
        };

        let eventsToFilter = [];

        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          //   console.log(`${start} - ${event.summary}`);
          //   result.events.push(`${start} - ${event.summary}`);
          eventsToFilter.push({
            date: `${start}T07:00:00.000Z`,
            name: event.summary,
          });
        });

        let filteredEvents = filterEvents(eventsToFilter);
        let sortedEvents = filteredEvents.sort((a, b) =>
          a.date < b.date ? 1 : a.date > b.date ? -1 : 0
        );
        result.events = sortedEvents;

        res.send(result);
      } else {
        console.log('No upcoming events found.');
      }
    }
  );
});

function filterEvents(events) {
  let result = [];

  GAMES.forEach((game) => {
    let filtered = events.filter((event) => {
      return event.name === game;
    });

    let newDate;
    if (filtered.length > 1) {
      newDate = new Date(
        Math.max.apply(
          null,
          filtered.map((e) => {
            return new Date(e.date);
          })
        )
      );
    }

    if (newDate) {
      result.push(
        ...filtered.filter((event) => {
          return event.date === newDate.toISOString();
        })
      );
    } else {
      result.push(...filtered);
    }
  });

  return result;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

app.get('/google55deb6c4039203bb.html', (req, res) => {
  res.sendFile(__dirname + '/google55deb6c4039203bb.html');
});

app.listen(process.env.PORT || PORT, () => {
  console.log('Listening on port ' + process.env.PORT || PORT);
});
