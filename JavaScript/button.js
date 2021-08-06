//SEARCH FUNCTION FOR ARTIST NAMES
////////////
////////
////

let artistNameText = '';
function artistCatch() {
  artistNameText = document.getElementById('artistCall').value;
  window.location = './HTML/artist.html?artist=' + artistNameText;
}

////
////////
////////////

//Event-Listener for Button-Click
////////////
////////
////
const input = document.getElementById('artistCall');
input.addEventListener('keyup', e => {
  console.log(e.key);
  if (e.key === 'Enter') {
    document.getElementById('searchButton').click();
  }
});
