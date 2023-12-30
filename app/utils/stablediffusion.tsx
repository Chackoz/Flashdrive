import axios from "axios";

const convertTextToImage = async (text: string): Promise<string> => {
  const api = "https://ec8cdf70a78195e2d5.gradio.live";
  const url = `${api}/sdapi/v1/txt2img`;

  const option_payload = {
    sd_model_checkpoint: "dreamshaper_5-inpainting.safetensors [498c18f2a5]",
    CLIP_stop_at_last_layers: 2,
  };

  

  const payload = {
    prompt: `Mononoke hime studio image of ${text} ,stylized volumetric lighting, 4k beautifull detailled painting, --ar 2:3 --uplight`,
    steps: 20,
    sampler_name: "DPM++ 2M Karras",
    seed: -1,
  };

  try {

    const responsesetting = await axios.post(`${api}/sdapi/v1/options`, option_payload);
    const response = await axios.post(url, payload);
    console.log("Response:", response.data);
    const imageData = response.data.images[0];
    return imageData;
  }
   catch (error) {
    console.log(error)
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
    //   const futureLinks = response.data.future_links;
    //   console.log("Future Link",futureLinks)
    //   return futureLinks;

    // }catch(error){
    //   console.log("Error converting text to image:", error);
    //   throw error;
    // }
    throw error;
    
  }
};

export default convertTextToImage;
