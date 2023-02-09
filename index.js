let width = window.innerWidth; //get the window width
let height = 0; //this will be computed based on the input stream
let streaming = false;  //streaming reference
let video = null;   //video reference
let canvas = null;  //canvas referance
let photo = null;   //photo referance
let state = null;
let input = null;
let device = null;

function startUP() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  photo = document.getElementById("photo");
  state = document.getElementById("status");
  input = document.getElementById("uploadPicture");
  device = document.getElementById("device");

  state.innerText = "Start UP"

  if (isSmartPhone()) {
    device.innerText = "Smart Phone"
  } else {
    device.innerText = "PC"
  }
  
  //this event is fired when the video can ready to stream.(a.k.a: video can play)
  video.addEventListener(
    "canplay",
    (ev) => {
      if (!streaming) {
        width = window.innerWidth; //get window width
        height =  video.videoHeight / (video.videoWidth / width);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    false
  );

  //this event is fired when the file uploaded.(a.k.a: file change)
  input.addEventListener(
    "change",
    (ev) => {
      const file = input.files[0];
      const image = new Image();
      const reader = new FileReader();
      //In this section, the photo data processed into imageURLs.
      reader.onload = () => {
        image.onload = () => {
          const context = canvas.getContext("2d");
          const h = image.height / (image.width / width)
          canvas.width = width;
          canvas.height = h;
          context.drawImage(image, 0, 0, width, h);
          const imageURL = canvas.toDataURL('image/png')
          photo.setAttribute("src", imageURL);
        }
        image.src = reader.result;
      }
      reader.readAsDataURL(file);
      state.innerText = "Uploaded a picture"
    }
  )
  clearPhoto();
}

function isSmartPhone() {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}

//this function is called when the window size is changed
function resize() {
  state.innerText = "Resized the window"
  if (streaming) {
    width = window.innerWidth; // get window width
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute("width", width);
    video.setAttribute("height", height);
  }
}

async function cameraOn() {
  state.innerText = "In preparation, Permission granted"
  //variable to preserve the video result.
  let stream = null;
  //setting constraints 
  const constraints = {
    audio: false, 
    video: true //this code is too short. should be more detailed.
  }
  //get the references.
  const video = document.getElementById("video")
  //get UserMedia status and stream from camera, and play video.
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play()
    state.innerText = "Camera On"
  } catch(err) {
    console.log(err)
    state.innerText = "Error Occured"
  }
}

function clearPhoto() {
  context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

function takePicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  } else {
    clearPhoto();
  }
  state.innerText = "Take a picture"
}

function uploadPicture() {
  input.click();
  state.innerText = "Uploading..."
}

//Set up our event listener to run the startUp process
//Once loading is complete.
//The third argument is optional and may only be false this time, because all false.
window.addEventListener("load", startUP, {
  capture: false,
  once: false,
  passive: false
});

//Set up our event listener to run the startUP process for resize the window
window.addEventListener("resize", resize, {
  caputer: false,
  once: false,
  passive: false
})

