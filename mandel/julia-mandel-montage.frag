#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

#define ITERATIONS 10
#define BOX_SIZE 0.10

bool escapes(vec2 z) {
    return z.x*z.x+z.y*z.y >= 4.;
}

vec2 cpx_mul(in vec2 z, in vec2 w) {
    return vec2(z.x * w.x - z.y * w.y, z.y * w.x + z.x * w.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // Center the viewspace around origo.
    st -= 0.5;

    // Scale the viewspace to -2 to 2.
    st *= 4.;

    // Fix the aspect ratio.
    st.x *= u_resolution.x / u_resolution.y;

    float x = mod(st.x, BOX_SIZE);
    float y = mod(st.y, BOX_SIZE);

    x *= 4e1;
    y *= 4e1;

    x -= 2.;
    y -= 2.;

    x *= 0.7;
    y *= 0.7;

    vec2 u = vec2(x, y);

    // Fix the aspect ratio.
    u.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.);

    vec2 z = u;
    vec2 c = st;
    for (int i = 0; i < ITERATIONS; i++) {
	z = cpx_mul(z, z) + c;
	if (escapes(z)) {
	    float f = float(i)/float(ITERATIONS);
	    color = vec3(f);
	    break;	
	}
    }

    gl_FragColor = vec4(color, 1.);
}
