export const httpApi = "https://server-store-ecommerce.onrender.com";
export const SECRET_KEY = "LeQuocHuy";

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
