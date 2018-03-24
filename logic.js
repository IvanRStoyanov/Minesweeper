let minesPositions = [];
let sizeW = 0;
let sizeH = 0;
let mines = 0;
function generate(){
    sizeW = Number($('#sizeW').val());
    sizeH = Number($('#sizeH').val());
    mines = $('#mines').val();
    for(let row = 0; row < sizeH; row++){
        let tr = $("<tr>");
        for(let column = 0; column < sizeW; column++){
            let td = $('<td>').attr('id', `${row * sizeW + column}`);
            tr.append(td);
        }
        $("table").append(tr);
    }
    generatePositions();
    putMines();
    $('button').attr('disabled', 'disabled');
}

function generatePositions(){
    let position = Math.floor(Math.random() * Number(sizeH * sizeW));
    for(let i = 0; i < mines; i++){
        while(minesPositions.includes(position)){
            position = Math.floor(Math.random() * Number(sizeH * sizeW));
        }
        minesPositions.push(position);
    }
}


function putMines(){
    for(let i=0; i < mines; i++){
        $(`#${minesPositions[i]}`).html('<img src="download.jpg" alt="mina" />').addClass('boom');
    }

    $('td').on('click', function(){
        if($(this).hasClass('boom')){
            $(this).html('<img src="boom.jpg" alt="boom" />').css('background-color', 'red');
            $('img').show();
            alert('You lost');
        }else{
            calculateNum($(this).attr('id'));
        }
    });

    $('img').hide();
}

function calculateNum(id) {
    let num = 0;
    id = Number(id);
    let surround = [];
    surround.push(id - 1);
    surround.push(id - sizeW - 1);
    surround.push(id + sizeW - 1);
    surround.push(id + 1);
    surround.push(id - sizeW + 1);
    surround.push(id + sizeW + 1);
    surround.push(id + sizeW);
    surround.push(id - sizeW);
    if (!$(`#${id}`).is(':last-child') && !$(`#${id}`).is(':first-child')) {
        for (let i = 0; i < surround.length; i++) {
            if ($(`#${surround[i]}`).hasClass('boom')) {
                num++;
            }
        }
    } else if ($('#' + id).is(':first-child')) {
        surround.splice(0, 3);
        for (let i = 0; i < surround.length; i++) {
            if ($(`#${surround[i]}`).hasClass('boom')) {
                num++;
            }
        }
    }
    else {
        surround.splice(3, 3);
        for (let i = 0; i < surround.length; i++) {
            if ($(`#${surround[i]}`).hasClass('boom')) {
                num++;
            }
        }
    }
    $('#' + id).text(num);
    $('#' + id).addClass('saveField');
    checkForWin();

    if(num == 0){
        surround = removeNegative(surround);
        surround = removeBigger(surround);
        for (let nextId of surround) {
            if(!$('#' + nextId).hasClass('saveField'))
            calculateNum(nextId);
        }
    }
}

    function checkForWin(){
        let isWinner = true;
        for(let i = 0; i < sizeW * sizeH; i++){
            if(!$('#' + i).hasClass('boom') && !$('#'+ i).hasClass('saveField')){
                isWinner = false;
                break;
            }
        }
        if(isWinner){
            alert('You Win');
        }
    }

    function removeNegative(arr){
        let negativeNums = 0;
        for (let num of arr) {
            if(num < 0) negativeNums++;
        }
        let positive = arr.sort((a,b) => a - b);
        return positive.slice(negativeNums);
    }

    function removeBigger(arr) {
        let bigNums = 0;
        for (let num of arr) {
            if(num >= sizeH * sizeW) bigNums++;
        }
        let normals = arr.sort((a,b) => a - b);
        if(bigNums > 0)
        return normals.slice(0,-bigNums);
        else return arr;
    }