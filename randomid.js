const DEFAULT_LENGTH = 8
CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
CHARS = CHARS.split('');

randomId = function(length){
    
    let idLength = length || DEFAULT_LENGTH;
    
    charArr = []

    for(let i = 0; i < idLength; i++){
        charArr.push(CHARS[Math.floor(Math.random() * CHARS.length)])
    }

    return charArr.join('')
}    

module.exports = {
    randomId: randomId
}