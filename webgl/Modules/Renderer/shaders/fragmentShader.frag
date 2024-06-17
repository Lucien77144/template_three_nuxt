uniform sampler2D uScene0;
uniform sampler2D uScene1;
uniform float uTime;
uniform float uTransition;
uniform vec2 uCursor;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    vec2 scene0UV = vec2(uv.x,uv.y+uTransition);
    vec4 scene0 = texture2D(uScene0, scene0UV);

    vec2 scene1UV = vec2(uv.x,uv.y-(1.0-uTransition));
    vec4 scene1 = texture2D(uScene1, scene1UV);

    gl_FragColor = mix(scene0, scene1, uTransition);
    #include <colorspace_fragment> // To fix colors problems when using render targets
    // #include <tonemapping_fragment> // To fix tonemapping problems when using render targets (only if tone mapping is enabled)
}