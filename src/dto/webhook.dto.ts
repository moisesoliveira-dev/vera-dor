import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WebhookContactDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    number: string;

    @IsString()
    email: string;

    @IsString()
    profilePicUrl: string;

    @IsBoolean()
    isGroup: boolean;

    @IsBoolean()
    hasWhatsapp: boolean;

    @IsBoolean()
    hasTelegram: boolean;

    @IsOptional()
    @IsNumber()
    defaultUserId?: number;

    @IsOptional()
    @IsNumber()
    defaultQueueId?: number;

    @IsOptional()
    @IsString()
    observation?: string;

    @IsOptional()
    @IsString()
    document?: string;

    @IsOptional()
    @IsString()
    contract?: string;

    @IsOptional()
    @IsString()
    value?: string;

    @IsString()
    kind: string;

    @IsBoolean()
    imported: boolean;

    @IsBoolean()
    favorite: boolean;

    @IsOptional()
    @IsString()
    whatsAppId?: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsString()
    instagram?: string;

    @IsOptional()
    @IsString()
    linkedIn?: string;

    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsString()
    cnpj?: string;

    @IsOptional()
    @IsString()
    validity?: string;

    @IsOptional()
    @IsString()
    telegramId?: string;

    @IsOptional()
    @IsString()
    telegramUsername?: string;

    @IsBoolean()
    blacklist: boolean;

    @IsDateString()
    createdAt: string;

    @IsDateString()
    updatedAt: string;
}

export class WebhookWhatsappDto {
    @IsOptional()
    @IsString()
    mediaUrl?: string;

    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    session: string;

    @IsString()
    qrcode: string;

    @IsString()
    status: string;

    @IsString()
    battery: string;

    @IsBoolean()
    plugged: boolean;

    @IsNumber()
    defaultQueueId: number;

    @IsNumber()
    retries: number;

    @IsString()
    greetingMessage: string;

    @IsString()
    closeMessage: string;

    @IsString()
    outTimeMessage: string;

    @IsString()
    contingencyMessage: string;

    @IsString()
    greetingArchive: string;

    @IsString()
    endContingencyMessage: string;

    @IsBoolean()
    isDefault: boolean;

    @IsString()
    startTime: string;

    @IsString()
    finishTime: string;

    @IsBoolean()
    sum: boolean;

    @IsBoolean()
    mon: boolean;

    @IsBoolean()
    tue: boolean;

    @IsBoolean()
    wed: boolean;

    @IsBoolean()
    thu: boolean;

    @IsBoolean()
    fri: boolean;

    @IsBoolean()
    sat: boolean;

    @IsOptional()
    @IsString()
    resetAt?: string;

    @IsDateString()
    syncAt: string;

    @IsNumber()
    syncPercent: number;

    @IsBoolean()
    enabled: boolean;

    @IsDateString()
    startedAt: string;

    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    apiId?: string;

    @IsOptional()
    @IsString()
    apiHash?: string;

    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    secretCode?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    apiKey?: string;

    @IsOptional()
    @IsString()
    voipToken?: string;

    @IsOptional()
    @IsString()
    pageId?: string;

    @IsOptional()
    @IsString()
    accountRestriction?: string;

    @IsOptional()
    @IsString()
    accountViolationCount?: string;

    @IsOptional()
    @IsString()
    messagingLimit?: string;

    @IsBoolean()
    npsEnabled: boolean;

    @IsString()
    npsMessage: string;

    @IsOptional()
    @IsString()
    provider?: string;

    @IsBoolean()
    settedWebHook: boolean;

    @IsBoolean()
    enableZeroMenu: boolean;

    @IsNumber()
    openingHoursId: number;

    @IsDateString()
    qrCreatedAt: string;

    @IsOptional()
    @IsString()
    host?: string;

    @IsNumber()
    port: number;

    @IsBoolean()
    tls: boolean;

    @IsDateString()
    createdAt: string;

    @IsDateString()
    updatedAt: string;

    @IsOptional()
    @IsDateString()
    deletedAt?: string;
}

export class WebhookTicketDto {
    @IsNumber()
    id: number;

    @IsString()
    status: string;

    @IsNumber()
    unreadMessages: number;

    @IsNumber()
    unreadMessages2: number;

    @IsString()
    lastMessage: string;

    @IsBoolean()
    isGroup: boolean;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsNumber()
    contactId: number;

    @IsNumber()
    whatsappId: number;

    @IsOptional()
    @IsNumber()
    queueId?: number;

    @IsString()
    protocol: string;

    @IsString()
    lastAction: string;

    @IsOptional()
    @IsNumber()
    destinationUserId?: number;

    @IsNumber()
    statusBot: number;

    @IsNumber()
    syncTotal: number;

    @IsString()
    onMenu: string;

    @IsOptional()
    @IsNumber()
    npsValue?: number;

    @IsOptional()
    @IsDateString()
    closedAt?: string;

    @IsDateString()
    lastMessageAt: string;

    @IsOptional()
    @IsNumber()
    departmentId?: number;

    @IsOptional()
    @IsBoolean()
    imported?: boolean;

    @IsOptional()
    @IsString()
    transmissionId?: string;

    @IsString()
    kind: string;

    @IsNumber()
    onMenuId: number;

    @IsOptional()
    @IsString()
    window?: string;

    @IsOptional()
    @IsString()
    closureObservation?: string;

    @IsOptional()
    @IsString()
    sourceUrl?: string;

    @IsString()
    origin: string;

    @IsDateString()
    createdAt: string;

    @IsDateString()
    updatedAt: string;

    @ValidateNested()
    @Type(() => WebhookContactDto)
    contact: WebhookContactDto;

    @IsOptional()
    queue?: any;

    @ValidateNested()
    @Type(() => WebhookWhatsappDto)
    whatsapp: WebhookWhatsappDto;

    @IsOptional()
    user?: any;
}

export class WebhookMessageDataDto {
    @IsOptional()
    @IsString()
    mediaUrl?: string;

    @IsOptional()
    @IsString()
    mediaPath?: string;

    @IsNumber()
    ack: number;

    @IsBoolean()
    read: boolean;

    @IsBoolean()
    fromMe: boolean;

    @IsString()
    body: string;

    @IsString()
    mediaType: string;

    @IsString()
    messageId: string;

    @IsOptional()
    @IsNumber()
    queueId?: number;

    @IsOptional()
    @IsString()
    templateId?: string;

    @IsBoolean()
    isDeleted: boolean;

    @IsDateString()
    createdAt: string;

    @IsDateString()
    updatedAt: string;

    @IsOptional()
    @IsString()
    quotedMsgId?: string;

    @IsNumber()
    ticketId: number;

    @IsNumber()
    contactId: number;

    @IsNumber()
    groupContactId: number;

    @IsBoolean()
    fromGroup: boolean;

    @IsNumber()
    connectionId: number;

    @IsOptional()
    @IsString()
    vcardContactId?: string;

    @IsOptional()
    @IsBoolean()
    isForwarded?: boolean;

    @IsOptional()
    @IsNumber()
    senderUserId?: number;

    @IsOptional()
    @IsNumber()
    destinationUserId?: number;

    @IsBoolean()
    sent: boolean;

    @IsOptional()
    @IsString()
    imageId?: string;

    @IsOptional()
    @IsString()
    errorMessage?: string;

    @IsString()
    kind: string;

    @IsOptional()
    @IsString()
    transmissionId?: string;

    @IsBoolean()
    downloaded: boolean;

    @IsOptional()
    vCardContact?: any;

    @IsOptional()
    quotedMsg?: any;

    @ValidateNested()
    @Type(() => WebhookContactDto)
    contact: WebhookContactDto;

    @ValidateNested()
    @Type(() => WebhookTicketDto)
    ticket: WebhookTicketDto;
}

export class WebhookPayloadDto {
    @ValidateNested()
    @Type(() => WebhookMessageDataDto)
    data: WebhookMessageDataDto;

    @IsString()
    type: string;
}
