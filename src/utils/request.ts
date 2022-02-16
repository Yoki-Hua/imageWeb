import axios from 'axios'
import { ElNotification as elNotify } from 'element-plus'
import type { UploadedImage } from './types'

const request = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
	timeout: 20000
})

request.interceptors.response.use(
	(response) => response.data,
	(error) => {
		elNotify({
			message: error?.response?.data || String(error),
			duration: 0,
			type: 'error'
		})
		return Promise.reject(error)
	}
)

export const requestListImages = (param:any,token:any): Promise<UploadedImage[]> => request.post('/islery/list/files?bucketName=image-islery&prefix=img&num=23&nextMarker='+param.nextMarker,{},
	{
		headers:token
	})
export const requestUploadImages = (data: FormData,token:any) => request.put('/islery/upload', data,{
	headers:token
})
export const requestDeleteImage = (fileName: string,token:any):Promise<boolean> => request.delete('/islery/delete?bucketName=image-islery&fileName='+fileName,{
	headers:token
})
export const  requestLogin =(data:{}):Promise<any> =>request.post('/islery/login',data)
