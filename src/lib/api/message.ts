import { apiClient } from "./client";
import {
  MessageDetail,
  MessageListItem,
  MessageUserSearchItem,
  PageResponse,
  SendMessageRequest,
  UnreadMessageCountResponse,
} from "@/types/api";

const BASE = "/v1/messages";

export async function sendMessage(data: SendMessageRequest): Promise<void> {
  await apiClient.post(BASE, data);
}

export async function getInboxMessages(
  page = 0,
  size = 20
): Promise<PageResponse<MessageListItem>> {
  const response = await apiClient.get<PageResponse<MessageListItem>>(
    `${BASE}/inbox`,
    { params: { page, size } }
  );
  return response.data;
}

export async function getSentMessages(
  page = 0,
  size = 20
): Promise<PageResponse<MessageListItem>> {
  const response = await apiClient.get<PageResponse<MessageListItem>>(
    `${BASE}/sent`,
    { params: { page, size } }
  );
  return response.data;
}

export async function getMessageDetail(
  messageId: number
): Promise<MessageDetail> {
  const response = await apiClient.get<MessageDetail>(`${BASE}/${messageId}`);
  return response.data;
}

export async function deleteMessage(messageId: number): Promise<void> {
  await apiClient.delete(`${BASE}/${messageId}`);
}

export async function searchMessageUsers(
  keyword: string,
  page = 0,
  size = 20
): Promise<PageResponse<MessageUserSearchItem>> {
  const response = await apiClient.get<PageResponse<MessageUserSearchItem>>(
    `${BASE}/users/search`,
    { params: { keyword, page, size } }
  );
  return response.data;
}

export async function getUnreadMessageCount(): Promise<UnreadMessageCountResponse> {
  const response = await apiClient.get<UnreadMessageCountResponse>(
    `${BASE}/unread-count`
  );
  return response.data;
}
