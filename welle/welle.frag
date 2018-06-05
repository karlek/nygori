#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359

float randNorm() {
	return 0.75 + sin(u_time)/4.;
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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	float r = randNorm();
	float scale = PI*2.*r;
	// Scale our viewspace.
	st *= scale;
	st.x *= u_resolution.x/u_resolution.y;

	// Black background.
	vec3 color = vec3(0);

	// Number of sine waves.
	int max = 22;
	for (int i = 0; i <= max; i++) {
		// Ratio.
		float r = float(i)/float(max);
		
		float frequency = st.x*r*PI*2./3.;
		float phase = u_time + PI/float(max)*float(i);
		float inner = frequency + phase;

		// We want to center the sin-wave.
		float y_center = scale/2.*(0.8-r)*2.5;

		// The amplitude is scaled with _r_.
		float y = r*sin(inner)+y_center;
		float norm_y = 0.5+(y-y_center)/2.;

		float offset = 4.*r/PI;
		float y_shift = r*sin(inner + offset)+y_center;
		float norm_y_shift = 0.5+(y_shift-y_center)/2.;

		float pct = plot(st,y);

		color = (1.0-pct)*color+pct*vec3(norm_y, norm_y_shift, 0.75);
		color *= clamp(r, 0.96, 1.);
	}

	// Set fragment color.
	gl_FragColor = vec4(color, 1.0);
}
