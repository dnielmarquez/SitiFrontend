import{d as s,j as r,r as h,u as x,B as j,L as v,R as g,S as b,T as d,a as c,b as N,e as f,c as y}from"./index-59e4e7c3.js";import{c as C,a as o,u as w}from"./formik.esm-5867d909.js";import{S}from"./seo-eaf4d21a.js";import{b as z}from"./index-cc134824.js";import{F as i,a as l,T as t,b as n}from"./TextField-6c56cbee.js";s(r.jsx("path",{d:"M7 10l5 5 5-5z"}),"ArrowDropDown");const B=s(r.jsx("path",{d:"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"}),"ArrowLeft");s(r.jsx("path",{d:"M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"}),"ArrowRight");s(r.jsx("path",{d:"M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"}),"Calendar");s(r.jsxs(h.Fragment,{children:[r.jsx("path",{d:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),r.jsx("path",{d:"M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"})]}),"Clock");s(r.jsx("path",{d:"M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"}),"DateRange");s(r.jsxs(h.Fragment,{children:[r.jsx("path",{d:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),r.jsx("path",{d:"M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"})]}),"Time");global.Buffer=z.Buffer;const M={employeeName:"",supplierName:"",position:"",email:"",contactNumber:"",password:""},q=C({employeeName:o().required("Employee name is required"),supplierName:o().required("Supplier name is required"),position:o().required("Position is required"),email:o().email("Invalid email").required("Email is required"),contactNumber:o().matches(/^[0-9]+$/,"Must be only digits").min(10,"Must be at least 10 digits").required("Contact number is required"),password:o().min(8,"Password should be at least 8 characters").required("Password is required")}),P=()=>{const{goToPage:m}=x(),e=w({initialValues:M,validationSchema:q,onSubmit:async u=>{let p=u;p.role="SUPPLIER";const a=await f(u);a.error?a.error=="email is already taken."?e.setFieldError("email",a.message):e.setStatus(a.message):a.token&&(y.set("token",a.token,{expires:7}),m("/"))}});return r.jsxs(r.Fragment,{children:[r.jsx(S,{title:"Register as a Supplier"}),r.jsxs("div",{children:[r.jsx(j,{sx:{mb:4},children:r.jsxs(v,{color:"text.primary",component:g,href:"/auth/login",sx:{alignItems:"center",display:"inline-flex"},underline:"hover",children:[r.jsx(b,{sx:{mr:1},children:r.jsx(B,{})}),r.jsx(d,{variant:"subtitle2",children:"Go back"})]})}),r.jsxs(c,{sx:{mb:4},spacing:1,children:[r.jsx(d,{variant:"h5",children:"Join as a Supplier!"}),r.jsx(d,{color:"text.secondary",variant:"body2",children:"Fill in the fields below to become a Supplier"})]}),r.jsx("form",{noValidate:!0,onSubmit:e.handleSubmit,children:r.jsxs(c,{spacing:2,direction:"column",children:[e.status&&r.jsx(d,{color:"error",variant:"body2",children:e.status}),r.jsxs(i,{error:!!(e.touched.employeeName&&e.errors.employeeName),children:[r.jsx(l,{children:"Employee Name"}),r.jsx(t,{fullWidth:!0,name:"employeeName",onBlur:e.handleBlur,onChange:e.handleChange,value:e.values.employeeName}),!!(e.touched.employeeName&&e.errors.employeeName)&&r.jsx(n,{children:e.errors.employeeName})]}),r.jsxs(i,{error:!!(e.touched.supplierName&&e.errors.supplierName),children:[r.jsx(l,{children:"Supplier Name"}),r.jsx(t,{fullWidth:!0,name:"supplierName",onBlur:e.handleBlur,onChange:e.handleChange,value:e.values.supplierName}),!!(e.touched.supplierName&&e.errors.supplierName)&&r.jsx(n,{children:e.errors.supplierName})]}),r.jsxs(i,{error:!!(e.touched.position&&e.errors.position),children:[r.jsx(l,{children:"Position"}),r.jsx(t,{fullWidth:!0,name:"position",onBlur:e.handleBlur,onChange:e.handleChange,value:e.values.position}),!!(e.touched.position&&e.errors.position)&&r.jsx(n,{children:e.errors.position})]}),r.jsxs(i,{error:!!(e.touched.email&&e.errors.email),children:[r.jsx(l,{children:"Email Address"}),r.jsx(t,{fullWidth:!0,name:"email",onBlur:e.handleBlur,onChange:e.handleChange,value:e.values.email}),!!(e.touched.email&&e.errors.email)&&r.jsx(n,{children:e.errors.email})]}),r.jsxs(i,{error:!!(e.touched.contactNumber&&e.errors.contactNumber),children:[r.jsx(l,{children:"Contact Number"}),r.jsx(t,{fullWidth:!0,name:"contactNumber",onBlur:e.handleBlur,onChange:e.handleChange,value:e.values.contactNumber}),!!(e.touched.contactNumber&&e.errors.contactNumber)&&r.jsx(n,{children:e.errors.contactNumber})]}),r.jsxs(i,{error:!!(e.touched.password&&e.errors.password),children:[r.jsx(l,{children:"Password"}),r.jsx(t,{fullWidth:!0,type:"password",name:"password",onBlur:e.handleBlur,onChange:e.handleChange,value:e.values.password}),!!(e.touched.password&&e.errors.password)&&r.jsx(n,{children:e.errors.password})]}),r.jsx(N,{fullWidth:!0,size:"large",sx:{mt:3},type:"submit",variant:"contained",children:"Register"})]})})]})]})};export{P as default};
