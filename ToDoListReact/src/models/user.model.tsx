export interface UserModel {
    id: number;
    username: string
}

export interface UserConnect {
    user?: UserModel,
    token?: string
}

export type UserConnectOrNull = UserModel | null