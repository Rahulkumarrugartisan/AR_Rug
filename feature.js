//**---------------------------------------------------------------------------------------------------------- */
/** This script is developed by Rahul kumar for Rug Artisan Ltd*/
/**This script handles all the freature in the AR web viewer (such as texture change, material change...etc) */
//**---------------------------------------------------------------------------------------------------------- */
import { ModelViewerElement} from "./modelViewer_copy.js";

//const tt= ModelViewerElement.prototype;
//console.log('mve: ',tt);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithExponentialBackoff(url, retries = 5, delayTime = 1000) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delayTime * Math.pow(2, attempt);
                await delay(waitTime);
                attempt++;
                continue;
            }
            return response;
        } catch (error) {
            if (attempt === retries - 1) throw error;
            await delay(delayTime * Math.pow(2, attempt));
            attempt++;
        }
        console.log("Number of attemts: "+attempt);
    }
    throw new Error('Max retries reached');
}

function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

async function loadImageAsTexture1(base64, format) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid Base64 string');
    }

    const img = new Image();
    img.src = `data:image/${format};base64,${base64}`;
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL(`image/${format}`);
}

async function loadImageAsTexture(url) {
    const response = await fetchWithExponentialBackoff(url);
    const blob = await response.blob();
    const imgType = blob.type;

    if (imgType === 'image/svg+xml') {
        const svgText = await blob.text();
        const blobUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));

        const img = new Image();
        img.src = blobUrl;
        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const textureUrl = canvas.toDataURL('image/png');
        return textureUrl;
    } else if (imgType === 'image/png' || imgType === 'image/jpeg') {
        return URL.createObjectURL(blob);
    } else {
        throw new Error('Unsupported image type');
    }
}

function change_Rug_Shape(shapename, model) {
    //console.log("shape name: " + shapename);
    if (shapename === "rectangle!") {
        model.src = "rug_Models/rect.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "round!") {
        model.src = "rug_Models/round.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "oval!") {
        model.src = "rug_Models/oval.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "hexagon!") {
        model.src = "rug_Models/hexagon.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "halfmoon!") {
        model.src = "rug_Models/halfmoon.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "diamond!") {
        model.src = "rug_Models/diamond.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "eight!") {
        model.src = "rug_Models/eight.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "drop!") {
        model.src = "rug_Models/drop.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "oblong!") {
        model.src = "rug_Models/oblong.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "arch!") {
        model.src = "rug_Models/arch.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "runner!") {
        model.src = "rug_Models/runner.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "ogee!") {
        model.src = "rug_Models/ogee.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "square!") {
        model.src = "rug_Models/square.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "splash!") {
        model.src = "rug_Models/splash.glb";
        console.log("shape changed to: " + shapename);
    }
    if (shapename === "capsule!") {
        model.src = "rug_Models/capsule.glb";
        console.log("shape changed to: " + shapename);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const modelViewerTexture1 = document.querySelector("#model");

    modelViewerTexture1.addEventListener("load", async () => {
        //------------------------------------------------------------------------------------
        //** get data from URL */
        //------------------------------------------------------------------------------------
        // Example URL with encoded fragment
        //const url = 'https://example.com/page#data=value%201&shape=value%202';

        const currentUrl = window.location.href;
        const urlObject = new URL(currentUrl);
        const fragment = urlObject.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const param1 = params.get('data');
        const svgTextureUrl = param1.toString();
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';

        //const param1 = params.get('data'); // Decodes 'value%201' to 'value 1'
        const shape_param = params.get('shape'); // Decodes 'value%202' to 'value 2'

        const textureUrl = await loadImageAsTexture(svgTextureUrl);

        //const blob = await response.blob();
        //const blobUrl = URL.createObjectURL(blob);

      
        //console.log('data url:', param1);
        //console.log('shape:', param2);

        change_Rug_Shape(shape_param, modelViewerTexture1);
        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------

        // URL of the new texture
        const newTextureUrl = param1.toString();

        try {
            // Ensure the model is fully loaded
            const model = modelViewerTexture1.model;
            if (!model) {
                console.error('Model not found');
                return;
            }

            // Assume you want to apply the texture to the first material
            const material = model.materials[0];
            const back_material = model.materials[1];
            if (!material) {
                console.error('Material not found');
                return;
            }
            if (!back_material) {
                console.error('Material not found');
                return;
            }

            // Create and apply the texture
            const texture = await modelViewerTexture1.createTexture(textureUrl);
            const normal_texture = await modelViewerTexture1.createTexture("Material_Texture/Carpet013_4K_Normal.jpg");
            const roughtness_texture = await modelViewerTexture1.createTexture("Material_Texture/Carpet013_4K_Roughness.jpg");
            const oc_texture = await modelViewerTexture1.createTexture("Material_Texture/Carpet013_4K_Displacement1_oc.png");
            if (material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                material.normalTexture.setTexture(normal_texture);
                material.pbrMetallicRoughness.metallicRoughnessTexture.setTexture(roughtness_texture);
                material.occlusionTexture.setTexture(oc_texture);

          

                const nor_sampler = material.normalTexture.texture.sampler;
                const mr_sampler = material.pbrMetallicRoughness.metallicRoughnessTexture.texture.sampler;
                const oc_sampler = material.occlusionTexture.texture.sampler;

                const backTexture = back_material.pbrMetallicRoughness.baseColorTexture.texture.sampler;

                backTexture.setScale({ u: 4, v: 4 });
                mr_sampler.setScale({ u: 12, v: 12 });
                nor_sampler.setScale({ u: 12, v: 12 });
                oc_sampler.setScale({ u: 12, v: 12 });
                
               
            } else {
                console.error('Material does not support pbrMetallicRoughness');
            }


            const backtexture = await modelViewerTexture1.createTexture('Back_texture/Fabric_Pattern_04_ambientocclusion.jpg');
            const normal_backtexture = await modelViewerTexture1.createTexture("Back_texture/Fabric_Pattern_04_normal.jpg");
            const roughtness_backtexture = await modelViewerTexture1.createTexture("Back_texture/Fabric_Pattern_04_metallic.jpg");
            //const oc_texture = await modelViewerTexture1.createTexture("Material_Texture/Carpet013_4K_Displacement1_oc.png");

            if (back_material.pbrMetallicRoughness) {
                back_material.pbrMetallicRoughness.baseColorTexture.setTexture(backtexture);
                back_material.normalTexture.setTexture(normal_backtexture);
                back_material.pbrMetallicRoughness.metallicRoughnessTexture.setTexture(roughtness_backtexture);
                //back_material.occlusionTexture.setTexture(oc_texture);

                const backTexture = back_material.pbrMetallicRoughness.baseColorTexture.texture.sampler;
                const nor_backsampler = back_material.normalTexture.texture.sampler;
                const mr_backsampler = back_material.pbrMetallicRoughness.metallicRoughnessTexture.texture.sampler;
                if(shape_param==="runner!")
                {
                    backTexture.setScale({ u: 2, v: 6 });
                    nor_backsampler.setScale({ u: 2, v: 6 });
                    mr_backsampler.setScale({ u: 2, v: 6 });

                }else{
                    backTexture.setScale({ u: 2, v: 2 });
                    nor_backsampler.setScale({ u: 2, v: 2 });
                    mr_backsampler.setScale({ u: 2, v: 2 });

                }
                
                
               
            } else {
                console.error('Material does not support pbrMetallicRoughness');
            }

        } catch (error) {
            console.error('An error occurred while applying the texture:', error);
        }
    });

   
});

function cameratest(modeviewer)
{
    
}

const modelViewerTexture2 = document.querySelector("#model");

modelViewerTexture2.addEventListener("ar-status", (event)=>
{
    //if (event.detail.status === 'enter') {
    const ct = modelViewerTexture2.getCameraOrbit();
    console.log("camera : "+ ct.radius);
    const info = document.querySelector("#info");
    info.innerHTML = `<p>${event.detail.status}</p><p>Scale: ${modelViewerTexture2.model.scale}</p>`;
    //}
});

modelViewerTexture2.addEventListener('ar-tracking', (event) => {
    // Update the scale display when the scale changes
    const ct = modelViewerTexture2.getCameraOrbit();
    console.log("camera : "+ ct.radius);
    const info = document.querySelector("#info");
    info.innerHTML = `<p>${event.detail.status}</p><p>Scale</p><p>Scale: ${modelViewerTexture2.getDimensions()}</p>`;
  });

  modelViewerTexture2.addEventListener('camera-change', (event) => {
    // Update the scale display when the scale changes
    const ct = modelViewerTexture2.getCameraOrbit();
    //console.log("camera : "+ ct.radius);
    const info = document.querySelector("#info");

    const model = modelViewerTexture2.model;

    
    if (model) {
      const scale = model.scale;
      const crgltf = modelViewerTexture2.object3d;
      //console.log("getting the mv func: ",crgltf);
      //info.innerHTML = `<p>${event.detail.status}</p><p>Scale Is model</p><p>Scale: ${crgltf}</p>`;
    }
    else{
        //info.innerHTML = `<p>${event.detail.status}</p><p>Scale</p><p>Scale: ${modelViewerTexture2.getDimensions()}</p>`;
    }
    
  });
//------------------------------------------------------------------------------------------------------
/**getting scene scale finally getting the scene scale in AR Mode */
//------------------------------------------------------------------------------------------------------
const modelViewer = document.querySelector('#model');
const scaleDisplay = document.querySelector('#info');
let scale_temp = 0;
console.log('get scale function test outer ');
function updateScaleDisplay() {
    console.log('get scale function test inner');
    const scale = modelViewer.cModelScale;
    console.log('get scale function test inner output: ', scale);
    if (scale) {
        const scalePercentage = (scale.x * 100).toFixed(0); // Assuming uniform scaling
        scale_temp=(scalePercentage-100)/100;
        scaleDisplay.textContent = `Scale: ${scale_temp}%`;
    }
}

modelViewer.addEventListener('load', updateScaleDisplay);
modelViewer.addEventListener('camera-change', updateScaleDisplay);

//----------------------------------------------------------------------------------------------------------
/** */
//----------------------------------------------------------------------------------------------------------


const checkbox = modelViewer.querySelector('#show-dimensions');

const dimElements = [...modelViewer.querySelectorAll('button'), modelViewer.querySelector('#dimLines')];

function setVisibility(visible) {
  dimElements.forEach((element) => {
    if (visible) {
      element.classList.remove('hide');
    } else {
      element.classList.add('hide');
    }
  });
}

checkbox.addEventListener('change', () => {
  setVisibility(checkbox.checked);
});

modelViewer.addEventListener('ar-status', (event) => {
  setVisibility(checkbox.checked && event.detail.status !== 'session-started');
});

// update svg
function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
  if (dotHotspot1 && dotHotspot2) {
    svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
    svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
    svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
    svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

    // use provided optional hotspot to tie visibility of this svg line to
    if (dimensionHotspot && !dimensionHotspot.facingCamera) {
      svgLine.classList.add('hide');
    }
    else {
      svgLine.classList.remove('hide');
    }
  }
}

const dimLines = modelViewer.querySelectorAll('line');

const renderSVG = () => {
  drawLine(dimLines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
  drawLine(dimLines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
  drawLine(dimLines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z')); // always visible
  drawLine(dimLines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
  drawLine(dimLines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
};

modelViewer.addEventListener('load', () => {
  const center = modelViewer.getBoundingBoxCenter();
  const size = modelViewer.getDimensions();
  const x2 = size.x / 2;
  const y2 = size.y / 2;
  const z2 = size.z / 2;

  modelViewer.updateHotspot({
    name: 'hotspot-dot+X-Y+Z',
    position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim+X-Y',
    position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
      `${(size.z * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot+X-Y-Z',
    position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim+X-Z',
    position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
      `${(size.y * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot+X+Y-Z',
    position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim+Y-Z',
    position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
      `${(size.x * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot-X+Y-Z',
    position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim-X-Z',
    position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
      `${(size.y * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot-X-Y-Z',
    position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
    name: 'hotspot-dim-X-Y',
    position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
      `${(size.z * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: 'hotspot-dot-X-Y+Z',
    position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
  });

  renderSVG();

  modelViewer.addEventListener('camera-change', renderSVG);
});

modelViewer.updateFraming();
