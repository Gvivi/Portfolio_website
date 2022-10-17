//smooth scroll to anchor points
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        //console.log(this.getAttribute('href'));
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior : 'smooth'
        });
    });
});
 
//turn overlay on
document.querySelectorAll(".work").forEach(work => {
    work.addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById("overlay").style.display = "block";
    });
});

//fill individual overlay
document.querySelectorAll('.work').forEach(work => {
    work.addEventListener('click', function(e){
        e.preventDefault();

        let obj = works.find(o => o[this.getAttribute('id')]); //find work with ID

        document.getElementById("txt-title").innerHTML = obj[this.getAttribute('id')].title; //get work's title
        document.getElementById("txt-content").innerHTML = obj[this.getAttribute('id')].text; //get work's text

        let objLength = Object.keys(obj[this.getAttribute('id')]).length;
        document.getElementById("art-info").innerHTML = ""; //clear previous artwork info
        document.getElementById("images").innerHTML = ""; //clear previous media

        for(let i = 2; i < objLength; i++){
            document.getElementById("images").innerHTML += obj[this.getAttribute('id')][i]; //fill in images & videos
        }

        //if inspo section
        if(this.getAttribute('id') == "inspo"){
            document.getElementById("images").innerHTML = "Loading..."; //clear previous media
            document.getElementById("art-info").innerHTML = ""; //clear previous artwork info
            startMET();
        }
    });
});

function startMET(){
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects').then(function (response) {
        // The API call was successful!
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (data) {
        // This is the JSON from our response
        let index = Math.round(Math.random() * (data.total-1))
        getArtwork(data.objectIDs[index]);

    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

function getArtwork(artworkID){
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + artworkID).then(function (response) {
        // The API call was successful!
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (data) {
        // This is the JSON from our response
        let artworkName = data.objectName;
        let artist = data.artistDisplayName;
        let artImg = data.primaryImage;

        //check for completeness
        if(artImg === ""){
            startMET();
            return;
        }
        if(artworkName === ""){
            artworkName = "Unknown";
        }
        if(artist === ""){
            artist = "unknown";
        }

        document.getElementById("images").innerHTML = "<img src=\"" + artImg + "\" class=\"image\">";
        document.getElementById("art-info").innerHTML = "<div id=\"txt-content\">"+ artworkName + " by " + artist + "</div>"; //fill in images & videos
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
        startMET();
    });
}

//turn overlay off
document.querySelectorAll("#close").forEach(overlay => {
    overlay.addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById("overlay").style.display = "none";
        document.getElementById("images").innerHTML = ""; //clear previous media
    });
});

/*
//sound effect on click
var audio = new Audio("./assets/mixkit-click.mp3");

document.onclick = function() {
  audio.play();
}
*/