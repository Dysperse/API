import html2canvas from "html2canvas";

const downloadImage = (blob, fileName) => {
  const fakeLink: any = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  fakeLink.href = blob;
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  fakeLink.remove();
};

export const exportAsImage = async (el, imageFileName) => {
  const canvas = await html2canvas(el, { backgroundColor: null });
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};
