//*****
const form = document.querySelector('form');
const input = document.querySelector('#newTask');
const btnDeleteAll = document.querySelector('#btnDeleteAll');
const taskList =  document.querySelector('ul');
const btnAdd = document.querySelector('#add');

let items = [];

//call functions
eventListener();
loadItems();

//Form Submit 
function eventListener(){
    
    btnAdd.addEventListener('click',addNewItem);
    btnDeleteAll.addEventListener('click',deleteAll);
    taskList.addEventListener('click',deleteItem);
    input.addEventListener('keydown',function(e){
        if(e.keyCode === 13){
            e.preventDefault();
            btnAdd.click();
        }
    });
    //form.addEventListener('submit',addNewItem);
}

// Add New Task 
function addNewItem(e){

    //Input check 
    if(input.value === ''){
        alert('Please, Add New Item');
    }else{

    //create 
     createItem(input.value,items.length);
   

    // save to ls
    setItemToLS(input.value);

    input.value = '';

    //No reload
    e.preventDefault();
    }
}

//Delete item from TaskList
function deleteItem(e){
    if(e.target.className === 'fas fa-times'){
        if(confirm('Are you sure?')){
        let val = e.target.parentElement.parentElement;
        val.remove();
        
        deleteItemsFromLS(val.id);
        }
    }
    e.preventDefault();   
}

function deleteItemsFromLS(id){
    items.forEach((value,i) =>{
        if(id==i){
            items.splice(id,1);
        }
    });

    setItemToLS();
}

//Delete all items from TaskList
function deleteAll(e){
    if(items.length!=0){
        if(confirm('Are you sure?')){

            while(taskList.firstChild){
                taskList.removeChild(taskList.firstChild);
            }
             localStorage.clear();

        }
        e.preventDefault();
    }
}

//Create test data items
function createItem(text,index){
    const li = document.createElement('li');
    const a = document.createElement('a');
    const i = document.createElement('i');

    //add classes to elements
    li.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary';
    li.setAttribute('id',index);
    a.className = 'delete-item float-right';
    a.href = '#'; 
    i.className = 'fas fa-times';

    //add input-data to li
    li.appendChild(document.createTextNode(text));

    //add i to a , a to li
    a.appendChild(i);
    li.appendChild(a);

    //add li to ul
    taskList.appendChild(li);
       
}

//load test items to Task List
function loadItems(){
    getItemsFromLS();
    items.forEach(function(item,i) {
        createItem(item,i);   
    });
}

function getItemsFromLS(){
    if(localStorage.getItem('items')===null){
        items = [];
    }else{
        items = JSON.parse(localStorage.getItem('items'));
    }
}

function setItemToLS(text){
    
    if(text != null){
    items.push(text);
    } 
    localStorage.setItem('items',JSON.stringify(items));
      
}