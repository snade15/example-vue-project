// Vuex was to big to use for this small project ;)
// Singleton
class Store {
    constructor() {
       if(!Store.instance){
         this._data = {
             visit: {},
         };
         Store.instance = this;
       }

       return Store.instance;
    }

    set(key, value) {
        // Little cheat to clone the value to lose memory references to the original
        this._data[key] = JSON.parse(JSON.stringify(value));
    }

    get(key, _default={}) {
        return this._data[key] || _default;
    }

    delete(key){
        delete this._data[key];
    }
}

const instance = new Store();
Object.freeze(instance)

export default instance;
