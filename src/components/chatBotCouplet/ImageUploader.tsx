const APP_NAME = 'SPRING_COUPLETS';
const FOLDER_NAME = 'spring-couplets';
const BASE_DOMAIN = 'https://9hnom9x427.execute-api.us-east-1.amazonaws.com';
const CLOUDFRONT_BASE_PATH = `https://d1d2ukegmn3q96.cloudfront.net/${FOLDER_NAME}`;

export const ImageUploader = {
  uploadImage: async (fileName: string, base64image: string) => {
    await fetch(`${BASE_DOMAIN}/prod/api/image/upload`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64Image: base64image.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
        fileName,
        appName: APP_NAME
      })
    });

    return `${CLOUDFRONT_BASE_PATH}/${fileName}.png`;
  }
}