import {
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

export class BotConversa implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'BotConversa',
    name: 'botConversa',
    icon: 'file:botconversa.svg',
    group: ['communication'],
    version: 1,
    description: 'Send messages via BotConversa API',
    defaults: {
      name: 'BotConversa',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'botConversaApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        default: '',
        required: true,
        description: 'The contact ID to send the message to',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        description: 'The message to send',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const contactId = this.getNodeParameter('contactId', i) as string;
      const message = this.getNodeParameter('message', i) as string;
      const credentials = await this.getCredentials('botConversaApi');

      const options: IHttpRequestOptions = {
        method: 'POST',
        url: 'https://backend.botconversa.com.br/api/v1/webhook/messages',
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          contact_id: contactId,
          message: message,
        },
        json: true,
      };

      const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        'botConversaApi',
        options,
      );

      returnData.push({
        json: response,
        pairedItem: {
          item: i,
        },
      });
    }

    return [returnData];
  }
}
