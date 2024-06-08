import { InstantiationType, registerSingleton } from "@mote/platform/instantiation/common/extensions";
import { IStorageService } from "../storage/storage.js";
import { IUserService } from "./user.js";
import { IUserModel } from "@mote/client/model/model";
import crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { environment } from "mote/common/enviroment.js";


const userMapper = {
    'owner_id': 'ownerId',
    'created_at': 'createdAt',
    'jwt_secret': 'jwtSecret',
}

const algorithm = 'aes-256-cbc';
const IV = "5183666c72eec9e4";

function encryptData(key: string, content: string) {
    const cipher = crypto.createCipheriv(algorithm, key, IV);
    return cipher.update(content, 'utf8', 'hex') + cipher.final('hex');
}

function decryptData(key: string, content: string) {
    const decipher = crypto.createDecipheriv(algorithm, key, IV);
    return decipher.update(content, 'hex', 'utf8') + decipher.final('utf8');
}

const transform = (item: IUserModel) => {
    if (item.jwtSecret) {
        item.jwtSecret = decryptData(environment.SECRET_KEY, item.jwtSecret);
    }
    
    return item;
}

class UserService implements IUserService {
    _serviceBrand: undefined;

    private namespace = 'user';

    constructor(
        @IStorageService private storageService: IStorageService
    ) {

    }

    count(query: Record<string, any>): Promise<number> {
        return this.storageService.count(query, 'user');
    }
   
    find(query: Record<string, any>): Promise<IUserModel[]> {
        return this.storageService.find<IUserModel>(query, 'user', { mapper: userMapper, transform });
    }

    async findOne(query: Record<string, any>): Promise<IUserModel | null> {
        const users = await this.find(query);
        return users[0] || null;
    }

    create(item: Partial<IUserModel> & Omit<IUserModel, "id">): Promise<number> {
        // Generate a random jwt secret
        const jwtSecret = crypto.randomBytes(64).toString("hex");
        // encrypt the jwt secret
        const encrypted = encryptData(environment.SECRET_KEY, jwtSecret);
       
        return this.storageService.create({
            ...item,
            jwt_secret:encrypted,
            namespace: 'user',
        })
    }

    update(item: Partial<IUserModel>): Promise<IUserModel> {
        throw new Error("Method not implemented.");
    }

    async retrieve(id: number): Promise<IUserModel | null> {
        return await this.storageService.retrieve<IUserModel>(id, this.namespace, { mapper: userMapper, transform });
    }

    getEmailSigninToken(user: IUserModel): string {
        return JWT.sign(
            {
                id: user.id,
                createdAt: new Date().toISOString(),
                type: "email-signin",
            },
            user.jwtSecret
        );
    }
}

registerSingleton(IUserService, UserService, InstantiationType.Delayed);