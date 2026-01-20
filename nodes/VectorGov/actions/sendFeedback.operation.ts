import { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export async function sendFeedbackOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<object> {
  const credentials = await this.getCredentials('vectorGovApi');
  const baseUrl = credentials.baseUrl as string;

  const queryId = this.getNodeParameter('queryId', itemIndex) as string;
  const rating = this.getNodeParameter('rating', itemIndex) as string;

  const response = await this.helpers.httpRequest({
    method: 'POST' as IHttpRequestMethods,
    url: `${baseUrl}/api/v1/sdk/feedback`,
    body: {
      query_hash: queryId,
      is_like: rating === 'like',
    },
    json: true,
  });

  return response as object;
}
