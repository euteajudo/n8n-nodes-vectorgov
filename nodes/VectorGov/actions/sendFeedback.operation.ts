import { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export async function sendFeedbackOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('vectorGovApi');
  const baseUrl = credentials.baseUrl as string;

  const queryId = this.getNodeParameter('queryId', itemIndex) as string;
  const rating = this.getNodeParameter('rating', itemIndex) as string;

  const apiKey = credentials.apiKey as string;

  const response = await this.helpers.httpRequest({
    method: 'POST' as IHttpRequestMethods,
    url: `${baseUrl}/api/v1/sdk/feedback`,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      query_hash: queryId,
      is_like: rating === 'like',
    },
    json: true,
  });

  return response as IDataObject;
}
