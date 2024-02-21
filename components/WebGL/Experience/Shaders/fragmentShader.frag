uniform sampler2D uScene0;
uniform sampler2D uScene1;
uniform float uTime;
uniform float uTransition;
uniform float uDuration;
uniform float uStart;
varying vec2 vUv;

// ------------------------------

void main() {
    vec2 uv = vUv;
    vec4 scene0 = texture2D(uScene0, uv);
    vec4 scene1 = texture2D(uScene1, uv);

    float t = smoothstep(0., 1., (uTime - uStart) / uDuration);
    float i = 1.0 - step(1.0, t);

    gl_FragColor = mix(scene0, scene1, t*i);
}