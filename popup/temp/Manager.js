'using strict';

class Manager {
    constructor(){

    }

    /**
     * 
     * @param {Object} object The object to create.
     */
    create(object){
    //It will get the type of the object and add it in the DB
    }

    /**
     * 
     * @param {string} type The type of the objects to retrieve.
     * @param {function} onSuccess The function to execute on success.
     */
    retrieveAll(type, onSuccess){

        //⚠ It has to be of type "notes"
        chrome.storage.sync.get(type, obj => onSuccess(obj[type]));
    }

    update(object){

    }

    delete(id){

    }
}

const manager = new Manager();