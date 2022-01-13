import { OpenAPI } from "../../lib/openapi.decorators"



@OpenAPI.Schema({name: 'Post'})
export class PostPayload {
    @OpenAPI.Int32()
    id!: number;
    @OpenAPI.String()
    text!: string;
}

@OpenAPI.Schema({name: 'Photo'})
export class PhotoPayload {
    @OpenAPI.Int32()
    id!: number;
    @OpenAPI.Binary()
    data!: string;
}

@OpenAPI.Schema({name: 'User'})
export class UserPayload {
    @OpenAPI.Int32()
    id!: number;

    @OpenAPI.String()
    name!: string
    @OpenAPI.Int32()
    age!: number

    @OpenAPI.OneToOne(()=>PhotoPayload)
    photo!: PhotoPayload

    @OpenAPI.OneToMany(()=>PostPayload)
    posts!: PostPayload[]

}