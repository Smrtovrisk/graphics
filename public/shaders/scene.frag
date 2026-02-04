// Crystal Tunnel Shader - Adapted for glsl-canvas-js (WebGL1)

precision highp float;

#define PI 3.14159265359
#define MAX_STEPS 60
#define MAX_DIST 50.0
#define SURF_DIST 0.003

mat2 rot(float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x+p.y+p.z-s)*0.57735027;
}

float sdCross(vec3 p, float s) {
    float da = sdBox(p.xyz, vec3(s*3.0, s, s));
    float db = sdBox(p.yzx, vec3(s, s*3.0, s));
    float dc = sdBox(p.zxy, vec3(s, s, s*3.0));
    return min(da, min(db, dc));
}

float scene(vec3 p, float time) {
    float tunnelLen = 4.0;
    float id = floor(p.z / tunnelLen);
    p.z = mod(p.z, tunnelLen) - tunnelLen * 0.5;
    p.xy *= rot(id * 0.4 + time * 0.15);
    float morph = sin(time * 0.5 + id * 0.7) * 0.5 + 0.5;
    float oct = sdOctahedron(p, 1.0 + sin(time + id) * 0.2);
    float cross = sdCross(p, 0.25);
    float crystal = mix(oct, cross, morph);
    float walls = -sdBox(p, vec3(2.8, 2.8, tunnelLen * 0.5));
    return max(crystal, walls);
}

vec3 getNormal(vec3 p, float time) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        scene(p + e.xyy, time) - scene(p - e.xyy, time),
        scene(p + e.yxy, time) - scene(p - e.yxy, time),
        scene(p + e.yyx, time) - scene(p - e.yyx, time)
    ));
}

float rayMarch(vec3 ro, vec3 rd, float time) {
    float d = 0.0;
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * d;
        float ds = scene(p, time);
        d += ds;
        if(d > MAX_DIST || abs(ds) < SURF_DIST) break;
    }
    return d;
}

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    float time = u_time;
    float camSpeed = time * 2.5;
    vec3 ro = vec3(0.0, 0.0, camSpeed);
    vec2 mouse = u_mouse / max(u_resolution, vec2(1.0)) * 2.0;
    vec3 rd = normalize(vec3(uv, 1.0));
    rd.yz *= rot(-mouse.y * 0.4);
    rd.xz *= rot(-mouse.x * 0.4);
    ro.x += sin(time * 0.7) * 0.4;
    ro.y += cos(time * 0.5) * 0.3;
    float d = rayMarch(ro, rd, time);
    vec3 col = vec3(0.0);
    if(d < MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 n = getNormal(p, time);
        float depth = mod(p.z, 4.0) / 4.0;
        vec3 baseCol = palette(depth + time * 0.1);
        float fresnel = pow(1.0 - abs(dot(n, rd)), 3.0);
        vec3 lightDir = normalize(vec3(sin(time), cos(time * 0.7), -1.0));
        float diff = max(dot(n, lightDir), 0.0);
        vec3 ref = reflect(rd, n);
        float spec = pow(max(dot(ref, lightDir), 0.0), 32.0);
        col = baseCol * (diff * 0.6 + 0.4);
        col += vec3(1.0, 0.9, 1.0) * spec * 0.6;
        col += baseCol / (1.0 + d * d * 0.3) * fresnel * 2.0;
        col += baseCol * fresnel * 1.2;
    }
    vec3 bg = vec3(0.02, 0.01, 0.06);
    bg += palette(uv.y * 0.5 + time * 0.05) * 0.04;
    col = mix(bg, col, exp(-d * 0.04));
    col = mix(col, bg, 1.0 - exp(-d * 0.015));
    float vig = 1.0 - length(uv) * 0.4;
    col *= vig;
    col = pow(col, vec3(0.85));
    col *= 0.96 + 0.04 * sin(fragCoord.y * 2.5);
    fragColor = vec4(col, 1.0);
}
