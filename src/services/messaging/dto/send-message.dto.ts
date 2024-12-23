export interface SendMessageDto {
  to: string;
  from?: string;
  subject: string;
  html: string;
}
