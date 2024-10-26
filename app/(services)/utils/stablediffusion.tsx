import axios from "axios";
import { getUsername } from "./localStorage";
import { addDoc, collection } from "firebase/firestore";
import { db, FetchAPi, FetchValue, UpdateValue } from "../firebase/config";
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const convertTextToImage = async (text: string): Promise<string> => {
  let api = "";
  api = await FetchAPi();
  const url = `${api}/sdapi/v1/txt2img`;

  let option_payload = {
    sd_model_checkpoint: "dreamshaper_8.safetensors [879db523c3]",
    CLIP_stop_at_last_layers: 2,
  };
  const base64ToDataUrl = (
    base64String: string,
    mimeType: string = "image/png"
  ): string => {
    return `data:${mimeType};base64,${base64String}`;
  };

  let payload = {
    prompt: `Mononoke hime studio image of { ${text} }  ,stylized volumetric lighting, 4k beautifull detailled painting, --ar 2:3 --uplight`,
    negative_prompt: " nsfw , nude , sex , rape ,naked  ",
    steps: 20,
    enable_hr: false,
    sampler_name: "DPM++ 2M Karras",
    seed: -1,
    width: 512,
    height: Math.random() < 3 / 4 ? 512 : 720,
  };

  if (text[0] == "*") {
    option_payload = {
      sd_model_checkpoint:
        "epicrealism_pureEvolutionV3.safetensors [52484e6845]",
      CLIP_stop_at_last_layers: 2,
    };
    payload = {
      prompt: ` ${text} `,
      negative_prompt: "underage , child  ",
      steps: 25,
      enable_hr: false,
      sampler_name: "DPM++ 2M Karras",
      seed: -1,
      width: 512,
      height: 512,
    };
  }
  if (text[0] == "+") {
    option_payload = {
      sd_model_checkpoint:
        "epicrealism_pureEvolutionV3.safetensors [52484e6845]",
      CLIP_stop_at_last_layers: 2,
    };
    payload = {
      prompt: ` Mononoke hime studio image of { ${text} }  ,stylized volumetric lighting, 4k beautifull detailled painting, --ar 2:3 --uplight `,
      negative_prompt: "underage , child  ",
      steps: 25,
      enable_hr: false,
      sampler_name: "DPM++ 2M Karras",
      seed: -1,
      width: 512,
      height: 512,
    };
  }


  const username = getUsername();
  if (text !== "") {
    console.log("Username", username, " Prompt", text);
    const userRef = collection(db, "log");
    await addDoc(userRef, {
      username: username,
      prompt: text,
      time: Date(),
    });

    try {
      const responsesetting = await axios.post(
        `${api}/sdapi/v1/options`,
        option_payload
      );
      const response = await axios.post(url, payload);
      console.log("Response:", response.data);
      const imageData = response.data.images[0];

      const base64Data = imageData;
      const decodedData = base64ToDataUrl(base64Data);

      if (text !== "" && text[0] !== "*") {
        const storage = getStorage();

        const blob = await fetch(decodedData).then((res) => res.blob());
        let result = 1000;

        //
        try {
          const imgcount = await FetchValue();

          result = imgcount; 
          console.log(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        result = result + 1;
        UpdateValue(result);
        //

     
        const storageRef = ref(storage, `art (${result}).png`); 
        try {

          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          const imgRef = collection(db, "images");
          await addDoc(imgRef, {
            email: username,
            imgno: result,
          });

          console.log("Uploaded Url :", downloadURL);
        } catch (error) {
          console.error("Error uploading image to Firebase:", error);
          throw error;
        }
      }

      return imageData;
    } catch (error) {
      console.log(error);
      // try{
      //   const backupapi="https://stablediffusionapi.com/api/v4/dreambooth/"
      //   const backupprompt={
      //     "key": "m6P6LFE7PjxUJjbmLkCYfdoLk0XBm8Lt9o9Ar8Z30rnnXxni87lT4acnJ15c",
      //     "model_id": "dream-shaper-8797",
      //     "prompt":`Mononoke hime studio image of ${text} ,stylized volumetric lighting, 4k beautifull detailled painting, --ar 2:3 --uplight`,
      //     "negative_prompt": "",
      //     "width": "512",
      //     "height": "512",
      //     "samples": "1",
      //     "num_inference_steps": "30",
      //     "safety_checker": "no",
      //     "enhance_prompt": "yes",
      //     "seed": null,
      //     "guidance_scale": 7.5,
      //     "multi_lingual": "no",
      //     "panorama": "no",
      //     "self_attention": "no",
      //     "upscale": "no",
      //     "embeddings_model": null,
      //     "lora_model": null,
      //     "tomesd": "yes",
      //     "clip_skip": "2",
      //     "use_karras_sigmas": "yes",
      //     "vae": null,
      //     "lora_strength": null,
      //     "scheduler": "UniPCMultistepScheduler",
      //     "webhook": null,
      //     "track_id": null
      //   }
      //   const response = await axios.post(backupapi, backupprompt);
      //   const id = response.data.id;
      //   const backupapifetch="https://stablediffusionapi.com/api/v4/dreambooth/fetch"
      //   const backupapifetchPrompt={
      //     "key": "m6P6LFE7PjxUJjbmLkCYfdoLk0XBm8Lt9o9Ar8Z30rnnXxni87lT4acnJ15c",
      //     "request_id": `${id}`
      //    }

      //    const response2 = await axios.post( backupapifetch, backupapifetchPrompt);
      //    let imagebackup = response2.data.output[0];
      //    while(imagebackup===""){
      //     console.log("Finding..")
      //     const response2 = await axios.post( backupapifetch, backupapifetchPrompt);
      //     imagebackup = response2.data.output[0];
      //    }
      //    console.log(response2)
      //    console.log("Backup Image" ,imagebackup)
      //   return imagebackup;

      // }catch(error){
      //   console.log("Error converting text to image:", error);
      //   throw error;
      // }
      throw error;
    }
  } else {
    return "";
  }
};

export default convertTextToImage;
