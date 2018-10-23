#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

#define ITERATIONS 4

float random(vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        437589.5453123);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

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
    mouse *= 16.;
    mouse.x *= u_resolution.x / u_resolution.y;

    st = rotate2d(u_time) * st;

    vec3 color = vec3(0.);
    vec2 z = max(min(length(mouse), 0.9), 0.81)*st;
    vec2 c = vec2(mouse);

    for (int i = 0; i < ITERATIONS; i++) {
	z = cpx_mul(z, cpx_mul(z, cpx_mul(z, z))) + c;
	if (escapes(z)) {
	    return;
	}
	color = vec3(z.x, z.y+z.x, c.x+z.x);
    }

    // Set fragment color.
    gl_FragColor = vec4(color, 1.0);
}
