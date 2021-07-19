//SEARCH FUNCTION FOR ARTIST NAMES
////////////
////////
////

let artistNameText = '';
function artistCatch() {
  artistNameText = document.getElementById('artistCall').value;
  alert(artistNameText);
}

document
  .getElementById('searchButton')
  .addEventListener('click', artistCatch());

console.log(`artistNameSearch`, artistNameText);

// artistNameSearch = 'Peter Fox';

const createUrl = (code, artistName) => {
  const person = artistName => {
    let artist = {
      q: artistName,
      key: 'ndqiGGFVIuiLYHmjQExU',
      secret: 'ADOGBtMyjsEJjQkyVcoNQTASKAuLfdCW',
      per_page: 100,
    };
    return artist;
  };

  let queryParams = '';

  queryParams =
    '?' +
    Object.keys(person(artistName))
      .map(key => `${key}=${person(artistName)[key]}`)
      .join('&');

  // console.log(queryParams);

  const url = code + queryParams;

  return url;
};
const testUrl = createUrl(artistNameText);
console.log(`testUrl`, testUrl);

// const example1 = createUrl('Eminem');
// console.log(example1);

////
////////
////////////

//FETCHING FUNCTION
////////////
////////
////

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

fetch(
  createUrl('https://api.discogs.com/database/search', artistNameText),
  requestOptions
)
  .then(response => response.json())
  .then(artists => {
    console.log(`artists`, artists);
    let cleanData = artists.results;
    console.log(`cleanData`, cleanData);
    createMainContentTable(cleanData);
    createAlbumContentTable(cleanData);
  })
  .catch(error => console.log('error', error));

////
////////
////////////

//Function Artist Table + Album Image Row
////////////
////////
////

let createMainContentTable = function (cleanData) {
  //Preparing Data for Artist, Genre, Releases
  const releaseArray = [];
  const genresArray = [];
  const artistArray = [];

  for (let i = 0; i < cleanData.length; i++) {
    ///ARTIST Array
    if (cleanData[i].type === 'artist') {
      if (!artistArray.includes(cleanData[i].title)) {
        artistArray.push(cleanData[i].title);
      }
      var cell = document.createElement('td');
      cell.innerHTML = cleanData[i].title;
      ///Release & Genre Array
    } else if (cleanData[i].type === 'release') {
      if (!releaseArray.includes(cleanData[i].master_id)) {
        releaseArray.push(cleanData[i].master_id);
        cleanData[i].genre.forEach(genres => {
          if (!genresArray.includes(genres)) {
            genresArray.push(genres);
          }
        });
      }
    }
  }

  let stringGenres = genresArray[0];
  genresArray.forEach(genres => {
    stringGenres = stringGenres + ', ' + genres;
  });

  //Main Arrays for Table
  let arrTH = ['th1', 'th2', 'th3', 'th4', 'th5', 'th6'];
  let cleanDataArtistTable = [
    artistArray[0],
    stringGenres,
    releaseArray.length,
  ];

  //Table Creation

  //Build Body & Row
  const tbody = document.getElementById('mainContentTableBody');
  const row = document.createElement('tr');

  //Build Cells + Insert Content
  for (let i = 0; i < arrTH.length; i++) {
    // First Three Headings
    if (i <= 2) {
      const cell = document.createElement('td');
      cell.innerHTML = cleanDataArtistTable[i];
      row.appendChild(cell);
    } else if (i === 3) {
      /// SoundCloud
      const cell = document.createElement('td');
      const scIconImg = document.createElement('img');
      // sIconImg.setAttribute("src", "../img/SoundCloud Logo Dark.png");
      function setAttributes(el, attrs) {
        for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      }
      setAttributes(scIconImg, {
        src: 'img/Soundcloud40.png',
        scrolling: 'no',
        style:
          'width: 45px; height: 45px; border-radius: 30px; table;cursor: pointer ',
      });
      //FUNCTION FOR ARTIST - INSERT A PARAMETER LATER
      scIconImg.onclick = function () {
        window.open(
          createUrl('https://soundcloud.com/search', artistNameSearch),
          '_blank'
        );
      };
      cell.appendChild(scIconImg);
      row.appendChild(cell);
    } else if (i === 4) {
      //Spotify IMG
      const cell = document.createElement('td');
      const spIconImg = document.createElement('img');
      setAttributes(spIconImg, {
        src: 'img/SpotifyIconBlack.png',
        scrolling: 'no',
        style: 'width: 45px; height: 45px; cursor: pointer',
      });
      spIconImg.onclick = function () {
        window.open(
          'https://open.spotify.com/search/' + artistNameSearch,
          '_blank'
        );
      };
      cell.appendChild(spIconImg);
      row.appendChild(cell);
    } else if (i === 5) {
      //Beatport IMG
      const cell = document.createElement('td');
      const bpIconImg = document.createElement('img');
      setAttributes(bpIconImg, {
        src: 'img/Beatport.png',
        scrolling: 'no',
        style: 'width: 45px; height:45px; cursor: pointer; border-radius: 30px',
      });
      bpIconImg.onclick = function () {
        window.open(
          createUrl('https://www.beatport.com/search', artistNameSearch),
          '_blank'
        );
      };
      cell.appendChild(bpIconImg);
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }

  //Album-Cover_Column
  const checkArray = [];
  for (let i = 0; i < cleanData.length; i++) {
    var check = cleanData[i].master_id;
    if (!checkArray.includes(check) && checkArray.length <= 4) {
      var imgCover = document.createElement('img');
      imgCover.src = cleanData[i].cover_image;
      imgCover.setAttribute('class', 'coverImg');
      var src = document.getElementById('leftCoverColumn');
      src.appendChild(imgCover);
      checkArray.push(check);
    }
  }
  console.log(checkArray);
};

////
////////
////////////

//Function Album Table
////////////
////////
////
let createAlbumContentTable = function (cleanData) {
  //BUILDING ONE SINGLE Array for Album Table
  const cleanDataAlbum = [];
  const cleanDataGenre = [];
  const cleanDataYear = [];
  const cleanDataFormat = [];
  const checkArrayId = [];
  for (let i = 0; i < cleanData.length; i++) {
    var checkId = cleanData[i].master_id;
    if (cleanData[i].type === 'release' && !checkArrayId.includes(checkId)) {
      cleanDataAlbum.push(cleanData[i].title);
      cleanDataGenre.push(cleanData[i].genre[0]);
      cleanDataYear.push(cleanData[i].year);
      cleanDataFormat.push(cleanData[i].format);
      checkArrayId.push(checkId);
    }
  }

  //Create a String out of the Format Arrays
  const cleanDataFormatString = [];
  const helpArray = [];
  for (let i = 0; i < cleanDataFormat.length; i++) {
    let stringFormat = '';
    for (let j = 0; j < cleanDataFormat[i].length; j++) {
      if (!helpArray.includes(cleanDataFormat[i][j])) {
        helpArray.push(cleanDataFormat[i][j]);
      }
    }
    for (let k = 0; k < helpArray.length; k++) {
      if (k === helpArray.length - 1) {
        stringFormat = stringFormat + helpArray[k];
      }
      stringFormat = stringFormat + helpArray[k] + ', ';
    }
    cleanDataFormatString.push(stringFormat);
  }

  // CLEAN DATA FOR TABLE
  const cleanDataAlbumTable = [
    cleanDataAlbum,
    cleanDataGenre,
    cleanDataYear,
    cleanDataFormatString,
  ];
  console.log(`cleanDataAlbumTable`, cleanDataAlbumTable);

  arrTH = ['th1', 'th2', 'th3', 'th4'];

  let i = 0;
  while (i < cleanDataAlbumTable[0].length) {
    var tbody = document.getElementById('albumContentTableBody');
    var row = document.createElement('tr');
    for (let j = 0; j < arrTH.length; j++) {
      var cell = document.createElement('td');
      cell.innerHTML = cleanDataAlbumTable[j][i];
      row.appendChild(cell);
    }
    tbody.appendChild(row);
    i++;
  }
};

// let albumTable = createAlbumContentTable();

let hideShow = function () {
  var x = document.getElementById('albumContentTable');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};
