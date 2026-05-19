import * as THREE from 'three';

const textureCache = new Map();

const prepareTexture = (texture) => {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

export const getLiquidProjectTexture = (src) => textureCache.get(src) || null;

export const loadLiquidProjectTexture = (src, onLoad, onError) => {
  const cachedTexture = getLiquidProjectTexture(src);
  if (cachedTexture) {
    onLoad(cachedTexture);
    return () => {};
  }

  let active = true;
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  loader.load(src, (loadedTexture) => {
    if (!active) {
      loadedTexture.dispose();
      return;
    }

    const texture = prepareTexture(loadedTexture);
    textureCache.set(src, texture);
    onLoad(texture);
  }, undefined, () => {
    if (active) onError();
  });

  return () => {
    active = false;
  };
};

export const preloadLiquidProjectTexture = (src) => {
  if (!src || textureCache.has(src)) return;
  loadLiquidProjectTexture(src, () => {}, () => {});
};
