import { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export async function listDocumentsOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('vectorGovApi');
  const baseUrl = credentials.baseUrl as string;

  const limit = this.getNodeParameter('limit', itemIndex) as number;

  const apiKey = credentials.apiKey as string;

  const response = await this.helpers.httpRequest({
    method: 'GET' as IHttpRequestMethods,
    url: `${baseUrl}/api/v1/sdk/documents`,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    qs: { limit },
    json: true,
  });

  return response as IDataObject;
}
