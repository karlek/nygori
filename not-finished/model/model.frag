#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

varying vec4 v_position;
varying vec3 v_normal;

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

float plot(vec2 st, float pct){
	return  smoothstep( pct-0.1, pct, st.y) -
			smoothstep( pct, pct+0.1, st.y);
}

mat3 rotate3d(float _angle){
    return mat3(cos(_angle),-sin(_angle),0,
                sin(_angle),cos(_angle),0,
                0, 0, 1);
}


void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 u = st;

    vec3 color = vec3(0.2);
    vec3 normal = v_normal;
    normal += 1.;
    normal *= .5;
    normal *= floor(smoothstep(0.5, 0.3, noise(normal.xy*1e1+u_time)));
    normal -= floor(smoothstep(0.0, 0.3, noise(normal.xy*2e1+u_time)));
    normal /= smoothstep(0.9, 0.1, noise(normal.xy*3e2+u_time));
    /* normal *= plot(normal.xz, noise(normal.xz*1e10+u_time*1e9)); */
    /* if (length(normal) > 1. && length(normal) < 1.2) { */
    /*     normal /= random(normal.xy+u_time/1e7); */
    /* } */
    /* normal *= vec3(1.0, 0.2, 1.0); */
    /* normal -= plot(normal.xy, normal.y*normal.z*(0.75+sin(u_time)/4.)); */
    /* normal *= plot(normal.yz, length(normal)*atan(normal.y, normal.x)); */
    /* float r = 0.8*length(normal); */
    /* float f = 0.5+sin(atan(normal.y, normal.x)*2.)/2.; */
	/* color = vec3(1. - smoothstep(f+0.02, f-0.02, r)); */

    /* normal *= plot(normal.yz, log(normal.y)); */
    color = normal;
    /* color = (v_position.xyz+1.)/2.; */

    gl_FragColor = vec4(color, 1.0);
}
