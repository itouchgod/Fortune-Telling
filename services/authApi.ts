import type { UserProfile } from "@/types/bazi";

export async function getCurrentUser(): Promise<UserProfile | null> {
  return null;
}

export async function login(_email: string, _password: string): Promise<UserProfile> {
  throw new Error("登录接口尚未接入。");
}

export async function register(_name: string, _email: string, _password: string): Promise<UserProfile> {
  throw new Error("注册接口尚未接入。");
}

export async function logout(): Promise<void> {
  return Promise.resolve();
}
