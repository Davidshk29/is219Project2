// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
    var currentTime = new Date().getTime();
    if (mLastFrameTime === 0) {
        mLastFrameTime = currentTime;
    }

    if ((currentTime - mLastFrameTime) > mWaitTime) {
        swapPhoto();
        mLastFrameTime = currentTime;
    }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

var mCurrentIndex = 0;

function swapPhoto() {
    if(mCurrentIndex < 0){
        mCurrentIndex +=  mImages.length;
    }
    $("#photo").attr('src', mImages[mCurrentIndex].imgPath);
    $(".snowboard").text("Snowboard: "+mImages[mCurrentIndex].imgSnowboard);
    $(".description").text("Description: "+mImages[mCurrentIndex].description);
    $(".price").text("Price: "+mImages[mCurrentIndex].price);

    mCurrentIndex++;
    if(mCurrentIndex >=  mImages.length){
        mCurrentIndex = 0;
    }
    console.log('swap photo');
}
//getQueryParams
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}
//$_GET request variable
var $_GET = getQueryParams(document.location.search);
//XMLHttpRequest variable
var mRequest = new XMLHttpRequest();
//Array holding GalleryImage objects (see below).
var mImages = [];
//Holds the retrieved JSON information
var mJson;
//URL for the JSON to load by default
//some options for you are: images.json, images.short.jason; you will need to create your own extra.json later


var mUrl;
if($_GET["json"] == undefined)
{
    mUrl = "images.json";
}
else{
    mUrl = $_GET["json"];
}

mRequest.onreadystatechange = function() {

    if (mRequest.readyState == 4 && mRequest.status == 200) {
        try {
            mJson = JSON.parse(mRequest.responseText);
            console.log(mJson);
            console.log(mJson.images[1].price);
            for(var i=0; i < mJson.images.length;i++)
            {
                mImages.push(new GalleryImage(mJson.images[i].imgSnowboard,mJson.images[i].description,mJson.images[i].price,mJson.images[i].imgPath));
            }

        } catch(err) {
            console.log(err.message);
        }
    }
};

mRequest.open("GET",mUrl, true);
mRequest.send();

function makeGalleryImageOnloadCallback(galleryImage) {
    return function(e) {
        galleryImage.img = e.target;
        mImages.push(galleryImage);
    }
}

$(document).ready( function() {
    //this initially hides the photos' metadata information
    $('.details').eq(0).hide();

    $(".moreIndicator").click(function(){
        $( "img.rot90" ).toggleClass("rot270",3000);
        $(".details").slideToggle(1000);
    });

    $("#next").click(function(){
        swapPhoto();

    });

    $("#prev").click(function(){
        mCurrentIndex -= 2;
        swapPhoto();
        console.log(mCurrentIndex);
    });



});

window.addEventListener('load', function() {

    console.log('window loaded');

}, false);

function GalleryImage(imgSnowboard,description,price,imgPath){
    this.imgSnowboard = imgSnowboard;
    this.description = description;
    this.price = price;
    this.imgPath = imgPath;
}