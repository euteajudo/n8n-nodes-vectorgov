import { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export async function estimateTokensOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<object> {
  const credentials = await this.getCredentials('vectorGovApi');
  const baseUrl = credentials.baseUrl as string;

  const context = this.getNodeParameter('context', itemIndex) as string;
  const query = this.getNodeParameter('tokenQuery', itemIndex, '') as string;
  const systemPrompt = this.getNodeParameter('tokenSystemPrompt', itemIndex, '') as string;

  const body: Record<string, unknown> = { context };

  if (query) {
    body.query = query;
  }
  if (systemPrompt) {
    body.system_prompt = systemPrompt;
  }

  const response = await this.helpers.httpRequest({
    method: 'POST' as IHttpRequestMethods,
    url: `${baseUrl}/api/v1/sdk/tokens`,
    body,
    json: true,
  });

  return response as object;
}
