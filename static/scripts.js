
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

    setDefaultState();

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

    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({key:input}))

}

function processRequest(xhr){

        if(xhr.readyState === 4 && xhr.status === 200){
            setTimeout(()=>{
                btnObject.setState("ready");
                btnObject.updateText();

                btn.disabled = input.disabled = false;
                input.value = "";
                created.hidden = false;

                resp = JSON.parse(xhr.response);

                let link = document.querySelector('.short-url')
                link.innerHTML = "http://"+window.location.host+"/" + resp.shortid;
                link.href = "http://"+window.location.host+"/" + resp.shortid;
            }, 1000)
        }
        if(xhr.readyState === 4 && xhr.status !== 200){

            setDefaultState();

            let err = document.getElementById("errorsect")
            let resp = JSON.parse(xhr.response)
            document.getElementById("error-message").innerHTML = resp.error
            err.hidden = false;

        }
}

function setDefaultState(){
    document.getElementById("errorsect").hidden = true;
    created.hidden = true;
    btnObject.setState("ready");
    btnObject.updateText();
    btn.disabled = input.disabled = false;
}

function onInputChange(){
    input.classList.remove("error")
}