#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define N normalize
#define S smoothstep
#define MN min(R.x,R.y)
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
#define hue(a) (.5+.5*sin(3.14*(a)+vec3(1,2,3)))
float rnd(vec2 p) {
	p=fract(p*vec2(12.9898,78.233));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y);
}
void cam(inout vec3 p) {
	p.yz*=rot(.5-move.y*6.3/MN);
	p.xz*=rot(-move.x*6.3/MN+T*.1);
}
void main() {
	// Preserve aspect ratio: fill screen, center fractal, letterbox if needed
	float aspect = R.x / R.y;
	vec2 uv = (FC - 0.5 * R) / min(R.x, R.y);
	vec2 st = uv;
	st*=3.;
	st+=sin(st*vec2(10,30))*.01;
	vec3 col=vec3(0),p;
	float g,e,s,
	k=mix(.0,1.,rnd(uv+T)),
	t=exp(pow((cos(min(T,1.5707963))*.5+.5),13.)),
	u=S(7.,.0,min(1.,dot(uv,uv)));
	for (float i=.0; i<40.; i++) {
		p=vec3(st,g-6.)*mix(t*.997*u,1.,fract(k*34.56));
		cam(p);
		s=6.;    
		for(int j; j<11; j++) {
			e=15.96/dot(p,p);
			s*=e;
			vec3 q=abs(p)*e-vec3(3,4,3);
			p=vec3(0,4.025,-1)-abs(q);
		}
		g+=p.y*p.y/s*.78;
		col+=(log2(s)-g*.8)/3e2*hue(t+T*.5+e*e*e);
	}
	float scanline = sin(T-uv.y*800.)*.01;
	col = max(col * 1.2, .02);
	col += scanline;
	O = vec4(col, 1);
}
