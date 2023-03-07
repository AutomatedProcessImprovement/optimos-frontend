export class Dictionary<T> {
    items: { [key: string]: T } = {}

    add(key: string, value: T) {
        this.items[key] = value
    }

    remove(key: string) {
        delete this.items[key]
    }

    isEmpty() {
        return Object.keys(this.items).length === 0;
    }

    getValueByKey(key: string) {
        return  (key in this.items) ? this.items[key] : null
    }

    isKeyExisting(key: string) {
        return Object.keys(this.items).includes(key)
    }

    getAllItems() {
        return this.items
    }

    getAllKeys() {
        return Object.keys(this.items)
    }
}