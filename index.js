//Storage Controller
const StorageController = (function(){
    //public
    return{
        //save data to LS
        saveProduct:function(products){
            localStorage.setItem('products',JSON.stringify(products));
        },
        //store new Product
        storeProduct:function(product){
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
                products.push(product);
            }else{
                products=JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            this.saveProduct(products);
        },
        //get data from LS
        getProducts:function(){
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
            }else{ 
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        //update selected product in LS
        updateProduct:function(product){
            let products = this.getProducts();
            products.forEach((prd,index) => {
                if(product.id===prd.id){
                    products.splice(index,1,product);
                }
            });
            this.saveProduct(products);
        },
        //delete selected product from LS
        deleteProduct:function(product){
            let products = this.getProducts();
            products.forEach((prd,index) => {
                if(prd.id===product.id){
                    products.splice(index,1);
                }                
            });
            this.saveProduct(products);
        }
    };

})();


//UI Controller
const UIController = (function(){

    const Selectors = {
        productsList:'#items_list',
        btnAdd:'#btnAdd',
        btnSave:'#btnSave',
        btnDelete:'#btnDelete',
        btnCancel:'#btnCancel',
        price:'#itemPrice',
        items:'#cardList tr',
        name:'#itemName',
        card:'#cardList',
        totalAzn:'#total-azn',
        totalUsd:'#total-usd',
    };
    //public
    return{
    
        createProductList:function(products){
            let html ='';

            products.forEach(product => {
                html += `<tr>
                <td>${product.id+1}</td>
                <td>${product.name}</td>
                <td>${product.price}$</td>
                <td class='text-end'><i class="fas fa-edit" id="${product.id}"></i></td>
                </tr>`;
            });

            document.querySelector(Selectors.productsList).innerHTML = html;

        },
        getSelectors:function(){
            return Selectors;
        },
        getSelectedProduct:function(){
            
            document.querySelector(Selectors.name).value = ProductController.getCurrentProduct().name;
            document.querySelector(Selectors.price).value = ProductController.getCurrentProduct().price;
        },
        addProductToList:function(product){
            let html = `<tr>
            <td>${product.id+1}</td>
            <td>${product.name}</td>
            <td>${product.price}$</td>
            <td class='text-end'><i class="fas fa-edit" id="${product.id}"></i></td>
            </tr>`;
            document.querySelector(Selectors.productsList).innerHTML += html;
        },
        clearInput:function(){
            document.querySelector(Selectors.name).value = null;
            document.querySelector(Selectors.price).value = null; 
        },
        hideCard:function(){
            document.querySelector(Selectors.card).style.display = 'none';
        },
        showCard:function(){
            document.querySelector(Selectors.card).style.display = 'block';
        },
        totals:function(){
            totalUsd = ProductController.totalCalculator();
            document.querySelector(Selectors.totalAzn).textContent = parseInt(totalUsd*1.7)+'\u20BC';
            document.querySelector(Selectors.totalUsd).textContent = parseFloat(totalUsd)+'$';
        },
        addingState:function(item){
            this.clearWarnings();
            this.clearInput();
            document.querySelector(Selectors.btnAdd).style.display ='inline';
            document.querySelector(Selectors.btnCancel).style.display ='none';
            document.querySelector(Selectors.btnDelete).style.display ='none';
            document.querySelector(Selectors.btnSave).style.display ='none';

        },
        editState:function(tr){
            
            this.clearWarnings();
            tr.classList.add("bg-warning"); 
        
            document.querySelector(Selectors.btnAdd).style.display ='none';
            document.querySelector(Selectors.btnSave).style.display ='inline';
            document.querySelector(Selectors.btnCancel).style.display ='inline';
            document.querySelector(Selectors.btnDelete).style.display ='inline';
        },
        updateProduct:function(prd){
            let updatedItem = null;
            const items = document.querySelectorAll(Selectors.items);
            items.forEach(function(item){
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent=prd.name;
                    item.children[2].textContent=prd.price+"$";
                    updatedItem=item;
                }
            });
            return updatedItem;
        },
        clearWarnings:function(){
            let items = document.querySelectorAll(Selectors.items);
            items.forEach(item =>{
                if(item.classList.contains("bg-warning")){
                    item.classList.remove("bg-warning");
                }
            });   
 
        },
        deleteProduct:function(){
            let items = document.querySelectorAll(Selectors.items);
            
            items.forEach(item => {
                if(item.classList.contains("bg-warning")){
                    item.remove();
                }
            });
        }
    }
})();



//Product Controller
const ProductController = (function(){

    //private
    const Product = function(id,name,price){
        this.id = id;
        this.name = name;
        this.price = parseFloat(price);
    }

    const data = {
        products:StorageController.getProducts(),
        selectedProduct:null,
    }


    //public
    return{
        getProducts:function(){
            return data.products;
        },        
        getData:function(){
            return data;
        },
        getProductById:function(id){
            let product = null;

            data.products.forEach(prd => {
                if(prd.id == id){
                    product=prd;
                }
            });

            return product;
        },
        getCurrentProduct:function(){
            return data.selectedProduct;
        },
        updateProduct:function(name,price){
            let product =null;
            data.products.forEach(prd => {
                if(data.selectedProduct.id===prd.id){
                    prd.name=name;
                    prd.price=price;
                    product=prd;
                }                
            });
            return product;
        },
        setCurrentProduct:function(product){
            
            data.selectedProduct = product;
        },
        addProduct:function(name,price){
            let id = 0;

            if(data.products.length>0){
                id=data.products.length;
            }

            const newProduct = new Product(id,name,price);
            


            data.products.push(newProduct);
            return newProduct;
        },
        totalCalculator:function(){
            let total = 0;
            data.products.forEach(prd => {
                total+=parseFloat(prd.price);
            });
            return total;
        },
        deleteProduct:function(product){
            data.products.forEach((prd,index) =>{
                if(prd.id === product.id){
                    data.products.splice(index,1);
                }
            });
        }

    }
})();




//App Controller
const App = (function(producCtrl,uiCtrl,storeCtrl){
    
    const UISelectors = uiCtrl.getSelectors();

    //load Event listeners
    const loadEventListeners = function(){

        document.querySelector(UISelectors.btnAdd).addEventListener('click',productAddSubmit);
        document.querySelector(UISelectors.productsList).addEventListener('click',productEditSubmit);
        document.querySelector(UISelectors.btnCancel).addEventListener('click',cancelUpdate);
        document.querySelector(UISelectors.btnDelete).addEventListener('click',deleteProduct);
        document.querySelector(UISelectors.btnSave).addEventListener('click',updateProduct);
    
    }

    //Product adder 
    const productAddSubmit = function(e){

        const name = document.querySelector(UISelectors.name).value;
        const price = document.querySelector(UISelectors.price).value;
        
        if(price!=='' && name!==''){
            const newProduct = ProductController.addProduct(name,price);
            
            //Add new product and clear inputs
            uiCtrl.addProductToList(newProduct);
            uiCtrl.clearInput();
            
            //add new porduct to LS
            storeCtrl.storeProduct(newProduct);
        }else{
            //alert blank inputs
            alert('Please, fill the blanks');
        }
        //ui update total and card
        uiCtrl.totals();
        uiCtrl.showCard();

        e.preventDefault();
    }
    //Product edit
    const productEditSubmit = function(e){

        if(e.target.classList.contains('fa-edit')){
            //take clicked item id 
            const id = e.target.id;
            const product = ProductController.getProductById(id);

            producCtrl.setCurrentProduct(product);
            uiCtrl.getSelectedProduct();
            uiCtrl.editState(e.target.parentNode.parentNode);
        }        
        e.preventDefault();
    }
    
    //Product delete
    const deleteProduct = function(e){
        const selectedProduct = producCtrl.getCurrentProduct();
        //delete product from products and ui
        producCtrl.deleteProduct(selectedProduct);
        uiCtrl.deleteProduct();
        uiCtrl.addingState();

        //update total 
        var total = producCtrl.totalCalculator();
        if(total==0){
            uiCtrl.hideCard();
        }
        uiCtrl.totals();

        //delete from LS
        storeCtrl.deleteProduct(selectedProduct);

        e.preventDefault();
    }
    
    //Update cancel
    const cancelUpdate = function(e){
        uiCtrl.addingState();
        e.preventDefault();
    }
    
    //Product update
    const updateProduct = function(e){
        const name = document.querySelector(UISelectors.name).value;
        const price = document.querySelector(UISelectors.price).value;

        if(name!==''&&price!==''){
            const updatedProduct = producCtrl.updateProduct(name,price);
            const item=uiCtrl.updateProduct(updatedProduct);
            
            //update ui
            uiCtrl.totals();
            uiCtrl.addingState();

            //update LS
            storeCtrl.updateProduct(updatedProduct);
        }
        
        e.preventDefault();
    }
    return{
        init:function() {
            //load products
            const products = producCtrl.getProducts();
            uiCtrl.addingState();
            
            if(products.length==0){
                uiCtrl.hideCard();
            }else{
                uiCtrl.showCard();
                //show data on UI
                uiCtrl.createProductList(products);
            }
            uiCtrl.totals();

            //load event listeners
            loadEventListeners();
        }
    }
    
})(ProductController,UIController,StorageController);

App.init();



/*
let items = [];

//call functions
eventListener();
loadItems();

//Form Submit 
function eventListener(){
    
    btnAdd.addEventListener('click',addNewItem);
    btnDelete.addEventListener('click',deleteAll);
    itemsList.addEventListener('click',deleteItem);
    //form.addEventListener('submit',addNewItem);
}

// Add New Task 
function addNewItem(e){

    //Input check 
    if(itemName.value === '' || price.value === ''){
        alert('Please, Enter item name and price');
    }else{

    //create 
    createItem(itemName.value,price.value,items.length);
   

    // save to ls
    //setItemToLS(input.value);

    itemName.value = '';
    price.value = '';

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
function createItem(name,price,index){
    var html = '';

    html += `<tr>
    <td>${name}</td>
    <td>${price}</td>
    <td><button id="${index}" class="btn btn-sm float-right"><i class="fas fa-edit"></i></a></td>
    </tr>`; 

    itemsList.innerHTML += html;   
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
      
}*/