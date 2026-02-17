import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CreatePaymentResponse {
    checkoutUrl: string;
    sessionId: string;
}
export interface TeamInfo {
    teamType: Team;
    owner?: string;
    logo?: string;
    name: string;
    purse: bigint;
}
export interface AdminDashboardStats {
    pendingPayments: bigint;
    totalTeams: bigint;
    anonymousRegistrations: bigint;
    totalSponsorInquiries: bigint;
    authenticatedRegistrations: bigint;
    pendingSponsorInquiries: bigint;
    paidRegistrations: bigint;
    totalRegistrations: bigint;
}
export interface PaymentSuccessResponse {
    message: string;
    payment: {
        status: string;
        paymentMethod: {
            last4: string;
            brand: string;
        };
        currency: string;
        amount: bigint;
    };
}
export interface FileUpload {
    id: string;
    blob: ExternalBlob;
    name: string;
    timestamp: bigint;
}
export interface SponsorInquiry {
    status: SponsorInquiryStatus;
    contact: string;
    name: string;
    company: string;
    message: string;
    timestamp: bigint;
    sponsorshipLevel: string;
}
export interface RegistrationAnalytics {
    byTeam: Array<[Team, bigint]>;
    byJerseySize: Array<[JerseySize, bigint]>;
    byExperience: Array<[CricketExperience, bigint]>;
    byCategory: Array<[PlayerCategory, bigint]>;
}
export interface PlayerRegistration {
    age: bigint;
    paymentStatus: boolean;
    contact: string;
    jerseySize: JerseySize;
    name: string;
    email: string;
    experience: CricketExperience;
    timestamp: bigint;
    category: PlayerCategory;
    teamChoice: Team;
    aadhaarNumber: string;
}
export interface PaymentCancelResponse {
    message: string;
    sessionId: string;
}
export interface ContentPage {
    title: string;
    content: string;
    lastUpdated: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum CricketExperience {
    academy = "academy",
    district = "district",
    state = "state"
}
export enum JerseySize {
    l40 = "l40",
    m38 = "m38",
    s36 = "s36",
    xl42 = "xl42",
    xxxl46 = "xxxl46",
    xxl44 = "xxl44"
}
export enum PlayerCategory {
    allRounder = "allRounder",
    bowler = "bowler",
    wicketkeeper = "wicketkeeper",
    batsman = "batsman"
}
export enum SponsorInquiryStatus {
    pending = "pending",
    rejected = "rejected",
    contacted = "contacted",
    confirmed = "confirmed"
}
export enum Team {
    patliputraLeaders = "patliputraLeaders",
    tirhutChallengers = "tirhutChallengers",
    mithilaPride = "mithilaPride",
    bhojpurFighters = "bhojpurFighters",
    seemanchalRiser = "seemanchalRiser",
    magadhUnited = "magadhUnited"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTeamInfo(name: string, owner: string | null, logo: string | null, purse: bigint, teamType: Team): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(): Promise<CreatePaymentResponse>;
    deleteContentPage(pageId: string): Promise<void>;
    deleteFile(fileId: string): Promise<void>;
    deleteSponsorInquiry(inquiryId: bigint): Promise<void>;
    filterFilesByPrefix(prefix: string): Promise<Array<FileUpload>>;
    getAdminDashboardStats(): Promise<AdminDashboardStats>;
    getAllAnonymousRegistrations(): Promise<Array<[string, PlayerRegistration]>>;
    getAllContentPages(): Promise<Array<[string, ContentPage]>>;
    getAllFiles(): Promise<Array<[string, FileUpload]>>;
    getAllPlayerRegistrations(): Promise<Array<[Principal, PlayerRegistration]>>;
    getAllSponsorInquiries(): Promise<Array<[bigint, SponsorInquiry]>>;
    getCallerIdAsText(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(pageId: string): Promise<ContentPage>;
    getFile(fileId: string): Promise<FileUpload | null>;
    getPlayerRegistration(): Promise<PlayerRegistration | null>;
    getPlayerRegistrationByPrincipal(user: Principal): Promise<PlayerRegistration | null>;
    getRegistrationAnalytics(): Promise<RegistrationAnalytics>;
    getRegistrationCount(): Promise<bigint>;
    getSortedTeamInfos(): Promise<Array<TeamInfo>>;
    getTeams(): Promise<Array<TeamInfo>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<PlayerCategory>>;
    listExperienceLevels(): Promise<Array<CricketExperience>>;
    listJerseySizes(): Promise<Array<JerseySize>>;
    listTeams(): Promise<Array<Team>>;
    paymentCancel(sessionId: string): Promise<PaymentCancelResponse>;
    paymentSuccess(sessionId: string, accountId: string, caffeineCustomerId: string): Promise<PaymentSuccessResponse>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setupStripePrices(): Promise<void>;
    submitPlayerRegistration(name: string, age: bigint, contact: string, email: string, aadhaarNumber: string, experience: CricketExperience, teamChoice: Team, category: PlayerCategory, jerseySize: JerseySize, paymentStatus: boolean, userId: string | null, anonymous: boolean): Promise<void>;
    submitSponsorInquiry(name: string, company: string, contact: string, sponsorshipLevel: string, message: string): Promise<bigint>;
    updateContent(pageId: string, title: string, content: string): Promise<void>;
    updatePlayerPaymentStatus(userPrincipal: Principal | null, anonymousId: string | null, paymentStatus: boolean): Promise<void>;
    updateSponsorInquiryStatus(inquiryId: bigint, status: SponsorInquiryStatus): Promise<void>;
    updateTeamInfo(oldName: string, name: string, owner: string | null, logo: string | null, purse: bigint, teamType: Team): Promise<void>;
    updateTeamLogo(teamName: string, logo: string): Promise<void>;
    updateTeamPurse(teamName: string, purse: bigint): Promise<void>;
    uploadFile(name: string, blob: ExternalBlob): Promise<string>;
}
