'using strict';

class Manager {
    constructor() {

    }

    /**
     * 
     * @param {Object} KeyValue pair object.
     * object = {key: value}
     * @returns {Promise}
     */
    create(object) {

        return new Promise((resolve, reject) => {
            chrome.storage.sync.set(object, () => resolve());
        });
    }

    /**
     * @summary Inserts a new element in a list.
     * @param {*} key The key of the list of items.
     * @param {*} value The value to be pushed to the list.
     * @returns {Promise}
     */
    push(key, value) {
        return new Promise((resolve, reject) => {

            chrome.storage.sync.get(key, list => {
                const arrayCopy = list[key].slice();
                const valueCopy = value;
                valueCopy.id = (new Date()).getTime();
                arrayCopy.push(valueCopy);

                chrome.storage.sync.set({ [key]: arrayCopy }, () => resolve());
            });
        });
    }

    /**
     * @summary Retrieves an object of provided key.
     * @param {string} key The type of the objects to retrieve.
     * @param {function} onSuccess The function to execute on success.
     * @returns {Promise}
     */
    retrieve(key) {

        //⚠ It has to be of type "notes"
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, obj => resolve(obj[key]));
        });
    }

    /**
     * @summary Updates an object or an elemt of an object.
     * @param {object} obj The object to update.
     * @param {String} obj.key The key of the object to update.
     * @param {*} obj.value The new value of the object.
     * @param {String} [obj.id] The id of the object to update. If none provided, it will update the whole object.
     * @returns {Promise}
     */
    update(obj) {
        return new Promise((resolve, reject) => {

            //If id is provided, update the specified element of the array.
            if (obj.id) {
                chrome.storage.sync.get(obj.key, list => {
                    const arrayCopy = list[key].slice();
                    const index = arrayCopy.findIndex(el => el.id == obj.id);
                    if (index === -1) {
                        reject(`Object of id ${obj.id} not found`);
                    }
                    else {
                        arrayCopy[index] = obj.value;
                        arrayCopy[index].id = obj.id;

                        chrome.storage.sync.set({ [obj.key]: arrayCopy }, () => {
                            resolve();
                        });
                    }
                });
            }
            else {
                chrome.storage.sync.set({ [obj.key]: obj.value });
            }
        });
    }

    /**
     * @summary Deletes an object or an element of an object.
     * @param {String} key The key of the object to remove.
     * @param {*} [id] The id of the element inside the object to be deleted. If none provided, it will delete the whole object.
     * @returns {Promise}
     */
    delete(key, id) {

        return new Promise((resolve, reject) => {

            //If id is provided, delete of the array the element that has the id provided.
            if (id) {
                chrome.storage.sync.get(key, list => {
                    const arrayCopy = list[key].slice();
                    const index = arrayCopy.findIndex(el => el.id == id);
                    const deletedItem = arrayCopy.splice(index, 1);
                    const obj = {};

                    obj[key] = arrayCopy;

                    chrome.storage.sync.set(obj, () => {
                        resolve();
                    });
                });
            }
            else {
                chrome.storage.sync.remove(key, () => resolve());
            }
        });
    }
}

const manager = new Manager();