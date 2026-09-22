const subjects={
dsa:{
name:"Data Structures & Algorithms",
category:"Computer Science",
image:"DSA.png",
description:"Learn arrays, linked lists, stacks, queues, trees, graphs and algorithms.",
chapters:18,
progress:72,
performance:78,
test:"dsa"
},
os:{
name:"Operating System",
category:"Computer Science",
image:"os.png",
description:"Understand processes, memory management, CPU scheduling and file systems.",
chapters:15,
progress:61,
performance:65,
test:"os"
},
java:{
name:"Java Programming",
category:"Computer Science",
image:"java.png",
description:"Learn object oriented programming and application development using Java.",
chapters:20,
progress:79,
performance:84
},
cn:{
name:"Computer Networks",
category:"Networking",
image:"cn.jpeg",
description:"Learn networking concepts, protocols, TCP/IP and network architecture.",
chapters:16,
progress:0,
performance:0
},
dbms:{
name:"Database Management System",
category:"Database",
image:"dbms.jpeg",
description:"Learn databases, SQL, normalization, transactions and database design.",
chapters:14,
progress:0,
performance:0
},
aiml:{
name:"Artificial Intelligence & Machine Learning",
category:"Artificial Intelligence",
image:"aiml.png",
description:"Explore artificial intelligence, machine learning and intelligent systems.",
chapters:22,
progress:0,
performance:0
},
math:{
name:"Engineering Mathematics",
category:"Mathematics",
image:"math.png",
description:"Learn mathematical concepts, problem solving techniques and applications for engineering.",
chapters:18,
progress:0,
performance:0
},
web:{
name:"Web Development",
category:"Web Technology",
image:"web.jpeg",
description:"Learn HTML, CSS, JavaScript and modern web development.",
chapters:20,
progress:0,
performance:0
}
};
const enrolledContainer=document.getElementById("enrolled-subjects");
const remainingContainer=document.getElementById("remaining-subjects");
const chartCanvas=document.getElementById("subjectPerformanceChart");
let enrolledSubjects=[];
let performanceChart=null;
function loadEnrolledSubjects(){
const saved=localStorage.getItem("enrolledSubjects");
if(saved===null){
enrolledSubjects=["dsa","os","java"];
saveEnrolledSubjects();
return;
}
try{
const data=JSON.parse(saved);
if(Array.isArray(data)){
enrolledSubjects=data.filter(id=>subjects[id]).slice(0,7);
}else{
enrolledSubjects=[];
}
}catch(error){
console.error("Could not read enrolled subjects:",error);
enrolledSubjects=[];
}
}
function saveEnrolledSubjects(){
localStorage.setItem("enrolledSubjects",JSON.stringify(enrolledSubjects));
}
function createEnrolledCard(id){
const subject=subjects[id];
return `
<div class="subject-card">
<div class="subject-image">
<img src="${subject.image}" alt="${subject.name}">
</div>
<div class="subject-content">
<span class="subject-category">${subject.category}</span>
<h3>${subject.name}</h3>
<p class="subject-description">${subject.description}</p>
<div class="subject-info">
<span>${subject.chapters} Chapters</span>
<span>${subject.progress}% Complete</span>
</div>
<div class="progress-bar">
<div class="progress-fill" style="width:${subject.progress}%"></div>
</div>
<div class="subject-actions">
<button class="subject-btn test-btn" onclick="goToTest('${subject.test}')">Go to Test</button>
<button class="subject-btn content-btn" onclick="viewContent('${id}')">View Content</button>
</div>
<button class="remove-subject-btn" onclick="removeSubject('${id}')">Remove Subject</button>
</div>
</div>
`;
}
function createRemainingCard(id){
const subject=subjects[id];
return `
<div class="subject-card">
<div class="subject-image">
<img src="${subject.image}" alt="${subject.name}">
</div>
<div class="subject-content">
<span class="subject-category">${subject.category}</span>
<h3>${subject.name}</h3>
<p class="subject-description">${subject.description}</p>
<div class="subject-info">
<span>${subject.chapters} Chapters</span>
<span>Available</span>
</div>
<button class="enroll-btn" onclick="enrollSubject('${id}')">Enroll Now</button>
</div>
</div>
`;
}
function renderSubjects(){
if(!enrolledContainer||!remainingContainer){
console.error("Subject containers were not found in HTML.");
return;
}
enrolledContainer.innerHTML="";
remainingContainer.innerHTML="";
Object.keys(subjects).forEach(id=>{
if(enrolledSubjects.includes(id)){
enrolledContainer.innerHTML+=createEnrolledCard(id);
}else{
remainingContainer.innerHTML+=createRemainingCard(id);
}
});
if(enrolledSubjects.length===0){
enrolledContainer.innerHTML='<div class="empty-subject">You have not enrolled in any subject yet.</div>';
}
const remainingSubjects=Object.keys(subjects).filter(id=>!enrolledSubjects.includes(id));
if(remainingSubjects.length===0){
remainingContainer.innerHTML='<div class="empty-subject">You are enrolled in all available subjects.</div>';
}
renderPerformanceChart();
}
async function enrollSubject(id){
if(!subjects[id]){
console.error("Subject not found:",id);
return;
}
if(enrolledSubjects.includes(id)){
return;
}
if(enrolledSubjects.length>=7){
alert("You can enroll in maximum 7 subjects.");
return;
}
if(window.innovexaApi){
try{
const response=await window.innovexaApi.request("/api/subjects");
const subject=response.subjects.find((item)=>{
const name=item.name.toLowerCase();
return name.includes(subjects[id].name.toLowerCase())
|| subjects[id].name.toLowerCase().includes(name);
});
if(subject){
await window.innovexaApi.request(`/api/subjects/${subject.id}/enroll`,{method:"POST"});
}
}catch(error){
alert(error.message);
return;
}
}
enrolledSubjects.push(id);
saveEnrolledSubjects();
renderSubjects();
}
function goToTest(id){
    if(!subjects[id]){
        console.error("Subject not found:",id);
        return;
    }
    window.location.href=`test.html?subject=${id}`;
}
function viewContent(id){
if(!subjects[id]){
console.error("Subject not found:",id);
return;
}
console.log("Opening content for:",subjects[id].name);
}
function removeSubject(id){
if(!subjects[id]){
console.error("Subject not found:",id);
return;
}
enrolledSubjects=enrolledSubjects.filter(subjectId=>subjectId!==id);
saveEnrolledSubjects();
renderSubjects();
}
window.enrollSubject=enrollSubject;
window.goToTest=goToTest;
window.viewContent=viewContent;
window.removeSubject=removeSubject;
function renderPerformanceChart(){
if(!chartCanvas){
console.error("Chart canvas was not found.");
return;
}
if(typeof Chart==="undefined"){
console.error("Chart.js is not loaded.");
return;
}
if(performanceChart!==null){
performanceChart.destroy();
}
const labels=[];
const performanceData=[];
enrolledSubjects.forEach(id=>{
if(subjects[id]){
labels.push(subjects[id].name);
performanceData.push(subjects[id].performance);
}
});
performanceChart=new Chart(chartCanvas,{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Performance",
data:performanceData,
borderWidth:1,
borderRadius:8
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
scales:{
y:{
beginAtZero:true,
max:100,
ticks:{
callback:function(value){
return value+"%";
}
}
},
x:{
ticks:{
autoSkip:false
}
}
},
plugins:{
legend:{
display:false
}
}
}
});
}
loadEnrolledSubjects();
renderSubjects();
console.log("Subject JS loaded");