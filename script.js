let panelNum = 1;
let stopper = 0;

function addItem(event){
    event.preventDefault();
    let text = document.getElementById("todo-input");

    db.collection("todo-items").add({
        text: text.value,
        status: "active"
    })

    text.value = ""
}

function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => {
        //console.log(snapshot);
        let items = [];
        snapshot.docs.forEach((doc)=>{
            items.push({
                id: doc.id,
                ...doc.data()
            })
        })
        if(panelNum != stopper){
            generatePanel();
            stopper = panelNum;
        }
        generateActiveItem(items);
        itemLeft(items)
    })
}

function itemLeft(items){
    var len = items.length;
    document.getElementById("item-left-text").innerHTML = len + " items left";
}

function generateActiveItem(items){
    let itemsHTML = "";
    items.forEach((item)=>{
        switch(panelNum){
            case 1:  
                itemsHTML += `
                    <div class="todo-item">
                        <div class="check">
                            <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked":""}">
                                <img src="./assets/icon-check.svg">
                            </div>
                        </div>
                        <div class="todo-text ${item.status == "completed" ? "checked":""}">
                            ${item.text}
                        </div>
                    </div>
                ` 
                break;
            case 2:
                if(item.status == "active"){
                    itemsHTML += `
                        <div class="todo-item">
                            <div class="check">
                                <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked":""}">
                                    <img src="./assets/icon-check.svg">
                                </div>
                            </div>
                            <div class="todo-text ${item.status == "completed" ? "checked":""}">
                                ${item.text}
                            </div>
                        </div>
                    `
                }
                break;
            case 3:
                if(item.status == "completed"){
                    itemsHTML += `
                        <div class="todo-item">
                            <div class="check">
                                <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked":""}">
                                    <img src="./assets/icon-check.svg">
                                </div>
                            </div>
                            <div class="todo-text ${item.status == "completed" ? "checked":""}">
                                ${item.text}
                            </div>
                        </div>
                    `
                }
                break;
        }
        
    })
    
    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventListeners();
    clearComplete();
    
}


function generatePanel(){
    let allText = document.getElementById("allPanel");
    allText.addEventListener("click", function(){
        panelNum = 1;
        allText.style.color= "hsl(220, 98%, 61%)" ;
        activeText.style.color= "hsl(233, 14%, 35%)" ;
        completedText.style.color= "hsl(233, 14%, 35%)" ;
        getItems();
    });

    let activeText = document.getElementById("activePanel");
    activeText.addEventListener("click", function(){
        panelNum = 2;
        allText.style.color= "hsl(233, 14%, 35%)" ;
        activeText.style.color= "hsl(220, 98%, 61%)" ;
        completedText.style.color= "hsl(233, 14%, 35%)" ;
        getItems();
    });

    let completedText = document.getElementById("completedPanel");
    completedText.addEventListener("click", function(){
        panelNum = 3;
        allText.style.color= "hsl(233, 14%, 35%)" ;
        activeText.style.color= "hsl(233, 14%, 35%)" ;
        completedText.style.color= "hsl(220, 98%, 61%)" ;
        getItems();
    });
}

function clearComplete(){
    let clearText = document.getElementById("clear-text");
    clearText.addEventListener("click", function(){
        
    let toClearMarks = document.querySelectorAll(".todo-item .check-mark")
    toClearMarks.forEach((clearMark)=>{

        let item = db.collection("todo-items").doc(clearMark.dataset.id);

        item.get().then(function(doc){
            if(doc.exists){
                let status = doc.data().status;
                if(status == "completed"){
                    db.collection("todo-items").doc(clearMark.dataset.id).delete();
                }
            }
        })
    })
    });
}

function createEventListeners(){
    
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark")
    todoCheckMarks.forEach((checkMark)=>{
        checkMark.addEventListener("click", function(){
            markCompleted(checkMark.dataset.id);
        })
    })
}

function markCompleted(id){

    let item = db.collection("todo-items").doc(id);

    item.get().then(function(doc){
        if(doc.exists){
            let status = doc.data().status;
            if(status == "active"){
                item.update({
                    status:"completed"
                })
            }else if(status == "completed"){
                item.update({
                    status: "active"
                })
            }
        }
    })
}
getItems();

