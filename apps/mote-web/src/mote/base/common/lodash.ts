export class Lodash {
    public static findIndex(value: any[], predicate: (item: any) => boolean): number {
        return value.findIndex(predicate)
    }

    public static get(object: any, path: string[]): any {
        return path.reduce((acc, key) => acc[key], object)
    }

    public static findLast<T>(value: T[], predicate: (item: T) => boolean): T | undefined {
        return value.reverse().find(predicate)
    }
}