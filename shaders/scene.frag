// Adapted from Matthias Hurrle (@atzedent) for glsl-canvas-js (WebGL1)

precision highp float;

#define R u_resolution
#define T u_time
#define MN min(R.x,R.y)
#define S smoothstep

mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

vec3 hue(float a) {
    return 0.5 + 0.5 * sin(3.14159 * a + vec3(1,2,3));
}

float rnd(vec2 p) {
    p = fract(p * vec2(12.9898,78.233));
    p += dot(p, p + 34.56);
    return fract(p.x * p.y);
}

void cam(inout vec3 p, vec2 move) {
    p.yz *= rot(.5 - move.y * 6.3 / MN);
    p.xz *= rot(-move.x * 6.3 / MN + T * .1);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * R) / MN, st = uv;
    st *= 3.0;
    st.y += 1.0;
    st += sin(st * vec2(10.0, 30.0)) * 0.01;
    vec3 col = vec3(0.0), p;
    float g = 0.0, e = 0.0, s = 0.0;
    float k = mix(0.0, 1.0, rnd(uv + T));
    float t = exp(pow((cos(min(T, 1.5707963)) * 0.5 + 0.5), 13.0));
    float u = S(7.0, 0.0, min(1.0, dot(uv, uv)));
    for (float i = 0.0; i < 40.0; i++) {
        p = vec3(st, g - 6.0) * mix(t * 0.997 * u, 1.0, fract(k * 34.56));
        cam(p, u_mouse / R);
        s = 6.0;
        for (int j = 0; j < 11; j++) {
            e = 15.96 / max(dot(p, p), 1e-4);
            s *= e;
            vec3 q = abs(p) * e - vec3(3.0, 4.0, 3.0);
            p = vec3(0.0, 4.025, -1.0) - abs(q);
        }
        g += p.y * p.y / max(s, 1e-4) * 0.78;
        col += (log2(max(s, 1e-6)) - g * 0.8) / 300.0 * hue(t + T * 0.5 + e * e * e);
    }
    float scanline = sin(T - uv.y * 800.0) * 0.01;
    uv = fragCoord / R * 2.0 - 1.0;
    uv *= 0.95;
    uv *= uv * uv * uv * uv;
    float v = pow(dot(uv, uv), 0.8);
    col = mix(col, vec3(0.0), v);
    col = max(col * 1.2, 0.02);
    col += scanline;
    fragColor = vec4(col, 1.0);
}
