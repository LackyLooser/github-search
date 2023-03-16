'use strict';

const form = document.querySelector('.form');
const inputSearch = document.querySelector('.form-input');
const resultContainer = document.querySelector('.search-result');


async function search(param){
    let response = await fetch(`https://api.github.com/search/repositories?q=${param}&per_page=10`,{
        headers: {
            Accept: 'application/vnd.github.text-match+json'
        }
    });

    if (response.ok) { 
        const data = await response.json();
        showResultSearch(data);
      } else {
        const error = await response.json();
        createErrorInfo(form, error.message);
      }
    
}

function removeError(form){
    if(form.classList.contains("error")){
        form.classList.remove('error');
        form.querySelector(".error-text").remove();
    }
}

function createErrorInfo(form, text){
    const errorWrapper = document.createElement('div');
    
    errorWrapper.classList.add("error-text");
    errorWrapper.textContent = text;
    
    
    if(!form.classList.contains('error')){
        form.classList.add('error');
        form.append(errorWrapper);
    }
    
}

function validate(form){
    let errorValidate = false;

    if(inputSearch.value == ""){
        createErrorInfo(form, "Поисковой запрос не может быть пустым");
        errorValidate = true;
    }

    return errorValidate;
}

inputSearch.addEventListener('input', function(){
    if(inputSearch.value != '');
    removeError(form);
})

function transformDate(date){
    const d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();

    function isNeedZero(num){
        if(num < 10){
            return '0' + num;
          }
        
        return num;
    }

    return `${isNeedZero(day)}/${isNeedZero(month)}/${year}`;
}

function showResultSearch (data){
    const {items} = data;
    
    let resultSearch = '';
    if(items.length > 0) {
        items.forEach((item)=>{
            const {name, html_url, created_at ,text_matches} = item;
            resultSearch += `<li class="search-result__item">
                                <div class="search-result__item-header">
                                    <a  class="search-result__title" target="_blank" href="${html_url}" >
                                        <h2>${name}</h2>
                                    </a>
                                    <p class="search-result__date">создан: ${transformDate(created_at)}</p>
                                </div>
                                <p class="search-result__info">${text_matches[0].fragment}</p>
                            </li>
            `
        });
    } else {
        resultSearch = `<li >Ничего не найдено</li>`;
    }
    
    resultContainer.innerHTML = resultSearch;
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    removeError(form);
    if(validate(form)){
        return 
    }
    search(inputSearch.value);
})