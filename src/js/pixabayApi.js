export class PixabayApi{
    #page=1;
    #query='';
    #totalPages=0;
    #perPage=40;
    async getPhotos(){
        const axios = require('axios').default;
        const url=`https://pixabay.com/api/?key=30406660-ac7e622e7ed4967628563eb0e&q=${this.#query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.#perPage}&page=1&page=${this.#page}`;

        try{
            const response= await axios.get(url);
            console.log(response.data)
            return response.data;
        }
        catch(error)
        {
            console.log(error.message);
        }
    }
    incrementPage()
    {
        this.#page+=1;
    }
    set query(newQuery)
    {
        this.#query=newQuery;
    }
    get query()
    {
        return this.#query;
    }
    calculateTotalPages(total)
    {
        this.#totalPages=Math.ceil(total/ this.#perPage);
    }
    get isShownOnLoadMore(){
        return this.#page<this.#totalPages;
    }
    resetPage()
    {
        this.#page=1;
    }
}