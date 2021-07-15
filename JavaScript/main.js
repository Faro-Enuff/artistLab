var cleanData = data.results;
console.log(`cleanData`, cleanData);

//Function Artist Table + Album Image Row
////////////
////////
////

let createMainContentTable = function () {
  ///LINK TO TBODY
  var tbody = document.getElementById("mainContentTableBody");

  var row = document.createElement("tr");

  var releaseArray = [];

  for (let i = 0; i < cleanData.length; i++) {
    ///ARTIST COLUMN
    if (cleanData[i].type === "artist") {
      var cell = document.createElement("td");
      cell.innerHTML = cleanData[i].title;
      ///GENRE COLUMN
    } else if (cleanData[i].type === "release") {
      releaseArray.push(cleanData[i].title);
      if (releaseArray.length <= 1) {
        var cell = document.createElement("td");
        cell.innerHTML = cleanData[i].genre[0];
      }
      //LABEL COLUMN
    } else if (cleanData[i].type === "label") {
      var cell = document.createElement("td");
      cell.innerHTML = cleanData[i].title;
    }
    cell.setAttribute("class", "align-middle");
    row.appendChild(cell);
  }
  // COUNT RELEASES

  var releases = function () {
    var releaseArrayClean = [];
    releaseArray.forEach((c) => {
      if (!releaseArrayClean.includes(c)) {
        releaseArrayClean.push(c);
      }
    });
    console.log(releaseArrayClean);

    return [releaseArrayClean, releaseArrayClean.length];
  };
  /// RELEASES COLUMN
  var cell2 = document.createElement("td");
  cell2.innerHTML = releases()[1];
  cell2.setAttribute("class", "align-middle");
  row.appendChild(cell2);

  /// SoundCloud
  var cell = document.createElement("td");
  var scIconImg = document.createElement("img");
  // sIconImg.setAttribute("src", "../img/Soundcloud Logo Dark.png");
  function setAttributes(el, attrs) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
  setAttributes(scIconImg, {
    src: "../img/Soundcloud40.png",
    scrolling: "no",
    style: "cursor: pointer",
    style: "width: 45px; height: 45px",
    style: "table",
    style: "border-radius: 30px",
  });
  //FUNCTION FOR ARTIST - INSERT A PARAMETER LATER
  scIconImg.onclick = function () {
    window.open("https://soundcloud.com/eminemofficial", "_blank");
  };
  cell.appendChild(scIconImg);
  row.appendChild(cell);

  //Spotify IMG
  var cell = document.createElement("td");
  var spIconImg = document.createElement("img");
  setAttributes(spIconImg, {
    src: "../img/Spotify Icon Black.png",
    scrolling: "no",
    style: "cursor: pointer",
    style: "width: 45px; height: 45px",
  });
  spIconImg.onclick = function () {
    window.open("https://open.spotify.com/search/eminem", "_blank");
  };
  cell.appendChild(spIconImg);
  row.appendChild(cell);

  //Beatport IMG
  var cell = document.createElement("td");
  var bpIconImg = document.createElement("img");
  setAttributes(bpIconImg, {
    src: "../img/Beatport.png",
    scrolling: "no",
    style: "cursor: pointer",
    style: "width: 45px; height:45px",
  });
  bpIconImg.onclick = function () {
    window.open("https://www.beatport.com/artist/eminem/48400", "_blank");
  };
  cell.appendChild(bpIconImg);
  row.appendChild(cell);

  tbody.appendChild(row);

  //Album-Cover_Column
  const checkArray = [];
  for (let i = 0; i < cleanData.length; i++) {
    var check = cleanData[i].master_id;
    if (!checkArray.includes(check) && checkArray.length <= 12) {
      var imgCover = document.createElement("img");
      imgCover.src = cleanData[i].cover_image;
      imgCover.setAttribute("class", "coverImg");
      var src = document.getElementById("leftCoverColumn");
      src.appendChild(imgCover);
      checkArray.push(check);
    }
  }
  console.log(checkArray);
  console.log(releases()[0][0]);
};

// var imgCover = document.createElement("img");

// imgCover.src = cleanData[1].thumb;
// var src = document.getElementById("leftCoverColumn");
// src.appendChild(imgCover);

//Console commands
console.log(createMainContentTable());
// console.log(createMainImageColumn());

//Function Album Table
////////////
////////
////

//BUILDING ONE SINGLE Array for Album Table
const cleanDataAlbum = [];
const cleanDataGenre = [];
const cleanDataYear = [];
const cleanDataFormat = [];
const checkArrayId = [];
for (let i = 0; i < cleanData.length; i++) {
  var checkId = cleanData[i].master_id;
  if (cleanData[i].type === "release" && !checkArrayId.includes(checkId)) {
    cleanDataAlbum.push(cleanData[i].title);
    cleanDataGenre.push(cleanData[i].genre[0]);
    cleanDataYear.push(cleanData[i].year);
    cleanDataFormat.push(cleanData[i].format);
    checkArrayId.push(checkId);
  }
}

//Create a String out of the Format Arrays
const cleanDataFormatString = [];
for (let i = 0; i < cleanDataFormat.length; i++) {
  var stringFormat = "";
  for (let j = 0; j < cleanDataFormat[i].length; j++) {
    if (j < cleanDataFormat[i].length - 1) {
      stringFormat = stringFormat + cleanDataFormat[i][j] + ", ";
    }
    stringFormat = stringFormat + cleanDataFormat[i][j];
  }
  cleanDataFormatString.push(stringFormat);
}

console.log(`cleanDataFormatString`, cleanDataFormatString);

// CLEAN DATA FOR TABLE
const cleanDataAlbumTable = [
  cleanDataAlbum,
  cleanDataGenre,
  cleanDataYear,
  cleanDataFormatString,
];
console.log(`cleanDataAlbumTable`, cleanDataAlbumTable);

let createAlbumContentTable = function () {
  arrTH = ["th1", "th2", "th3", "th4"];

  let i = 0;
  while (i < cleanDataAlbumTable.length - 1) {
    var tbody = document.getElementById("albumContentTableBody");
    var row = document.createElement("tr");
    for (let j = 0; j < arrTH.length; j++) {
      var cell = document.createElement("td");
      cell.innerHTML = cleanDataAlbumTable[j][i];
      cell.setAttribute("class", "align-middle");
      row.appendChild(cell);
    }
    tbody.appendChild(row);
    i++;
  }
};

console.log(createAlbumContentTable());

// var tbody = document.getElementById("albumContentTable");
// var row = document.createElement("tr");
// var cell = document.createElement("td");
// cell.innerHTML = cleanData[i];
