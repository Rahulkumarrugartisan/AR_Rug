//**---------------------------------------------------------------------------------------------------------- */
/** This script is developed by Rahul kumar for Rug Artisan Ltd*/
/**This script handles all the freature in the AR web viewer (such as texture change, material change...etc) */
//**---------------------------------------------------------------------------------------------------------- */

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
    console.log("shape name: " + shapename);
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
        const param2 = params.get('shape'); // Decodes 'value%202' to 'value 2'

        const textureUrl = await loadImageAsTexture(svgTextureUrl);

        //const blob = await response.blob();
        //const blobUrl = URL.createObjectURL(blob);

        console.log('data:', param1);
        console.log('shape:', param2);
        change_Rug_Shape(param2, modelViewerTexture1);
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
            if (!material) {
                console.error('Material not found');
                return;
            }

            // Create and apply the texture
            const texture = await modelViewerTexture1.createTexture(textureUrl);
            const normal_texture = await modelViewerTexture1.createTexture("Material_Texture/Fabric_Towel_01_normal.jpg");
            const roughtness_texture = await modelViewerTexture1.createTexture("Material_Texture/Fabric_Towel_01_roughness.jpg");
            const oc_texture = await modelViewerTexture1.createTexture("Material_Texture/Fabric_Towel_01_height1.jpg");
            if (material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                material.normalTexture.setTexture(normal_texture);
                material.pbrMetallicRoughness.metallicRoughnessTexture.setTexture(roughtness_texture);
                material.occlusionTexture.setTexture(oc_texture);

                const nor_sampler = material.normalTexture.texture.sampler;
                const mr_sampler = material.pbrMetallicRoughness.metallicRoughnessTexture.texture.sampler;
                const oc_sampler = material.occlusionTexture.texture.sampler;

                mr_sampler.setScale({ u: 4, v: 4 });
                nor_sampler.setScale({ u: 4, v: 4 });
                oc_sampler.setScale({ u: 4, v: 4 });

            } else {
                console.error('Material does not support pbrMetallicRoughness');
            }

        } catch (error) {
            console.error('An error occurred while applying the texture:', error);
        }
    });
});