export interface PostMessageToSlackOptions extends RequestInit {}

declare function postMessageToSlack(
  webhookUrl: string,
  payload: Record<string, any>,
  options?: PostMessageToSlackOptions,
): Promise<string>;

export = postMessageToSlack;
