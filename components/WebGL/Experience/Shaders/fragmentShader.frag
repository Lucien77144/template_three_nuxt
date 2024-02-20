uniform sampler2D uScene1;
uniform sampler2D uScene2;
uniform float uTime;
uniform float uTransition;
uniform float uDuration;
uniform float uStart;
varying vec2 vUv;

float cubicBezier(float t, float a, float b, float c, float d) {
    float tt = t*t, ttt = tt*t;
    return a + (b*t) + (c*tt) + (d*ttt);
}

float clampedSine(float t, float magnitude) {
    return (1. + cos(t)) / 2. * magnitude; 
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float luminance(vec3 rgb) {
    return dot(rgb, vec3(.299, .587, .114));
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// ------------------------------

void main() {
    vec2 uv = vUv;
    vec4 scene1 = texture2D(uScene1, uv);
    vec4 scene2 = texture2D(uScene2, uv);

    float t = (uTime - uStart) / uDuration;
    float factor = cubicBezier(t, .0, 1., 1., -1.);

    gl_FragColor = mix(scene1, scene2, factor);
}