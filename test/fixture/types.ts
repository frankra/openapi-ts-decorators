import { OpenAPI } from "../../lib/openapi.decorators"


export class EntityMetadata {
    @OpenAPI.DateTime()
    createdAt!: Date;
    @OpenAPI.Int32()
    createdBy!: number;
}
@OpenAPI.Schema({ name: 'User' })
export class UserPayload extends EntityMetadata {
    @OpenAPI.Int32({ required: true })
    id!: number;
    @OpenAPI.String({ required: true, minLength: 10, maxLength: 100 })
    name!: string
    @OpenAPI.String({ required: true })
    email!: string
    @OpenAPI.Int32()
    age?: number

    @OpenAPI.OneToOne(() => PhotoPayload)
    photo?: PhotoPayload

    @OpenAPI.OneToMany(() => PostPayload, {
        minItems: 1
    })
    posts?: PostPayload[]

}
@OpenAPI.Schema({ name: 'Post', description: 'User Post' })
export class PostPayload extends EntityMetadata {
    @OpenAPI.Int32({ required: true, description: 'Post Unique Identifier' })
    id!: number;
    @OpenAPI.String({ required: true, description: 'Post Content' })
    text!: string;
    @OpenAPI.OneToOne(type => UserPayload, { required: true, description: 'User who created the post' })
    author!: UserPayload;
}

@OpenAPI.Schema({ name: 'Photo', description: 'User Profile Picture' })
export class PhotoPayload extends EntityMetadata {
    @OpenAPI.Int32({ required: true, description: 'Photo Unique Identifier' })
    id!: number;
    @OpenAPI.Binary({ required: true })
    data!: string;
    @OpenAPI.OneToOne(user => UserPayload, { required: true, description: 'User who the Photo belongs to' })
    owner!: UserPayload;
}
