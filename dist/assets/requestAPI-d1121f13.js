import{aC as o}from"./index-e0be0293.js";const n=async r=>{try{return console.log("DATA USING",r.createdByUserId),(await o.post("/request",r)).data}catch(e){throw console.error("Error creating request:",e.message),e}},c=async(r,e)=>{try{return(await o.put(`/request/${r}`,e)).data}catch(t){throw console.error("Error updating request-update:",t.message),t}},u=async(r,e)=>{try{return(await o.put(`/request/uploadBlockchain/${r}`,e,{headers:{"Content-Type":"multipart/form-data"}})).data}catch(t){throw console.error("Error updating request to blockchain:",t.message),t}},p=async(r,e,t)=>{try{return(await o.put(`/request/${r}`,e,{headers:{Authorization:`Bearer ${t}`}})).data}catch(s){throw console.error("Error updating request with token:",s.message),s}},i=async(r,e,t)=>{try{const s=await o.put(`/request/verify/${r}`,e,{headers:{Authorization:`Bearer ${t}`}});return console.log(s.data),s.data}catch(s){throw console.error("Error verifying request:",s.message),s}},h=async r=>{try{const e=new FormData;for(let s=0;s<r.length;s++)e.append("images",r[s]);const t=await o.post("/request/uploadImages",e,{headers:{"Content-Type":"multipart/form-data"}});return console.log("Response to upload",t),t.data}catch(e){throw console.error("Error uploading images:",e.message),e}},d=async(r,e,t)=>{try{return(await o.put(`/request/${r}`,e)).data}catch(s){throw console.error("Error updating request review:",s.message),s}},y=async r=>{try{return(await o.delete(`/request/${r}`)).data}catch(e){throw console.error("Error deleting request:",e.message),e}},g=async r=>{try{return(await o.get(`/request/${r}`)).data}catch(e){throw console.error("Error fetching request:",e.message),e}},l=async r=>{try{return(await o.get(`/request/byCompany/${r}`)).data}catch(e){throw console.error("Error fetching requests for company:",e.message),e}},q=async(r,e)=>{try{return(await o.get(`/request/bySupplierEmployee/${e}`,{headers:{Authorization:`Bearer ${r}`}})).data}catch(t){throw console.error("Error fetching requests for user:",t.message),t}};export{g as a,p as b,n as c,y as d,u as e,q as f,l as g,h,d as r,c as u,i as v};
