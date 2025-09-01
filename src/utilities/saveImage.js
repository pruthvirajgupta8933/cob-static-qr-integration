import { saveAs } from "file-saver"
export const saveImage = async (imageUrl, imageName) => {
    await saveAs(imageUrl, imageName);
}