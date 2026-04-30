import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class VideoSailor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VideoSailor',
		name: 'videoSailor',
		icon: 'file:videosailor.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Download, transcribe, trim, cut, resize, and add subtitles to videos',
		defaults: {
			name: 'VideoSailor',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'videoSailorApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
			{
				name: 'Download',
				value: 'download',
				description:
					'Download a video and return the file as binary data',
				action: 'Download a video',
			},
			{
				name: 'Video Info',
					value: 'videoInfo',
					description: 'Get video metadata without downloading',
					action: 'Get video info',
				},
					{
						name: 'Trim',
						value: 'trim',
						description: 'Trim a video to a time range',
						action: 'Trim a video',
					},
					{
						name: 'Cut',
						value: 'cut',
						description: 'Cut a segment from a video (alias for trim)',
						action: 'Cut a video segment',
					},
					{
						name: 'Resize',
						value: 'resize',
						description: 'Resize a video to new dimensions or aspect ratio',
						action: 'Resize a video',
					},
					{
						name: 'Transcribe',
						value: 'transcribe',
						description: 'Transcribe a video and get timestamped words/segments',
						action: 'Transcribe a video',
					},
					{
						name: 'Subtitles',
						value: 'subtitles',
						description: 'Burn subtitles into a video',
						action: 'Add subtitles to a video',
					},
					{
						name: 'Info',
						value: 'info',
						description: 'Get video dimensions and aspect ratio',
						action: 'Get video dimensions',
					},
				],
				default: 'download',
			},

			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://youtube.com/watch?v=... or https://example.com/video.mp4',
				description:
					'URL of the media. Supports YouTube, TikTok, Instagram, Twitter/X, Vimeo, and 1 000+ sites.',
			},

			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				description:
					'Name of the binary property to write the downloaded file into',
				displayOptions: { show: { operation: ['download'] } },
			},

			{
				displayName: 'Start Time (seconds)',
				name: 'start',
				type: 'number',
				required: true,
				default: 0,
				typeOptions: { minValue: 0, numberPrecision: 2 },
				description: 'Start time in seconds',
				displayOptions: { show: { operation: ['trim', 'cut'] } },
			},
			{
				displayName: 'End Time (seconds)',
				name: 'end',
				type: 'number',
				required: true,
				default: 10,
				typeOptions: { minValue: 0.01, numberPrecision: 2 },
				description: 'End time in seconds',
				displayOptions: { show: { operation: ['trim', 'cut'] } },
			},

			{
				displayName: 'Resize Mode',
				name: 'resizeMode',
				type: 'options',
				default: 'dimensions',
				options: [
					{ name: 'Width & Height', value: 'dimensions' },
					{ name: 'Aspect Ratio + Resolution', value: 'aspectRatio' },
				],
				displayOptions: { show: { operation: ['resize'] } },
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 1920,
				typeOptions: { minValue: 1 },
				displayOptions: { show: { operation: ['resize'], resizeMode: ['dimensions'] } },
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 1080,
				typeOptions: { minValue: 1 },
				displayOptions: { show: { operation: ['resize'], resizeMode: ['dimensions'] } },
			},
			{
				displayName: 'Aspect Ratio',
				name: 'aspectRatio',
				type: 'options',
				default: '16:9',
				options: [
					{ name: '16:9', value: '16:9' },
					{ name: '9:16', value: '9:16' },
					{ name: '4:3', value: '4:3' },
					{ name: '1:1', value: '1:1' },
				],
				displayOptions: { show: { operation: ['resize'], resizeMode: ['aspectRatio'] } },
			},
			{
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				default: 'Full HD',
				options: [
					{ name: 'HD (720p)', value: 'HD' },
					{ name: 'Full HD (1080p)', value: 'Full HD' },
					{ name: '2K (1440p)', value: '2K' },
					{ name: '4K (2160p)', value: '4K' },
					{ name: '8K (4320p)', value: '8K' },
				],
				displayOptions: { show: { operation: ['resize'], resizeMode: ['aspectRatio'] } },
			},

			{
				displayName: 'Subtitle Words (JSON)',
				name: 'subtitleWords',
				type: 'json',
				default: '[]',
				required: true,
				description:
					'JSON array of word objects: [{ "word": "Hello", "start": 0.5, "end": 1.2 }, ...]',
				displayOptions: { show: { operation: ['subtitles'] } },
			},
			{
				displayName: 'Subtitle Options',
				name: 'subtitleOptions',
				type: 'collection',
				default: {},
				placeholder: 'Add Option',
				displayOptions: { show: { operation: ['subtitles'] } },
				options: [
					{
						displayName: 'X Position',
						name: 'x',
						type: 'number',
						default: 960,
						description: 'Horizontal position of subtitles',
					},
					{
						displayName: 'Y Position',
						name: 'y',
						type: 'number',
						default: 900,
						description: 'Vertical position of subtitles',
					},
					{
						displayName: 'Font Size',
						name: 'size',
						type: 'number',
						default: 60,
					},
					{
						displayName: 'Alignment',
						name: 'alignment',
						type: 'options',
						default: 'center-center',
						options: [
							{ name: 'Center Center', value: 'center-center' },
							{ name: 'Center Top', value: 'center-top' },
							{ name: 'Center Bottom', value: 'center-bottom' },
						],
					},
					{
						displayName: 'Font Color',
						name: 'color',
						type: 'color',
						default: '#FFFFFF',
					},
					{
						displayName: 'Stroke Color',
						name: 'strokeColor',
						type: 'color',
						default: '#000000',
					},
					{
						displayName: 'Stroke Width',
						name: 'strokeWidth',
						type: 'number',
						default: 2,
						typeOptions: { minValue: 0, maxValue: 10 },
					},
					{
						displayName: 'Background Color',
						name: 'backgroundColor',
						type: 'color',
						default: '#00000000',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('videoSailorApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const url = this.getNodeParameter('url', i) as string;

				if (!url) {
					throw new NodeOperationError(this.getNode(), 'URL is required', { itemIndex: i });
				}

				let response: IDataObject;

				switch (operation) {
					case 'download': {
						const downloadResponse = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/download', { url }),
						)) as { downloadUrl: string; filename: string };

						if (!downloadResponse.downloadUrl) {
							throw new NodeOperationError(
								this.getNode(),
								'Download initiation failed: no downloadUrl returned',
								{ itemIndex: i },
							);
						}

						const binaryPropertyName = this.getNodeParameter(
							'binaryPropertyName',
							i,
							'data',
						) as string;

						const fileBuffer = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							{
								method: 'GET',
								url: downloadResponse.downloadUrl,
								encoding: 'arraybuffer',
								json: false,
							},
						)) as Buffer;

						const binaryData = await this.helpers.prepareBinaryData(
							fileBuffer,
							downloadResponse.filename,
						);

						const executionData = this.helpers.constructExecutionMetaData(
							[
								{
									json: {
										filename: downloadResponse.filename,
										downloadUrl: downloadResponse.downloadUrl,
									},
									binary: { [binaryPropertyName]: binaryData },
								},
							],
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
						continue;
					}

					case 'videoInfo': {
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/video', { url }),
						);
						break;
					}

					case 'trim': {
						const start = this.getNodeParameter('start', i) as number;
						const end = this.getNodeParameter('end', i) as number;
						validateTimeRange(this, i, start, end);
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/trim', { url, start, end }),
						);
						break;
					}

					case 'cut': {
						const start = this.getNodeParameter('start', i) as number;
						const end = this.getNodeParameter('end', i) as number;
						validateTimeRange(this, i, start, end);
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/cut', { url, start, end }),
						);
						break;
					}

					case 'resize': {
						const resizeMode = this.getNodeParameter('resizeMode', i) as string;
						const body: IDataObject = { url };

						if (resizeMode === 'dimensions') {
							body.width = this.getNodeParameter('width', i) as number;
							body.height = this.getNodeParameter('height', i) as number;
						} else {
							body.aspect_ratio = this.getNodeParameter('aspectRatio', i) as string;
							body.resolution = this.getNodeParameter('resolution', i) as string;
						}

						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/resize', body),
						);
						break;
					}

					case 'transcribe': {
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/transcribe', { url }),
						);
						break;
					}

					case 'subtitles': {
						const wordsRaw = this.getNodeParameter('subtitleWords', i) as string;
						let words: IDataObject[];
						try {
							words = typeof wordsRaw === 'string' ? JSON.parse(wordsRaw) : wordsRaw;
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'Subtitle Words must be valid JSON',
								{ itemIndex: i },
							);
						}

						const opts = this.getNodeParameter('subtitleOptions', i, {}) as IDataObject;
						const subtitles: IDataObject = {
							x: (opts.x as number) ?? 960,
							y: (opts.y as number) ?? 900,
							size: (opts.size as number) ?? 60,
							alignment: (opts.alignment as string) ?? 'center-center',
							color: (opts.color as string) ?? '#FFFFFF',
							strokeColor: (opts.strokeColor as string) ?? '#000000',
							strokeWidth: (opts.strokeWidth as number) ?? 2,
							backgroundColor: (opts.backgroundColor as string) ?? '#00000000',
							words,
						};

						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/subtitles', { url, subtitles }),
						);
						break;
					}

					case 'info': {
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'videoSailorApi',
							buildRequest(baseUrl, 'POST', '/api/info', { url }),
						);
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
							itemIndex: i,
						});
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(response),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				const nodeError = new NodeApiError(this.getNode(), error as JsonObject);
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: nodeError.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw nodeError;
			}
		}

		return [returnData];
	}
}

function buildRequest(
	baseUrl: string,
	method: 'GET' | 'POST',
	path: string,
	body?: IDataObject,
): IHttpRequestOptions {
	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${path}`,
		headers: { Accept: 'application/json' },
		json: true,
	};
	if (body) {
		options.body = body;
	}
	return options;
}

function validateTimeRange(ctx: IExecuteFunctions, index: number, start: number, end: number) {
	if (end <= start) {
		throw new NodeOperationError(ctx.getNode(), 'End time must be greater than start time', {
			itemIndex: index,
		});
	}
}
