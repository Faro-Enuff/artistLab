// URL Use
////////////
////////
////
// let params = new URL(document.location).searchParams;
// let artist = params.get('artist');

const createUrlAlbum = (code, artistName) => {
  const person = artistName => {
    let artist = {
      q: artistName,
      key: 'ndqiGGFVIuiLYHmjQExU',
      secret: 'ADOGBtMyjsEJjQkyVcoNQTASKAuLfdCW',
      per_page: 100,
      type: 'release',
      //   country: 'US',
      page: 1,
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

////
////////
////////////

//FETCHING FUNCTION
////////////
////////
////

// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
// };

// fetch(
//   createUrlAlbum('https://api.discogs.com/database/search', artist),
//   requestOptions
// )
//   .then(response => response.json())
//   .then(artists => {
//     console.log(`artists`, artists);
//     let cleanDataAlbum = artists.results;
//     createAlbumContentTable(cleanDataAlbum);
//   })
//   .catch(error => console.log('error', error));

////
////////
////////////

//Function Album Table
////////////
////////
////
let createAlbumContentTable = function (cleanDataAlbum) {
  //BUILD THE MAIN ARRAY FOR ALBUM TABLE
  //Removing Duplicate Objects out of the Array
  let dataAlbumTable = [
    ...cleanDataAlbum
      .reduce((map, obj) => map.set(obj.master_id, obj), new Map())
      .values(),
  ];
  //Filter for Type 'release'
  const filteredDataAlbumTable = dataAlbumTable.filter(
    rel => rel.type == 'release'
  );
  //Clean the elements of the Objects -> Convert Arrays into Strings
  const mappedDataAlbumTable = filteredDataAlbumTable.map((gen, i, array) => {
    function concatStringArray(subject) {
      let text = '';
      for (let j = 0; j < subject.length; j++) {
        if (j < subject.length - 1) {
          text = text + subject[j] + ', ';
        } else {
          text = text + subject[j];
        }
      }
      return text;
    }
    return {
      ...gen,
      genre: concatStringArray(gen.genre),
      format: concatStringArray(gen.format),
    };
  });
  //Sort the Cleaned Array Descending -> From high to low
  const sortedDataAlbumTable = mappedDataAlbumTable.sort(
    (a, b) => b.year - a.year
  );
  console.log(`sortedDataAlbumTable`, sortedDataAlbumTable);

  //Album-Cover_Column
  for (let i = 0; i < sortedDataAlbumTable.length && i < 5; i++) {
    var imgCover = document.createElement('img');
    imgCover.src = sortedDataAlbumTable[i].cover_image;
    imgCover.setAttribute('class', 'coverImg');
    var src = document.getElementById('leftCoverColumn');
    src.appendChild(imgCover);
  }

  //Creating the Album Table
  const tableDiv = document.getElementById('albumContentTable');
  const searchBar = document.createElement('input');
  searchBar.setAttribute('type', 'text');
  searchBar.setAttribute('id', 'search');
  searchBar.setAttribute('placeholder', 'Search...');
  tableDiv.appendChild(searchBar);
  const heading = ['title', 'genre', 'year', 'format'];
  const tableBody_element = document.getElementById('albumContentTableBody');
  const pagination_element = document.getElementById('pagination');

  let current_page = 1;
  let rows = 10;

  function displayList(data, wrapper, rows_per_page, page, title) {
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
          cell_element.innerHTML = dataElements[titles];
          row_element.appendChild(cell_element);
        });
        wrapper.appendChild(row_element);
      }
    });
  }

  function setUpPagination(data, wrapper, rows_per_page) {
    wrapper.innerHTML = '';

    let page_count = Math.ceil(data.length / rows_per_page);
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
      displayList(
        sortedDataAlbumTable,
        tableBody_element,
        rows,
        current_page,
        heading
      );

      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');

      button.classList.add('active');
    });
    return button;
  }
  displayList(
    sortedDataAlbumTable,
    tableBody_element,
    rows,
    current_page,
    heading
  );
  setUpPagination(sortedDataAlbumTable, pagination_element, rows);
};
