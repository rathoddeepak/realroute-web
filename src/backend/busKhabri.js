import {perform2} from './request';
export default class BusKhabri {
	static async BookingData (bookingId) {
		return await perform2(`bookingData?booking_id=${bookingId}`);
	}
}