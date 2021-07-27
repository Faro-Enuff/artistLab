//FETCHING FUNCTIONS
////////////
////////
////

//First Fetch Function - ID
const getArtistIDAsync = async function (help) {
  const response = await fetch(
    `https://api.discogs.com/database/search?q=${help}&type=artist&key=ndqiGGFVIuiLYHmjQExU&secret=ADOGBtMyjsEJjQkyVcoNQTASKAuLfdCW&per_page=100&page=1`
  );
  // console.log(`response`, response);
  const artistID = await response.json();
  // console.log(artistID);
  return artistID.results;
};
//Second Fetch Function - Artist
const getArtistDataAsync = async function (help) {
  const response = await fetch(`${'https://api.discogs.com/artists/' + help}`);
  // console.log(`response`, response);
  const artistData = await response.json();
  // console.log(artistData);
  return artistData;
};
//Third Fetch Function - Album Covers
const getImageDataAsync = async function (help) {
  const response = await fetch(
    `https://api.discogs.com/database/search?q=${help}&type=releases&key=ndqiGGFVIuiLYHmjQExU&secret=ADOGBtMyjsEJjQkyVcoNQTASKAuLfdCW&per_page=100&page=1`
  );
  // console.log(`response`, response);
  const imageData = await response.json();
  // console.log(imageData);
  return imageData.results;
};

//Forth Fetch Function - Releases
const getAlbumDataAsync = async function (help) {
  const response = await fetch(
    `https://api.discogs.com/artists/${help}/releases?sort=year&per_page=100&sort_order=desc`
  );
  // console.log(`response`, response);
  const albumData = await response.json();
  // console.log(albumData.releases.sort((a, b) => b.year - a.year));
  return albumData.releases.sort((a, b) => b.year - a.year);
};

async function controller() {
  //Url
  let params = new URL(document.location).searchParams;
  let artist = params.get('artist');

  //Data ID Fetch
  const artistIDTable = await getArtistIDAsync(artist);
  // console.log('artistDataTable :>> ', artistIDTable);
  //Artist ID
  const artistID = artistId(artistIDTable);
  // console.log(`artistIDTable`, artistIDTable);
  //Data Artist Fetch
  const getArtistObject = await getArtistDataAsync(artistID);
  // console.log(`getArtistDataAsync`, getArtistObject);
  //Data Image Fetch
  const getImageList = await getImageDataAsync(artist);
  // console.log(`getImageList`, getImageList);
  //Data Album Fetch
  const getAlbumList = await getAlbumDataAsync(artistID);
  console.log(`getAlbumList`, getAlbumList);

  //Artist Image
  artistMainImage(artistIDTable);
  //Artist Table
  createMainContentTable(getArtistObject, artist);
  //Image Row
  createImageRow(getImageList);
  //Album Table
  createReleaseContentTable(getAlbumList);
  //SearchBar
  filterBySearchBar(getAlbumList);
  //DropDown
  setDropDown(getAlbumList);
  //Event Listener
  setEventListeners(getAlbumList);
}
controller();

////
////////
////////////

//Functions to Create
////////////
////////
////

//Artist ID Function
const artistId = data => {
  return data[0].id;
};

//Artist Image
const artistMainImage = artist => {
  const imageCard = document.getElementById('imageCard');
  const artistImage = document.createElement('img');
  artistImage.src = artist[0].cover_image;
  artistImage.setAttribute('class', 'artist-image');
  imageCard.appendChild(artistImage);
};

//Function Artist Table + Album Image Row
function createMainContentTable(cleanDataArtist, artist) {
  //Table Creation

  //Build Body & Row
  const heading = [
    'Artist',
    'Name',
    'Profile',
    'SoundCloud',
    'Spotify',
    'Beatport',
  ];
  const thead = document.getElementById('mainContentTableHead');
  const th_row = document.createElement('tr');
  heading.forEach(head => {
    let tableHeading = document.createElement('th');
    tableHeading.innerHTML = head;
    th_row.appendChild(tableHeading);
  });
  thead.appendChild(th_row);

  const tbody = document.getElementById('mainContentTableBody');
  const row = document.createElement('tr');

  //Build Cells + Insert Content
  for (let i = 0; i < heading.length; i++) {
    // First Three Headings
    let cell = document.createElement('td');
    if (i === 0) {
      cell.innerHTML = cleanDataArtist.name;
      row.appendChild(cell);
    } else if (i === 1) {
      cell.innerHTML = cleanDataArtist.realname;
      row.appendChild(cell);
    } else if (i === 3) {
      /// SoundCloud
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
          `${'https://soundcloud.com/search' + '?q=' + artist}`,
          '_blank'
        );
      };
      cell.appendChild(scIconImg);
      row.appendChild(cell);
    } else if (i === 4) {
      //Spotify IMG
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
      const bpIconImg = document.createElement('img');
      setAttributes(bpIconImg, {
        src: 'img/Beatport.png',
        scrolling: 'no',
        style: 'width: 45px; height:45px; cursor: pointer; border-radius: 30px',
      });
      bpIconImg.onclick = function () {
        window.open(
          `${'https://www.beatport.com/search' + '?q=' + artist}`,
          '_blank'
        );
      };
      cell.appendChild(bpIconImg);
      row.appendChild(cell);
    } else if (i === 2) {
      cell.innerHTML = cleanDataArtist.profile;
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
}

////
////////
////////////

const createImageRow = dataImage => {
  const imageReleases = dataImage.filter(data => data.type === 'release');
  console.log(`imageReleases`, imageReleases);
  const sortedImageReleases = imageReleases.sort((a, b) => b.year - a.year);
  console.log(`sortedImageReleases`, sortedImageReleases);
  const cleanedImageReleases = [
    ...sortedImageReleases
      .reduce((map, obj) => map.set(obj.master_id, obj), new Map())
      .values(),
  ];

  console.log(`cleanedImageReleases`, cleanedImageReleases);

  cleanedImageReleases.forEach((images, i) => {
    if (i < 5) {
      let imgCover = document.createElement('img');
      imgCover.src = images.cover_image;
      let src = document.getElementById('albumCoverColumn');
      src.appendChild(imgCover);
    }
  });
};

function createReleaseContentTable(dataAlbum) {
  //Table
  const thead = document.getElementById('albumContentTableHead');
  const tableBody_element = document.getElementById('albumContentTableBody');
  thead.innerHTML = '';
  tableBody_element.innerHTML = '';
  const heading = ['Artist', 'Label', 'Title', 'Year', 'Format'];
  const th_row = document.createElement('tr');
  heading.forEach(head => {
    let tableHeading = document.createElement('th');
    tableHeading.innerHTML = head;
    th_row.appendChild(tableHeading);
  });
  thead.appendChild(th_row);

  const pagination_element = document.getElementById('pagination');

  let current_page = 1;
  let rows = 10;

  const displayList = (data, wrapper, rows_per_page, page, title) => {
    wrapper.innerHTML = '';
    page--;

    let start = rows_per_page * page;
    let end = start + rows_per_page;

    let maxLength = data.length;
    if (end > maxLength) {
      end = maxLength;
    }

    data.forEach((dataElements, i) => {
      if (i >= start && i < end) {
        // console.log(`dataElements`, dataElements);
        let row_element = document.createElement('tr');
        title.forEach((titles, j) => {
          // console.log(`titles`, dataElements[titles]);
          let cell_element = document.createElement('td');
          if (!dataElements[titles.toLowerCase()]) {
            cell_element.innerHTML = `n/a`;
          } else {
            cell_element.innerHTML = dataElements[titles.toLowerCase()];
          }
          row_element.appendChild(cell_element);
        });
        wrapper.appendChild(row_element);
      }
    });
  };

  const setUpPagination = (data, wrapper, rows_per_page) => {
    wrapper.innerHTML = '';

    let page_count = Math.ceil(data.length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
      let btn = paginationButton(i, data);
      wrapper.appendChild(btn);
    }
  };

  const paginationButton = (page, data) => {
    let button = document.createElement('button');
    button.innerHTML = page;

    if (current_page === page) {
      button.classList.add('active');
    }
    button.addEventListener('click', function () {
      current_page = page;
      displayList(dataAlbum, tableBody_element, rows, current_page, heading);

      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');

      button.classList.add('active');
    });
    return button;
  };
  displayList(dataAlbum, tableBody_element, rows, current_page, heading);
  setUpPagination(dataAlbum, pagination_element, rows);
}

//Dropdown Menu

const setDropDown = albumData => {
  const dropdown = document.getElementById('releaseDate');
  const releaseYears = albumData.map(e => e.year);
  const unique = [...new Set(releaseYears)];
  unique.forEach(years => {
    if (typeof years != 'undefined') {
      let option = document.createElement('option');
      option.innerHTML = years;
      option.value = years;
      dropdown.appendChild(option);
    }
  });
};

//Filter event listener
const setEventListeners = albumData => {
  document.querySelector('#releaseDate').addEventListener('change', event => {
    console.log(`event`, event);
    filterByDropDown(albumData);
  });
};

//Searchbar
const filterBySearchBar = albumData => {
  const searchBar = document.querySelector('#searchBar');
  console.log(searchBar);
  searchBar.addEventListener('keyup', event => {
    const searchString = event.target.value.toLowerCase();
    const filteredCharacters = albumData.filter(character => {
      return (
        character.artist.toLowerCase().includes(searchString) ||
        character.title.toLowerCase().includes(searchString)
      );
    });
    createReleaseContentTable(filteredCharacters);
  });
};
//Filter by dropdown
const filterByDropDown = albumData => {
  const dropDownValue = document.querySelector('#releaseDate').value;
  console.log(`dropDownValue`, dropDownValue);
  let filteredReleases = albumData.filter(release => {
    if (typeof release.year != 'undefined') {
      return release.year == dropDownValue || dropDownValue === 'all';
    }
  });
  createReleaseContentTable(filteredReleases);
};
