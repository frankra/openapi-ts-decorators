import { OpenAPI } from "../../lib/openapi.decorators"


@OpenAPI.Schema({ name: 'User' })
export class UserPayload {
    @OpenAPI.Int32({ required: true })
    id!: number;
    @OpenAPI.String({ required: true })
    name!: string
    @OpenAPI.String({ required: true })
    email!: string
    @OpenAPI.Int32()
    age?: number

    @OpenAPI.OneToOne(() => PhotoPayload)
    photo!: PhotoPayload

    @OpenAPI.OneToMany(() => PostPayload)
    posts!: PostPayload[]

}
@OpenAPI.Schema({ name: 'Post', description: 'User Post' })
export class PostPayload {
    @OpenAPI.Int32({ required: true, description: 'Post Unique Identifier' })
    id!: number;
    @OpenAPI.String({ required: true, description: 'Post Content' })
    text!: string;
    @OpenAPI.OneToOne(type => UserPayload, { required: true, description: 'User who created the post' })
    author!: UserPayload;
}

@OpenAPI.Schema({ name: 'Photo', description: 'User Profile Picture' })
export class PhotoPayload {
    @OpenAPI.Int32({ required: true, description: 'Photo Unique Identifier' })
    id!: number;
    @OpenAPI.Binary({ required: true })
    data!: string;
    @OpenAPI.OneToOne(user => UserPayload, { required: true, description: 'User who the Photo belongs to' })
    owner!: UserPayload;
}