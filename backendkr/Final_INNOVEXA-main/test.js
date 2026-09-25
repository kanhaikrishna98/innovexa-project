const questionBank={
dsa:[
{question:"Which data structure follows LIFO principle?",options:["Queue","Stack","Array","Linked List"],answer:"Stack",difficulty:"Easy"},
{question:"Which data structure follows FIFO principle?",options:["Stack","Queue","Tree","Graph"],answer:"Queue",difficulty:"Easy"},
{question:"What is the first index of an array in C?",options:["0","1","-1","2"],answer:"0",difficulty:"Easy"},
{question:"Which data structure stores elements in contiguous memory locations?",options:["Linked List","Tree","Array","Graph"],answer:"Array",difficulty:"Easy"},
{question:"Which operation is used to add an element to the top of a stack?",options:["Pop","Push","Peek","Delete"],answer:"Push",difficulty:"Easy"},
{question:"Which operation removes an element from a queue?",options:["Push","Enqueue","Dequeue","Peek"],answer:"Dequeue",difficulty:"Easy"},
{question:"Which data structure represents hierarchical relationships?",options:["Array","Stack","Tree","Queue"],answer:"Tree",difficulty:"Easy"},
{question:"Which of the following is a linear data structure?",options:["Tree","Graph","Array","Heap"],answer:"Array",difficulty:"Easy"},
{question:"Which data structure consists of nodes connected by links?",options:["Array","Linked List","Stack","Queue"],answer:"Linked List",difficulty:"Easy"},
{question:"Which data structure is commonly used in BFS?",options:["Stack","Queue","Heap","Array"],answer:"Queue",difficulty:"Easy"},
{question:"What is the time complexity of Binary Search on a sorted array?",options:["O(n)","O(log n)","O(n²)","O(1)"],answer:"O(log n)",difficulty:"Medium"},
{question:"What is the worst-case time complexity of Linear Search?",options:["O(1)","O(log n)","O(n)","O(n log n)"],answer:"O(n)",difficulty:"Medium"},
{question:"Which traversal of a Binary Search Tree gives sorted order?",options:["Preorder","Postorder","Inorder","Level Order"],answer:"Inorder",difficulty:"Medium"},
{question:"Which sorting algorithm uses divide and conquer?",options:["Bubble Sort","Merge Sort","Selection Sort","Counting Sort"],answer:"Merge Sort",difficulty:"Medium"},
{question:"In a Max Heap, where is the maximum element stored?",options:["Leaf","Root","Last node","Middle"],answer:"Root",difficulty:"Medium"},
{question:"What is the average time complexity of Quick Sort?",options:["O(n)","O(log n)","O(n log n)","O(n²)"],answer:"O(n log n)",difficulty:"Medium"},
{question:"What is the maximum number of edges in a simple undirected graph with n vertices?",options:["n","n²","n(n-1)/2","n(n+1)/2"],answer:"n(n-1)/2",difficulty:"Medium"},
{question:"Which data structure is mainly used to manage recursive function calls?",options:["Queue","Stack","Heap","Graph"],answer:"Stack",difficulty:"Medium"},
{question:"What is the average search complexity in a balanced Binary Search Tree?",options:["O(n)","O(log n)","O(n²)","O(1)"],answer:"O(log n)",difficulty:"Medium"},
{question:"Which algorithm finds the shortest path from a source in a graph with non-negative edge weights?",options:["DFS","BFS","Dijkstra","Kruskal"],answer:"Dijkstra",difficulty:"Medium"},
{question:"What is the worst-case time complexity of Quick Sort?",options:["O(n)","O(log n)","O(n log n)","O(n²)"],answer:"O(n²)",difficulty:"Hard"},
{question:"Which data structure is commonly used to implement a Priority Queue?",options:["Stack","Binary Heap","Linked List only","Graph"],answer:"Binary Heap",difficulty:"Hard"},
{question:"What is the time complexity of insertion in a balanced Binary Search Tree?",options:["O(1)","O(log n)","O(n)","O(n²)"],answer:"O(log n)",difficulty:"Hard"},
{question:"Which algorithm is used to find a Minimum Spanning Tree by selecting edges while avoiding cycles?",options:["Dijkstra","Kruskal","BFS","Floyd-Warshall"],answer:"Kruskal",difficulty:"Hard"},
{question:"Which algorithm is used to find shortest paths between all pairs of vertices?",options:["Dijkstra","Kruskal","Floyd-Warshall","Prim"],answer:"Floyd-Warshall",difficulty:"Hard"},
{question:"What is the auxiliary space complexity of recursive DFS in the worst case?",options:["O(1)","O(log V)","O(V)","O(E²)"],answer:"O(V)",difficulty:"Hard"},
{question:"Which technique is useful when a problem has overlapping subproblems and optimal substructure?",options:["Greedy","Dynamic Programming","Binary Search","Backtracking only"],answer:"Dynamic Programming",difficulty:"Hard"},
{question:"What is the time complexity of checking whether an edge exists in an adjacency matrix?",options:["O(1)","O(log V)","O(V)","O(E)"],answer:"O(1)",difficulty:"Hard"},
{question:"Which technique can be used to detect a cycle in a directed graph?",options:["DFS","Binary Search","Merge Sort","Heap Sort"],answer:"DFS",difficulty:"Hard"},
{question:"What is the worst-case search complexity of an unbalanced Binary Search Tree?",options:["O(1)","O(log n)","O(n)","O(n log n)"],answer:"O(n)",difficulty:"Hard"}
],
os:[
{question:"What does OS stand for?",options:["Operating System","Open Software","Operating Service","Online System"],answer:"Operating System",difficulty:"Easy"},
{question:"Which of the following is an example of an Operating System?",options:["Linux","Google","HTML","Python"],answer:"Linux",difficulty:"Easy"},
{question:"What is a process?",options:["A file stored on disk","A program in execution","A hardware device","A compiler"],answer:"A program in execution",difficulty:"Easy"},
{question:"Which software manages computer resources?",options:["Browser","Operating System","Text Editor","Compiler"],answer:"Operating System",difficulty:"Easy"},
{question:"Which state means a process is currently being executed by the CPU?",options:["Ready","Waiting","Running","New"],answer:"Running",difficulty:"Easy"},
{question:"In which state is a process waiting for CPU allocation?",options:["Running","Ready","Terminated","Blocked"],answer:"Ready",difficulty:"Easy"},
{question:"What does a file system manage?",options:["CPU temperature","Files and directories","Keyboard only","Internet speed"],answer:"Files and directories",difficulty:"Easy"},
{question:"Which memory is mainly used to store running programs?",options:["ROM","RAM","Hard Disk only","Cache only"],answer:"RAM",difficulty:"Easy"},
{question:"What is a thread?",options:["A complete operating system","A lightweight unit of execution","A hardware component","A storage device"],answer:"A lightweight unit of execution",difficulty:"Easy"},
{question:"Which scheduling algorithm executes processes in arrival order?",options:["Round Robin","FCFS","SJF","Priority"],answer:"FCFS",difficulty:"Easy"},
{question:"Which scheduling algorithm uses a fixed time slice?",options:["FCFS","Round Robin","SJF","Priority"],answer:"Round Robin",difficulty:"Medium"},
{question:"What is a context switch?",options:["Changing the operating system","Changing the CPU speed","Changing the context of a running process","Changing RAM"],answer:"Changing the context of a running process",difficulty:"Medium"},
{question:"Which is one of the necessary conditions for deadlock?",options:["Mutual Exclusion","Compilation","Paging","Caching"],answer:"Mutual Exclusion",difficulty:"Medium"},
{question:"Which page replacement algorithm removes the page that has not been used for the longest time?",options:["FIFO","LRU","FCFS","Round Robin"],answer:"LRU",difficulty:"Medium"},
{question:"What is virtual memory?",options:["Extra CPU","A technique using secondary storage to extend apparent memory","A type of cache","A type of register"],answer:"A technique using secondary storage to extend apparent memory",difficulty:"Medium"},
{question:"What is a system call?",options:["A hardware interrupt only","An interface for requesting OS services","A programming language","A network protocol"],answer:"An interface for requesting OS services",difficulty:"Medium"},
{question:"Which scheduling algorithm can cause starvation of long processes?",options:["FCFS","SJF","Round Robin","FIFO"],answer:"SJF",difficulty:"Medium"},
{question:"What is the main purpose of a semaphore?",options:["Memory allocation","Process synchronization","File compression","CPU cooling"],answer:"Process synchronization",difficulty:"Medium"},
{question:"Which memory management technique divides memory into fixed-size pages?",options:["Segmentation","Paging","Swapping","Fragmentation"],answer:"Paging",difficulty:"Medium"},
{question:"What is a race condition?",options:["A CPU failure","A condition where result depends on timing of concurrent operations","A type of deadlock only","A memory leak"],answer:"A condition where result depends on timing of concurrent operations",difficulty:"Medium"},
{question:"Which four conditions are necessary for deadlock?",options:["Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait","Paging, Segmentation, Swapping, Caching","FCFS, SJF, RR, Priority","RAM, ROM, Cache, Register"],answer:"Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",difficulty:"Hard"},
{question:"Which algorithm is used for deadlock avoidance?",options:["Banker's Algorithm","FCFS","LRU","Round Robin"],answer:"Banker's Algorithm",difficulty:"Hard"},
{question:"What is thrashing?",options:["Fast CPU execution","Excessive paging activity","File deletion","Process termination"],answer:"Excessive paging activity",difficulty:"Hard"},
{question:"What is a major difference between a process and a thread?",options:["Threads cannot execute","Threads of the same process share resources","Processes always share memory","There is no difference"],answer:"Threads of the same process share resources",difficulty:"Hard"},
{question:"What is a page fault?",options:["A CPU error","A referenced page is not currently in physical memory","A file system error","A network error"],answer:"A referenced page is not currently in physical memory",difficulty:"Hard"},
{question:"Which page replacement algorithm can suffer from Belady's anomaly?",options:["LRU","Optimal","FIFO","MRU"],answer:"FIFO",difficulty:"Hard"},
{question:"What is the main purpose of a TLB?",options:["Store files","Cache virtual-to-physical address translations","Schedule processes","Manage deadlocks"],answer:"Cache virtual-to-physical address translations",difficulty:"Hard"},
{question:"Which IPC method allows processes to communicate through a common memory area?",options:["Shared Memory","FCFS","Paging","Spooling"],answer:"Shared Memory",difficulty:"Hard"},
{question:"What is starvation in Operating Systems?",options:["A process waits indefinitely because other processes keep getting resources","CPU stops permanently","RAM becomes empty","A file is deleted"],answer:"A process waits indefinitely because other processes keep getting resources",difficulty:"Hard"},
{question:"What is a major advantage of preemptive scheduling?",options:["A running process cannot be interrupted","The OS can interrupt a running process","It removes all deadlocks","It removes the need for CPU"],answer:"The OS can interrupt a running process",difficulty:"Hard"}
]
};

const urlParams=new URLSearchParams(window.location.search);
const selectedSubject=(urlParams.get("subject")||"dsa").toLowerCase();
const questions=questionBank[selectedSubject]||questionBank.dsa;

let currentQuestion=0;
let userAnswers=new Array(questions.length).fill(null);

const subjectName=document.getElementById("subject-name");
const questionCounter=document.getElementById("question-counter");
const questionNumber=document.getElementById("question-number");
const questionText=document.getElementById("question");
const optionsContainer=document.getElementById("options");
const progressBar=document.getElementById("progress-bar");
const previousBtn=document.getElementById("previous-btn");
const nextBtn=document.getElementById("next-btn");
const resultCard=document.getElementById("result-card");
const questionCard=document.getElementById("question-card");
const difficulty=document.getElementById("difficulty");
const resultScore=document.getElementById("result-score");
const resultMessage=document.getElementById("result-message");
const restartBtn=document.getElementById("restart-btn");
const correctElement=document.getElementById("correct");
const wrongElement=document.getElementById("wrong");
const attemptedElement=document.getElementById("attempted");

function getSubjectName(){
if(selectedSubject==="os"){
return "Operating System";
}
if(selectedSubject==="dsa"){
return "Data Structures & Algorithms";
}
return selectedSubject.toUpperCase();
}

function loadQuestion(){
const q=questions[currentQuestion];
if(!q){
return;
}
if(subjectName){
subjectName.textContent=getSubjectName();
}
if(questionCounter){
questionCounter.textContent=`Question ${currentQuestion+1} / ${questions.length}`;
}
if(questionNumber){
questionNumber.textContent=`Q${currentQuestion+1}`;
}
if(questionText){
questionText.textContent=q.question;
}
if(difficulty){
difficulty.textContent=q.difficulty;
}
if(!optionsContainer){
console.error("Element #options not found.");
return;
}
optionsContainer.innerHTML="";
q.options.forEach((option,index)=>{
const label=document.createElement("label");
label.className="option";
if(userAnswers[currentQuestion]===option){
label.classList.add("selected");
}
label.innerHTML=`<input type="radio" name="answer" value="${option}"><span>${String.fromCharCode(65+index)}. ${option}</span>`;
const radio=label.querySelector("input");
radio.checked=userAnswers[currentQuestion]===option;
radio.addEventListener("change",()=>{
userAnswers[currentQuestion]=option;
document.querySelectorAll(".option").forEach(item=>{
item.classList.remove("selected");
});
label.classList.add("selected");
});
optionsContainer.appendChild(label);
});
const progress=((currentQuestion+1)/questions.length)*100;
if(progressBar){
progressBar.style.width=`${progress}%`;
}
if(previousBtn){
previousBtn.disabled=currentQuestion===0;
}
if(nextBtn){
nextBtn.textContent=currentQuestion===questions.length-1?"Submit Test":"Next";
}
}

async function saveAssessment(score, percentage){
if(!window.innovexaApi){
return;
}
try{
const response=await window.innovexaApi.request("/api/subjects");
const subject=response.subjects.find((item)=>{
const name=item.name.toLowerCase();
return selectedSubject==="dsa" && name.includes("data structure")
|| selectedSubject==="os" && name === "operating system"
|| name.includes(selectedSubject);
});
if(!subject){
return;
}
await window.innovexaApi.request("/api/assessments",{
method:"POST",
body:{
subject_id:subject.id,
title:`${getSubjectName()} test`,
score,
max_score:questions.length,
topic:"Practice test"
}
});
}catch(error){
console.error("Unable to save assessment:",error);
}
}

async function showResult(){
let score=0;
let attempted=0;
questions.forEach((q,index)=>{
if(userAnswers[index]!==null){
attempted++;
}
if(userAnswers[index]===q.answer){
score++;
}
});
const wrong=attempted-score;
const percentage=Math.round((score/questions.length)*100);
saveAssessment(score,percentage);
if(questionCard){
questionCard.classList.add("hidden");
}
if(resultCard){
resultCard.classList.remove("hidden");
}
if(resultScore){
resultScore.textContent=`${score} / ${questions.length}`;
}
if(correctElement){
correctElement.textContent=score;
}
if(wrongElement){
wrongElement.textContent=wrong;
}
if(attemptedElement){
attemptedElement.textContent=attempted;
}
if(resultMessage){
if(percentage>=80){
resultMessage.textContent="Excellent! Tumhari preparation kaafi achhi hai.";
}else if(percentage>=60){
resultMessage.textContent="Good job! Thodi aur practice se score aur improve ho sakta hai.";
}else if(percentage>=40){
resultMessage.textContent="Concepts ko ek baar revise karo aur phir test try karo.";
}else{
resultMessage.textContent="Basic concepts se dobara start karke regular practice karo.";
}
}
}

function restartTest(){
currentQuestion=0;
userAnswers=new Array(questions.length).fill(null);
if(resultCard){
resultCard.classList.add("hidden");
}
if(questionCard){
questionCard.classList.remove("hidden");
}
loadQuestion();
}

if(previousBtn){
previousBtn.addEventListener("click",()=>{
if(currentQuestion>0){
currentQuestion--;
loadQuestion();
}
});
}

if(nextBtn){
nextBtn.addEventListener("click",()=>{
if(currentQuestion<questions.length-1){
currentQuestion++;
loadQuestion();
}else{
showResult();
}
});
}

if(restartBtn){
restartBtn.addEventListener("click",restartTest);
}

loadQuestion();