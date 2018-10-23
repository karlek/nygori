#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_delta;
uniform vec2 u_resolution;

#define PI 3.14159265359

float randNorm() {
	return 0.75 + sin(u_time)/4.;
}

float randNormTrue() {
	return 0.5 + sin(u_time)/2.;
}


float random(vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        437589.5453123);
}

float plot(vec2 st, float pct){
	return  smoothstep( pct-0.01, pct, st.y) -
		smoothstep( pct, pct+0.01, st.y);
}

float plotWide(vec2 st, float pct){
	return  smoothstep( pct-0.1, pct, st.y) -
		smoothstep( pct, pct+0.1, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	float dist = 0.8-distance(st, vec2(0.5, 0.5));
	vec3 color = vec3(dist, dist, dist);
	float letterbox = 0.1;
	color += (1.-dist)*vec3(0.0,0,0.2);

	float scale = 16.;
	st *= scale;
	st.y += u_time/(st.x-(2.-randNormTrue()))/1e2;
	st.y += randNorm();

	if (st.x < scale*0.15+random(st)) {
	    color *= vec3(1.0, 0.2, 0.2);
	    color *= 0.5;
	}

	st.x = st.y;
	st.x += u_time;

	float r = dist*random(floor(st));
	color *= r;

	if (mod(float(floor(st.x)), 3.) == 0.) {
	    color *= 0.8*vec3(1.,0,0);
	}	st = gl_FragCoord.xy/u_resolution.xy;
	if (st.y < letterbox || st.y > 1.-letterbox) {
	    color = vec3(0,0,0);
	}

	// Set fragment color.
	gl_FragColor = vec4(color, 1.0);
}
