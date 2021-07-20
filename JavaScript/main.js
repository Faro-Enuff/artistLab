// URL Use

let params = new URL(document.location).searchParams;
let artist = params.get('artist');

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
const testUrl = createUrl(artist);
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
  createUrl('https://api.discogs.com/database/search', artist),
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
          createUrl('https://soundcloud.com/search', artist),
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
        window.open('https://open.spotify.com/search/' + artist, '_blank');
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
          createUrl('https://www.beatport.com/search', artist),
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

  const tableBody_element = document.getElementById('albumContentTableBody');
  const pagination_element = document.getElementById('pagination');

  let current_page = 1;
  let rows = 5;

  function displayList(data, wrapper, rows_per_page, page) {
    wrapper.innerHTML = '';
    page--;

    let start = rows_per_page * page;
    let end = start + rows_per_page;

    for (let i = start; i < end + 1; i++) {
      // let cell = paginatedItems[i];

      let row_element = document.createElement('tr');
      for (let j = 0; j < arrTH.length; j++) {
        let cell_element = document.createElement('td');
        cell_element.innerHTML = data[j][i];
        row_element.appendChild(cell_element);
      }
      wrapper.appendChild(row_element);
    }
  }

  function setUpPagination(data, wrapper, rows_per_page) {
    wrapper.innerHTML = '';

    let page_count = Math.ceil(data[0].length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
      let btn = paginationButton(i, data);
      wrapper.appendChild(btn);
    }
  }

  function paginationButton(page, data) {
    let button = document.createElement('button');
    button.innerHTML = page;

    if (current_page === page) {
      button.classList.add('active');
    }
    button.addEventListener('click', function () {
      current_page = page;
      displayList(cleanDataAlbumTable, tableBody_element, rows, current_page);

      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');

      button.classList.add('active');
    });
    return button;
  }
  displayList(cleanDataAlbumTable, tableBody_element, rows, current_page);
  setUpPagination(cleanDataAlbumTable, pagination_element, rows);
};

// let albumTable = createAlbumContentTable();

let hideShow = function () {
  let x = document.getElementById('albumContentTable');
  let y = document.querySelector('.pagenumbers');
  if (x.style.display === 'block' && y.style.display === 'flex') {
    x.style.display = 'none';
    y.style.display = 'none';
  } else {
    x.style.display = 'block';
    y.style.display = 'flex';
  }
};
