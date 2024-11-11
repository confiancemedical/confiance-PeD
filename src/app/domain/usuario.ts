
export class Usuario{
    constructor(
        public id: string,
        public login: string,
        public nome: string,
        public email: string,
        public password: string,
        public ctGestor: string,
        public status: string,
        public dtLogin: string,
        public token: string){}
}