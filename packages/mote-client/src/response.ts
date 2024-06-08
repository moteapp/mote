export class MoteResponse<T extends any> {

    constructor(
        public readonly data: T, 
        public status: number, 
        public statusText: string) {
       
    }
}