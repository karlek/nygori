#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec2 u = st;

	float dist = distance(st, vec2(0.5, 0.5));
	float t = u_time/7e5;
	u.x += t-0.8;
	float v = smoothstep(0.15, .3, noise(u*1e6));

	if (st.y<0.3) {
	    v -= smoothstep(0.10, 0.95, noise(u*1e6));
	}
	v = plot(st, v);

	vec3 color = vec3(0.8*v, 0.8*v, 0.8*v);
	if (st.y+st.x*0.170+1.05<1.4) {
	    color *= vec3(0.6,0.6,0.8);
	}

	float letterbox = 0.1;
	if (st.y < letterbox || st.y > 1.-letterbox) {
	    color = vec3(0.);
	}

	// Set fragment color.
	gl_FragColor = vec4(color, 1.0);
}
