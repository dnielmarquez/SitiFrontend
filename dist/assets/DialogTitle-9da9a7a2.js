import{y as f,z as D,r as p,A as d,a2 as V,O as Z,C as x,_ as a,Z as B,E as h,a3 as q,F as C,a4 as G,j as c,I as g,J as b,a5 as Q,T as A,a6 as oo}from"./index-b1fd94f3.js";function eo(o){return D("MuiDialog",o)}const to=f("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]),$=to,so=p.createContext({}),j=so,ao=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],io=d(V,{name:"MuiDialog",slot:"Backdrop",overrides:(o,e)=>e.backdrop})({zIndex:-1}),no=o=>{const{classes:e,scroll:t,maxWidth:s,fullWidth:n,fullScreen:i}=o,r={root:["root"],container:["container",`scroll${x(t)}`],paper:["paper",`paperScroll${x(t)}`,`paperWidth${x(String(s))}`,n&&"paperFullWidth",i&&"paperFullScreen"]};return b(r,eo,e)},ro=d(Z,{name:"MuiDialog",slot:"Root",overridesResolver:(o,e)=>e.root})({"@media print":{position:"absolute !important"}}),lo=d("div",{name:"MuiDialog",slot:"Container",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.container,e[`scroll${x(t.scroll)}`]]}})(({ownerState:o})=>a({height:"100%","@media print":{height:"auto"},outline:0},o.scroll==="paper"&&{display:"flex",justifyContent:"center",alignItems:"center"},o.scroll==="body"&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})),co=d(B,{name:"MuiDialog",slot:"Paper",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.paper,e[`scrollPaper${x(t.scroll)}`],e[`paperWidth${x(String(t.maxWidth))}`],t.fullWidth&&e.paperFullWidth,t.fullScreen&&e.paperFullScreen]}})(({theme:o,ownerState:e})=>a({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},e.scroll==="paper"&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},e.scroll==="body"&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!e.maxWidth&&{maxWidth:"calc(100% - 64px)"},e.maxWidth==="xs"&&{maxWidth:o.breakpoints.unit==="px"?Math.max(o.breakpoints.values.xs,444):`max(${o.breakpoints.values.xs}${o.breakpoints.unit}, 444px)`,[`&.${$.paperScrollBody}`]:{[o.breakpoints.down(Math.max(o.breakpoints.values.xs,444)+32*2)]:{maxWidth:"calc(100% - 64px)"}}},e.maxWidth&&e.maxWidth!=="xs"&&{maxWidth:`${o.breakpoints.values[e.maxWidth]}${o.breakpoints.unit}`,[`&.${$.paperScrollBody}`]:{[o.breakpoints.down(o.breakpoints.values[e.maxWidth]+32*2)]:{maxWidth:"calc(100% - 64px)"}}},e.fullWidth&&{width:"calc(100% - 64px)"},e.fullScreen&&{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,[`&.${$.paperScrollBody}`]:{margin:0,maxWidth:"100%"}})),po=p.forwardRef(function(e,t){const s=h({props:e,name:"MuiDialog"}),n=q(),i={enter:n.transitions.duration.enteringScreen,exit:n.transitions.duration.leavingScreen},{"aria-describedby":r,"aria-labelledby":l,BackdropComponent:u,BackdropProps:y,children:U,className:F,disableEscapeKeyDown:w=!1,fullScreen:_=!1,fullWidth:I=!1,maxWidth:E="sm",onBackdropClick:M,onClose:W,open:R,PaperComponent:L=B,PaperProps:P={},scroll:Y="paper",TransitionComponent:z=Q,transitionDuration:N=i,TransitionProps:K}=s,X=C(s,ao),v=a({},s,{disableEscapeKeyDown:w,fullScreen:_,fullWidth:I,maxWidth:E,scroll:Y}),k=no(v),S=p.useRef(),H=m=>{S.current=m.target===m.currentTarget},O=m=>{S.current&&(S.current=null,M&&M(m),W&&W(m,"backdropClick"))},T=G(l),J=p.useMemo(()=>({titleId:T}),[T]);return c.jsx(ro,a({className:g(k.root,F),closeAfterTransition:!0,components:{Backdrop:io},componentsProps:{backdrop:a({transitionDuration:N,as:u},y)},disableEscapeKeyDown:w,onClose:W,open:R,ref:t,onClick:O,ownerState:v},X,{children:c.jsx(z,a({appear:!0,in:R,timeout:N,role:"presentation"},K,{children:c.jsx(lo,{className:g(k.container),onMouseDown:H,ownerState:v,children:c.jsx(co,a({as:L,elevation:24,role:"dialog","aria-describedby":r,"aria-labelledby":T},P,{className:g(k.paper,P.className),ownerState:v,children:c.jsx(j.Provider,{value:J,children:U})}))})}))}))}),jo=po;function uo(o){return D("MuiDialogActions",o)}f("MuiDialogActions",["root","spacing"]);const go=["className","disableSpacing"],xo=o=>{const{classes:e,disableSpacing:t}=o;return b({root:["root",!t&&"spacing"]},uo,e)},mo=d("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.root,!t.disableSpacing&&e.spacing]}})(({ownerState:o})=>a({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},!o.disableSpacing&&{"& > :not(:first-of-type)":{marginLeft:8}})),fo=p.forwardRef(function(e,t){const s=h({props:e,name:"MuiDialogActions"}),{className:n,disableSpacing:i=!1}=s,r=C(s,go),l=a({},s,{disableSpacing:i}),u=xo(l);return c.jsx(mo,a({className:g(u.root,n),ownerState:l,ref:t},r))}),Uo=fo;function Do(o){return D("MuiDialogContent",o)}f("MuiDialogContent",["root","dividers"]);function ho(o){return D("MuiDialogTitle",o)}const Co=f("MuiDialogTitle",["root"]),bo=Co,vo=["className","dividers"],yo=o=>{const{classes:e,dividers:t}=o;return b({root:["root",t&&"dividers"]},Do,e)},Wo=d("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(o,e)=>{const{ownerState:t}=o;return[e.root,t.dividers&&e.dividers]}})(({theme:o,ownerState:e})=>a({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},e.dividers?{padding:"16px 24px",borderTop:`1px solid ${(o.vars||o).palette.divider}`,borderBottom:`1px solid ${(o.vars||o).palette.divider}`}:{[`.${bo.root} + &`]:{paddingTop:0}})),ko=p.forwardRef(function(e,t){const s=h({props:e,name:"MuiDialogContent"}),{className:n,dividers:i=!1}=s,r=C(s,vo),l=a({},s,{dividers:i}),u=yo(l);return c.jsx(Wo,a({className:g(u.root,n),ownerState:l,ref:t},r))}),Fo=ko;function So(o){return D("MuiDialogContentText",o)}f("MuiDialogContentText",["root"]);const To=["children","className"],$o=o=>{const{classes:e}=o,s=b({root:["root"]},So,e);return a({},e,s)},wo=d(A,{shouldForwardProp:o=>oo(o)||o==="classes",name:"MuiDialogContentText",slot:"Root",overridesResolver:(o,e)=>e.root})({}),Mo=p.forwardRef(function(e,t){const s=h({props:e,name:"MuiDialogContentText"}),{className:n}=s,i=C(s,To),r=$o(i);return c.jsx(wo,a({component:"p",variant:"body1",color:"text.secondary",ref:t,ownerState:i,className:g(r.root,n)},s,{classes:r}))}),_o=Mo,Ro=["className","id"],Po=o=>{const{classes:e}=o;return b({root:["root"]},ho,e)},No=d(A,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(o,e)=>e.root})({padding:"16px 24px",flex:"0 0 auto"}),Bo=p.forwardRef(function(e,t){const s=h({props:e,name:"MuiDialogTitle"}),{className:n,id:i}=s,r=C(s,Ro),l=s,u=Po(l),{titleId:y=i}=p.useContext(j);return c.jsx(No,a({component:"h2",className:g(u.root,n),ownerState:l,ref:t,variant:"h6",id:i??y},r))}),Io=Bo;export{jo as D,Io as a,Fo as b,_o as c,Uo as d};