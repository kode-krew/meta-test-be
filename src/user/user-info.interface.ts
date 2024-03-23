// user-info.interface.ts
export interface UserInfoKey {
    User_id: string; // hashKey(파티션 키)
    User_idx: string; // rangeKey(정렬 키)
}

export interface UserInfo extends UserInfoKey {
    User_email: string;
}