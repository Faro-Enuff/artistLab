//SEARCH FUNCTION FOR ARTIST NAMES
////////////
////////
////

let artistNameText = '';
function artistCatch() {
  artistNameText = document.getElementById('artistCall').value;
  window.location = '../index.html?artist=' + artistNameText;
  alert(artistNameText);
}
