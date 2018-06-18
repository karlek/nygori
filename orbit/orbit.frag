#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

#define ITERATIONS 15
#define ORBIT_ITERATIONS 50

bool escapes(vec2 z) {
    return z.x*z.x+z.y*z.y >= 4.;
}

vec2 cpx_mul(in vec2 z, in vec2 w) {
    return vec2(z.x * w.x - z.y * w.y, z.y * w.x + z.x * w.y);
}

void main() {
    // Normalize viewport.
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // Center the viewspace around origo.
    st -= 0.5;
    // Scale the viewspace to -2 to 2.
    st *= 4.;

    // Fix the aspect ratio.
    st.x *= u_resolution.x / u_resolution.y;

    // Normalize viewport.
    vec2 mouse = u_mouse.xy/u_resolution.xy;
    // Center around origo.
    mouse -= 0.5;
    // Scale to -2 to 2.
    mouse *= 4.;
    mouse.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.);
    vec2 z = vec2(0.);
    vec2 c = st;

    float border_width = 0.01;

    for (int i = 0; i < ITERATIONS; i++) {
	/* z = cpx_mul(z, c) + c; */
	/* z = cpx_mul(z, z) / c; */
	z = cpx_mul(z, z) + c;
	/* z = cpx_mul(z, cpx_mul(z, z))/c + c+(1./2.+sin(u_time)/2.); */
	if (escapes(z)) {
	    break;	
	}
	float f = float(i)/float(ITERATIONS);
	color = 0.2*vec3(0, f, f);
    }

    z = vec2(0.);
    c = mouse;

    for (int i = 0; i < ORBIT_ITERATIONS; i++) {
	/* z = cpx_mul(z, c) + c; */
	/* z = cpx_mul(z, z) / c; */
	z = cpx_mul(z, z) + c;
	if (escapes(z)) {
	    break;	
	}
	/* z = cpx_mul(z, cpx_mul(z, z))/c + c+(1./2.+sin(u_time)/2.); */
	if (z.x < st.x+border_width && z.x > st.x-border_width && z.y < st.y+border_width && z.y > st.y-border_width) {
	    if (i == ITERATIONS) {
		/* Show which iteration we check converges as green. */
		color = vec3(0., 1., 0.);
	    } else {
		/* Color orbit points from red to white. */
		float f = float(i)/float(ORBIT_ITERATIONS);
		color = vec3(1., f, f);
	    }
	}
    }

    // Set fragment color.
    gl_FragColor = vec4(color, 1.0);
}
