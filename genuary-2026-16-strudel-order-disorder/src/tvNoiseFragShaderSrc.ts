//keeping this as ts for now so it gets bundled without further config.

/** @AI: gemini (LLM) wrote this shader for me initially */
export function tvNoiseFragShaderSrc() {
  return `
  precision highp float;
  varying vec2 vTexCoord;
  uniform sampler2D tex0;
  uniform float time;
  uniform float distortionAmount;

  float noise(float p) {
    return fract(sin(p) * 43758.5453123);
  }

  void main() {
    vec2 uv = vTexCoord;
    
    // Calculate row-based jitter
    
    //find out what row this pixel is on (0-50)
    float row = floor(uv.y * 50.0); 
    //all pixels in a given row at same time will have the same jitter value.
    float jitter = noise(row + time) * 2.0 - 1.0;
    
    // Only apply offset to specific random rows
    if (noise(row + time * 0.5) > 0.7) {
      uv.x += jitter * distortionAmount;
    }
    //sample the pixel colour from the framebuffer at this distorted coord
    vec4 color = texture2D(tex0, uv);
    
    //use that other pixel's colour as our output colour for this pixel
    gl_FragColor = vec4(color.rgb, 1.0);
  }`;
}
