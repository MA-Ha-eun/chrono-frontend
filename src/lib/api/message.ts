import { apiClient, shouldUseMockFallback } from "./client";
import { getErrorInfo } from "@/lib/utils";
import {
  MessageDetail,
  MessageListItem,
  MessageUserSearchItem,
  PageResponse,
  SendMessageRequest,
  UnreadMessageCountResponse,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

const BASE = "/v1/messages";

export async function sendMessage(data: SendMessageRequest): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    await mockApi.message.sendMessage(data);
    return;
  }

  try {
    await apiClient.post(BASE, data);
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `쪽지 보내기 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    await mockApi.message.sendMessage(data);
  }
}

export async function getInboxMessages(
  page = 0,
  size = 20
): Promise<PageResponse<MessageListItem>> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.message.getInboxMessages(page, size);
  }

  try {
    const response = await apiClient.get<PageResponse<MessageListItem>>(
      `${BASE}/inbox`,
      { params: { page, size } }
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `받은 쪽지 목록 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.message.getInboxMessages(page, size);
  }
}

export async function getSentMessages(
  page = 0,
  size = 20
): Promise<PageResponse<MessageListItem>> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.message.getSentMessages(page, size);
  }

  try {
    const response = await apiClient.get<PageResponse<MessageListItem>>(
      `${BASE}/sent`,
      { params: { page, size } }
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `보낸 쪽지 목록 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.message.getSentMessages(page, size);
  }
}

export async function getMessageDetail(
  messageId: number
): Promise<MessageDetail> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.message.getMessageDetail(messageId);
  }

  try {
    const response = await apiClient.get<MessageDetail>(`${BASE}/${messageId}`);
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `쪽지 상세 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.message.getMessageDetail(messageId);
  }
}

export async function deleteMessage(messageId: number): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    await mockApi.message.deleteMessage(messageId);
    return;
  }

  try {
    await apiClient.delete(`${BASE}/${messageId}`);
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `쪽지 삭제 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    await mockApi.message.deleteMessage(messageId);
  }
}

export async function searchMessageUsers(
  keyword: string,
  page = 0,
  size = 20
): Promise<PageResponse<MessageUserSearchItem>> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.message.searchUsers(keyword, page, size);
  }

  try {
    const response = await apiClient.get<PageResponse<MessageUserSearchItem>>(
      `${BASE}/users/search`,
      { params: { keyword, page, size } }
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `쪽지 사용자 검색 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.message.searchUsers(keyword, page, size);
  }
}

export async function getUnreadMessageCount(): Promise<UnreadMessageCountResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.message.getUnreadMessageCount();
  }

  try {
    const response = await apiClient.get<UnreadMessageCountResponse>(
      `${BASE}/unread-count`
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `안 읽은 쪽지 개수 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.message.getUnreadMessageCount();
  }
}
