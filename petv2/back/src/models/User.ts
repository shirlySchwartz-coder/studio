export class User {
    public id: number;
    public full_name: string;
    public role_id: number;
    public token?: string;
    public constructor(
        id: number,
        full_name: string,
        role_id: number,
        token?: string
    ) {
        this.id = id;
        this.full_name = full_name;
        this.role_id = role_id;
        this.token = token;
    }   
}