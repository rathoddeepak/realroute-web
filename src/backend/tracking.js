import {perform} from './request';
const code = 'logistics'
export default class Tracking {
	static async TrackingData (task_id) {
		var response = await perform(`${code}/get_tracking_data`, {
			task_id
		});
		return response;
	}
	static async CompanyData (company_id) {
		var response = await perform(`company/id`, {
			company_id
		});
		return response;
	}
}