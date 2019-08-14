import view from "./view";
import { uploadFile } from '../apiList';
module.exports = function(PIXI, app, obj){
    return view(PIXI, app, obj ,(imageSrc,bool)=>{
        uploadFile(imageSrc,bool) 
    })
} 