import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {PixabayApi} from "./js/pixabayApi";
import { createMarkup } from './js/createMarkup';


const form=document.querySelector(".search-form")
const loadBtn=document.querySelector(".load-more")
const list=document.querySelector(".gallery")


const pixabayApi=new PixabayApi;

const handleSubmit=(event)=>{
    event.preventDefault();
    const{elements:{searchQuery}}=event.currentTarget;
    const query=searchQuery.value.trim().toLowerCase();
    if(!query)
    {
        Notify.failure('Введіть пошуковий запит');
        return
    }
    pixabayApi.query=query;
    clearPage();
    pixabayApi.getPhotos().then(({hits,total})=>{
        searchQuery.value='';
        if(hits.length===0)
        {
            Notify.info(`За запитом ${query} результатів не знайдено`)
            return;
        }
        const markup=createMarkup(hits)
        list.insertAdjacentHTML("beforeend",markup)
        pixabayApi.calculateTotalPages(total);
        Notify.success(`Знайшлося ${total} результатів по запиту ${query}`);
        if(pixabayApi.isShownOnLoadMore)
        {
            loadBtn.classList.remove("is-hidden");
        }
        scroll();
        simple.refresh();
    }).catch(error=>{
        Notify.failure(error.message,"Щось пішло не так");
        clearPage();
    });
    
    
}

const onLoadMore=()=>{
pixabayApi.incrementPage();
if(!pixabayApi.isShownOnLoadMore)
        {
            loadBtn.classList.add("is-hidden");
        }
pixabayApi.getPhotos().then(({hits})=>{
    const markup=createMarkup(hits)
    list.insertAdjacentHTML("beforeend",markup)
    simple.refresh();
    scroll();
}).catch(error=>{
    Notify.failure(error.message,"Щось пішло не так");
   clearPage();
});
}

function clearPage()
{
    pixabayApi.resetPage();
    list.innerHTML="";
    loadBtn.classList.add("is-hidden");
}
form.addEventListener('submit',handleSubmit)

loadBtn.addEventListener("click",onLoadMore)

const simple=new SimpleLightbox('.gallery__link');

function  scroll()
{
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}