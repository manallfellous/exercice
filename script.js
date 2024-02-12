function handleFileUpload() {
  const fileInput = document.getElementById('fileInput');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const file = fileInput.files[0];

  if (file && file.type === 'image/png') {
    const reader = new FileReader();

    reader.onload = function (e) {
      const image = new Image();

      image.onload = function () {
        if (image.width === 512 && image.height === 512) {
          if (verifyCircularPixels(image, ctx)) {
            alert('Badge uploaded successfully!');
          } else {
            alert('Non-transparent pixels are not within a circle.');
          }
        } else {
          alert('Image dimensions must be 512x512 pixels.');
        }
      };

      image.src = e.target.result;
    };

    reader.readAsDataURL(file);
  } else {
    alert('Please upload a valid PNG image.');
  }
}

function verifyCircularPixels(image, ctx) {
  ctx.clearRect(0, 0, 512, 512);
  ctx.drawImage(image, 0, 0, 512, 512);

  const imageData = ctx.getImageData(0, 0, 512, 512).data;
  const centerX = 256;
  const centerY = 256;
  const radius = 256;

  for (let i = 0; i < imageData.length; i += 4) {
    const x = (i / 4) % 512;
    const y = Math.floor((i / 4) / 512);

    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

    if (imageData[i + 3] > 0 && distance > radius) {
      return false;
    }
  }

  return true;
}