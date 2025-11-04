export class Shelter {
    public id: number;
    public name: string;
    public email: string;
    public password_hash: string;
    public phone: string;
    public city: string;
    public address: string;

    constructor(
        id: number,
        name: string,
        email: string,
        password_hash: string,
        phone: string,
        city: string,
        address: string)
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
        this.phone = phone;
        this.city = city;
        this.address = address;
    }
}