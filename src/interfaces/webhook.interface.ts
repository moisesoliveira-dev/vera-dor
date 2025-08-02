export interface WebhookContact {
    id: number;
    name: string;
    number: string;
    email: string;
    profilePicUrl: string;
    isGroup: boolean;
    hasWhatsapp: boolean;
    hasTelegram: boolean;
    defaultUserId: number | null;
    defaultQueueId: number | null;
    observation: string | null;
    document: string | null;
    contract: string | null;
    value: string | null;
    kind: string;
    imported: boolean;
    favorite: boolean;
    whatsAppId: string | null;
    cpf: string | null;
    instagram: string | null;
    linkedIn: string | null;
    company: string | null;
    cnpj: string | null;
    validity: string | null;
    telegramId: string | null;
    telegramUsername: string | null;
    blacklist: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WebhookWhatsapp {
    mediaUrl: string | null;
    id: number;
    name: string;
    session: string;
    qrcode: string;
    status: string;
    battery: string;
    plugged: boolean;
    defaultQueueId: number;
    retries: number;
    greetingMessage: string;
    closeMessage: string;
    outTimeMessage: string;
    contingencyMessage: string;
    greetingArchive: string;
    endContingencyMessage: string;
    isDefault: boolean;
    startTime: string;
    finishTime: string;
    sum: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    resetAt: string | null;
    syncAt: string;
    syncPercent: number;
    enabled: boolean;
    startedAt: string;
    type: string;
    apiId: string | null;
    apiHash: string | null;
    phoneNumber: string;
    secretCode: string | null;
    password: string | null;
    username: string | null;
    apiKey: string | null;
    voipToken: string | null;
    pageId: string | null;
    accountRestriction: string | null;
    accountViolationCount: string | null;
    messagingLimit: string | null;
    npsEnabled: boolean;
    npsMessage: string;
    provider: string | null;
    settedWebHook: boolean;
    enableZeroMenu: boolean;
    openingHoursId: number;
    qrCreatedAt: string;
    host: string | null;
    port: number;
    tls: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface WebhookTicket {
    id: number;
    status: string;
    unreadMessages: number;
    unreadMessages2: number;
    lastMessage: string;
    isGroup: boolean;
    userId: number | null;
    contactId: number;
    whatsappId: number;
    queueId: number | null;
    protocol: string;
    lastAction: string;
    destinationUserId: number | null;
    statusBot: number;
    syncTotal: number;
    onMenu: string;
    npsValue: number | null;
    closedAt: string | null;
    lastMessageAt: string;
    departmentId: number | null;
    imported: boolean | null;
    transmissionId: string | null;
    kind: string;
    onMenuId: number;
    window: string | null;
    closureObservation: string | null;
    sourceUrl: string | null;
    origin: string;
    createdAt: string;
    updatedAt: string;
    contact: WebhookContact;
    queue: any | null; // No exemplo estava null, você pode definir a interface depois se precisar
    whatsapp: WebhookWhatsapp;
    user: any | null; // No exemplo estava null, você pode definir a interface depois se precisar
}

export interface WebhookMessageData {
    mediaUrl: string | null;
    mediaPath: string | null;
    ack: number;
    read: boolean;
    fromMe: boolean;
    body: string;
    mediaType: string;
    messageId: string;
    queueId: number | null;
    templateId: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    quotedMsgId: string | null;
    ticketId: number;
    contactId: number;
    groupContactId: number;
    fromGroup: boolean;
    connectionId: number;
    vcardContactId: string | null;
    isForwarded: boolean | null;
    senderUserId: number | null;
    destinationUserId: number | null;
    sent: boolean;
    imageId: string | null;
    errorMessage: string | null;
    kind: string;
    transmissionId: string | null;
    downloaded: boolean;
    vCardContact: any | null; // No exemplo estava null
    quotedMsg: any | null; // No exemplo estava null
    contact: WebhookContact;
    ticket: WebhookTicket;
}

export interface WebhookPayload {
    data: WebhookMessageData;
    type: string;
}
