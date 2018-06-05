#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

#define PI 3.14159265359

float random(vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        437589.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float rand(float seed) {
    return fract(sin(seed)*1.0);
}

float randNorm() {
	return 0.75 + sin(u_time/1e0)/4.;
}

float plot(vec2 st, float pct){
	return  smoothstep( pct-0.1, pct, st.y) -
			smoothstep( pct, pct+0.1, st.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec2 u = st;

	u -= 0.5;
	u *= 1.5;
	u.x *= u_resolution.x / u_resolution.y;

	/* vec2 mouse = u_mouse - 0.5; */
	float dist = distance(vec2(0.), u);
	vec3 color = vec3(1.);

	float r = length(u);
	float a = atan(u.y, u.x);

	float f = tan(a*3. + dist*1e1-u_time/2e0);
	color = vec3(1. - smoothstep(f+0.02, f-0.02, r));

	if (dist > 1.) {
	    dist = 1.;
	}
	if (length(color) > 0.) {
	    color = f*f*f*vec3(1.0*dist, 0.6*(1.-dist), 0.9*(1.-dist));
	    color *= r*noise(u*2e1);
	    color *= noise(u*4e1);
	    color *= noise(u*8e1);
	    color /= r;

	    color -= f;
	    color *= noise(u*2e1);
	    color *= (1.-dist)*(1.-dist)*vec3(0.7*(1.-dist), 0.8*dist, dist);
	}

	if (smoothstep(0.01, 0.20, dist) < 0.01) {
	    color = vec3(dist);
	}

	/* u -= 0.5; */
	/* u.x *= u_resolution.x / u_resolution.y; */
	/* u *= 1.; */

	/* float dist = distance(vec2(0.), u); */

	/* /1* float radius = 0.1; *1/ */

	/* float a = atan(u.y, u.x); */
	/* float y = cos(a*10. + 2e0*u_time); */
	/* float r = 1.0*length(u/8.); */

	/* /1* float a = atan(u.y, u.x); *1/ */
	/* vec3 color = vec3(0.); */
	/* /1* float dist = distance(vec2(0.), u); *1/ */
	/* /1* float f = 0.005*abs(sin(u_time+u.x+u.y)); *1/ */
	/* float v = plot(u, r*y); */
	/* color = 1.6*(1.-0.3*dist)*v*vec3(0.6, 0.8, 1.); */

	float letterbox = 0.1;
	if (st.y < letterbox || st.y > 1.-letterbox) {
	    color = vec3(0,0,0);
	}
	/* float circle = smoothstep(radius-0.01-f, radius+0.01+f, dist*0.32+f); */
	/* if (u.x*u.x + u.y*u.y < radius) { */
	/*     color = vec3(0., circle, circle); */
	/* } */


	// Set fragment color.
	gl_FragColor = vec4(color, 1.0);
}
