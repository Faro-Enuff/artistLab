// Hide & Show function for the Albumtable
let hideShow = function () {
  let table = document.querySelector('.album-table');
  let pagination = document.querySelector('.pagenumbers');
  let dropdown = document.querySelector('.dropdown-menu');
  let artistTable = document.querySelector('.table-row');
  let coverRow = document.querySelector('.albumCover-row');
  if (table.style.visibility === 'visible') {
    pagination.style.visibility = 'hidden';
    table.style.visibility = 'hidden';
    dropdown.style.visibility = 'hidden';
    artistTable.style.opacity = 1;
    coverRow.style.opacity = 1;
  } else {
    pagination.style.visibility = 'visible';
    table.style.visibility = 'visible';
    dropdown.style.visibility = 'visible';
    artistTable.style.opacity = 0.5;
    coverRow.style.opacity = 0.5;
  }
};
