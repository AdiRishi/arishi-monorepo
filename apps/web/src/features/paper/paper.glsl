#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes; uniform vec4 uBox; uniform vec2 uTip;
uniform float uLatinF; uniform float uBodyF; uniform float uHeadF; uniform float uTipOn;
uniform sampler2D uInk; uniform sampler2D uDraw; uniform sampler2D uWash;

float hash(vec2 q){ vec3 p3=fract(vec3(q.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float noise(vec2 q){ vec2 i=floor(q), f=fract(q); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 q){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(q); q=q*2.03+1.7; a*=0.5; } return v; }

vec3 paper(vec2 uv, float asp){
  vec2 q=uv*vec2(asp,1.0);
  float blotch=fbm(q*5.0), fibreH=noise(q*vec2(900.0,110.0)), fibreV=noise(q*vec2(130.0,900.0)), grain=hash(uv*uRes);
  vec3 c=vec3(0.945,0.915,0.855);
  c-=vec3(0.06,0.07,0.09)*(blotch-0.5);
  c-=vec3(0.04)*(fibreH-0.5)+vec3(0.03)*(fibreV-0.5);
  c-=vec3(0.035)*(grain-0.5);
  float vig=smoothstep(1.6,0.5,length((uv-0.5)*vec2(1.2,1.0)));
  return c*(0.9+0.1*vig);
}
vec4 blur5(sampler2D t, vec2 uv){
  vec2 texel=1.0/vec2(textureSize(t,0));
  vec4 s=texture(t,uv);
  s+=texture(t,uv+vec2(texel.x*1.6,0.0)); s+=texture(t,uv-vec2(texel.x*1.6,0.0));
  s+=texture(t,uv+vec2(0.0,texel.y*1.6)); s+=texture(t,uv-vec2(0.0,texel.y*1.6));
  return s/5.0;
}

void main(){
  vec2 uv = vec2(gl_FragCoord.x/uRes.x, 1.0-gl_FragCoord.y/uRes.y);
  float asp=uRes.x/uRes.y;

  vec2 bs=uBox.zw-uBox.xy; vec2 m=(uv-uBox.xy)/bs;
  float inside=step(0.0,m.x)*step(m.x,1.0)*step(0.0,m.y)*step(m.y,1.0);
  vec2 mc=clamp(m,0.0,1.0);
  vec4 s0=texture(uInk,mc); vec4 sb=blur5(uInk,mc);
  float order=s0.a;
  float rLat=smoothstep(uLatinF,uLatinF-0.012,order), rBody=smoothstep(uBodyF,uBodyF-0.012,order), rHead=smoothstep(uHeadF,uHeadF-0.012,order);
  float aName=(s0.r*rLat+s0.g*rBody+s0.b*rHead)*inside;
  float abName=(sb.r*rLat+sb.g*rBody+sb.b*rHead)*inside;
  float isBody=step(s0.r,s0.g), isHead=step(max(s0.r,s0.g),s0.b);
  float front=mix(uLatinF, mix(uBodyF,uHeadF,isHead), isBody);
  float wetName=exp(-max(front-order,0.0)*7.0)*step(0.02,aName);

  vec4 d0=texture(uDraw,uv); vec4 db=blur5(uDraw,uv);
  float a=max(aName,d0.r), ab=max(abName,db.r), wet=max(wetName,d0.g);

  float fibre=fbm(uv*vec2(asp,1.0)*240.0);
  float cov=ab*0.65+a*0.35;
  float ink=smoothstep(0.40-0.22*fibre,0.56,cov);
  float pool=smoothstep(0.08,0.5,cov)*(1.0-smoothstep(0.55,1.0,cov));
  float gran=noise(uv*uRes*0.45);
  vec3 inkCol=vec3(0.075,0.075,0.105)+vec3(0.11)*gran;
  inkCol=mix(inkCol,vec3(0.03,0.03,0.05),pool*0.85);
  inkCol+=vec3(0.22,0.28,0.42)*wet*pool;

  vec4 w0=texture(uWash,uv); vec4 wb=blur5(uWash,uv);
  float wcov=wb.a*0.7+w0.a*0.3;
  float wedge=smoothstep(0.02,0.35,wcov)*(1.0-smoothstep(0.35,0.9,wcov));
  float settle=0.8+0.4*fbm(uv*vec2(asp,1.0)*70.0);
  float wstr=clamp(smoothstep(0.03,0.45,wcov)*settle*0.9+wedge*0.35,0.0,1.0);
  vec3 tint=mix(vec3(1.0),w0.rgb*1.12,wstr);
  vec3 col=mix(paper(uv,asp)*tint,inkCol,ink*0.97);
  float td=length((uv-uTip)*uRes);
  col=mix(col,vec3(0.05,0.05,0.08),smoothstep(5.0,2.0,td)*uTipOn);
  fragColor=vec4(col,1.0);
}
