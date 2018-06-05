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
	return 0.5 + sin(u_time/1e0)/2.;
}

float plot(vec2 st, float pct){
	return  smoothstep( pct-0.1, pct, st.y) -
			smoothstep( pct, pct+0.1, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	float dist = distance(st, vec2(0.5, 0.5));
	vec3 color = vec3(1.-dist);

	vec2 pos = vec2(0.5)-st;

	float r = length(pos)*5.5;
	float a = atan(pos.y,dist*pos.x);


	float f = tan(a*3. + u_time);
	float v = plot(st, f*r*max(random(st*1e6), 0.1));
	color = vec3(v, v*(1.-dist), v*st.x);

	float c = 0.5;
	if (dist < 0.03) {
	    float t = u_time/1e4;
	    st.x = st.y*dist*1e0;
	    c = (1.-dist*4e1)*random(floor(st*512.)+t);
	} 
	if (c > 0.7 || c < 0.2) {
	    color += vec3(c*f);
	}
	color *= clamp(f, 0., 1.);

	// Set fragment color.
	gl_FragColor = vec4(color, 1.0);
}
