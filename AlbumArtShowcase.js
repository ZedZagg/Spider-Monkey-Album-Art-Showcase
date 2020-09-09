window.DefinePanel("AlbumArtShowcase", { author: "ZedZagg" });
include(`${fb.ComponentPath}docs\\Flags.js`);
include(`${fb.ComponentPath}docs\\Helpers.js`);

const imgCount = 4;
const noArtImg = gdi.Image("D:/sample.jpg");
const spacing = 2;
const bgCol = RGB(255, 255, 255)

var imgSize;
var imageSet = new Array(imgCount);

function on_paint(gr) {
    gr.FillSolidRect(0, 0, window.Width, window.Height, bgCol);
    
    var i;
    for (i = 0; i < imgCount; i++) {
        drawArt(i * (imgSize + spacing),imageSet[i],gr);
    }
}

function drawArt(xPos,img,gr){
    if(!img){
        if(noArtImg){
            gr.DrawImage(noArtImg, xPos, 0, imgSize, imgSize, 0, 0, noArtImg.Width, noArtImg.Height);
        }
        else{
            // change the RGB(16, 16, 16) for different default no art image colours
            gr.FillSolidRect(xPos, 0, imgSize, imgSize, RGB(16, 16, 16));
            gr.DrawLine(xPos, imgSize, xPos + imgSize, 0, 3, bgCol)
        }
    }
    else{
        gr.DrawImage(img, xPos, 0, imgSize, imgSize, 0, 0, img.Width, img.Height);
    }
}

function on_size() {
    var len = (window.Width - (imgCount - 1) * spacing)/imgCount;
    
    if(len < window.Height)
        imgSize = len;
    else
        imgSize = window.Height;
}

function on_playback_new_track(metadb) {
    var tfo = fb.TitleFormat("%title%\n%artist%\n%album%");
        console.log(tfo.EvalWithMetadb(metadb));
    getArt();    
}

function getArt(){
    var handles = plman.GetPlaylistItems(plman.PlayingPlaylist);

    var playing_item_location = plman.GetPlayingItemLocation();
    var index = playing_item_location.PlaylistItemIndex;
    
    handleCount = handles.Count - index;
            
    if (handleCount == 0){
        return;
    }

    var i;
    for (i = 0; i < imgCount; i++) {
        if (i == handleCount){
            break;
        }
        imageSet[i] = utils.GetAlbumArtV2(handles[index + i], AlbumArtId.front);
    }

    window.Repaint();
}
