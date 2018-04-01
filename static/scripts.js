
// Let's get elements in document for future use
var btn = document.getElementById("submitbtn");
var input = document.getElementById("inputfield");
var created = document.getElementById("created");
// Setup some objects

btnObject = {
    state: "ready",
    readyText: "Shorten it!",
    busyText: "Please wait!",
    updateText: function(){
        if(this.state === "ready"){
            btn.innerHTML = this.readyText;
        }
        else{
            btn.innerHTML = this.busyText;
        }
    },
    setState: function(x){
        this.state = x;
    }
}


btn.addEventListener("click", handleSubmit)
input.addEventListener("change", onInputChange)

function handleSubmit(){
    if(input.value === ""){
        input.classList.add("error");

    }
    else{
        btnObject.setState("busy");
        btnObject.updateText();
        makeRequest(input.value);
        input.disabled = true;
        btn.disabled = true;
    }
}

function makeRequest(input){

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);

    xhr.onreadystatechange = function(){
        processRequest(xhr);
    };

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("key=" + input)

}

function processRequest(xhr){

        if(xhr.readyState === 4 && xhr.status === 200){
            setTimeout(()=>{
                btnObject.setState("ready");
                btnObject.updateText();

                btn.disabled = input.disabled = false;
                input.value = "";
                created.hidden = false;

                let link = document.querySelector('.short-url')
                link.innerHTML = "http://"+window.location.host+"/" + xhr.response;
                link.href = "http://"+window.location.host+"/" + xhr.response;
            }, 1000)
        }
}

function onInputChange(){
    input.classList.remove("error")
}