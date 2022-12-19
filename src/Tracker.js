import React, {Component} from 'react';
import {
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native-web';
import theme from './assets/theme';
import helper from './assets/helper';
import Backend from './backend/';
import Map, {Marker, NavigationControl, AttributionControl, GeolocateControl} from 'react-map-gl';
const {
	height,
	width 
} = Dimensions.get('window');
const mapHeight = (height/2) - 50
const width90 = width * 95 / 100;
const errIcon = `${helper.site_url}retry.png`;
const markerImage = `${helper.site_url}pin.png`;
export default class Tracker extends Component {
	constructor(props){
		super(props)
		this.state = {
			agent:null,
			vehicle:null,
			company:{
				name : 'Loading...'
			},
			errorMsg : 'Link Expired!',
			error : false,
			busy : false,
			liveTxt:'LIVE',
			ticket : {
				booking_id : 'BMKEIJWI8',
				trip_name : 'Mumbai - Pune',
				booking_date : '08-11-2022',
				fleet_type : 'Royal Class',
				amount : 900,
				fleet_reg_number : 'MH 25 K 2801',
				seats:'P2, S2',
				passenger:'Deepak Rathod',
				pickup_point: 'Naik Chowk',
				drop_point : 'Pune Bhosari'
			}
		}		
	}
	render () {
		const {
			liveTxt,
			vehicle,
			company,
			agent,
			busy,
			error,
			ticket
		} = this.state;
		return (
			<View style={s.main}>
			    <View style={s.branding.main}>
			 	 {/*<Image
			 	  source={company.logo}
			 	  style={s.branding.image}
			 	 />*/}
			 	 <View style={s.branding.box}>
			 	  <Text style={s.branding.title}>{company.name}</Text>
			 	  <Text style={s.branding.powered}>Powered By Real Route</Text>
			 	 </View>
			 	</View>
			 	<RealRoute
			 	 onCompany={this.setCompany}
			 	 ref={ref => this.realRoute = ref}
			 	/>		    
				<View style={s.content.main}>
				  {busy || error ? 
				  	this.renderIndicator()
				  :
				  <>
			  	  <View style={s.content.box}>
				      <Text numberOfLines={1} style={s.content.title}>{ticket.trip_name}</Text>
					  <Text numberOfLines={1} style={s.content.desc}>Booking date: <Text style={{color:theme.bgColor}}>{ticket.booking_date}</Text></Text>
		          </View>
		          <View style={s.content.stripe}>
		          	<Text numberOfLines={1} style={s.content.desc}>{ticket.fleet_type}</Text>
				    <Text numberOfLines={1} style={s.content.title}>{helper.rp}{ticket.amount}</Text>					 
		          </View>

		          <View style={s.content.infoCover}>
		            <View style={s.content.card}>
			          	<Text 
			          	 numberOfLines={1} 
			          	 style={s.content.infoTxt}>
			          	 	Booking ID
			          	 </Text>
					    <Text 
					     numberOfLines={1} 
					     style={s.content.infoContent}>
						    {ticket.booking_id}
					     </Text>
				    </View>
		            <View style={s.content.card}>
			          	<Text 
			          	 numberOfLines={1} 
			          	 style={s.content.infoTxt}>
			          	 	Passenger
			          	 </Text>
					    <Text 
					     numberOfLines={1} 
					     style={s.content.infoContent}>
						    {ticket.passenger}
					     </Text>
				    </View>
				    <View style={s.content.card}>
			          	<Text 
			          	 numberOfLines={1} 
			          	 style={s.content.infoTxt}>
			          	 	Bus Number
			          	 </Text>
					    <Text 
					     numberOfLines={1} 
					     style={s.content.infoContent}>
						    {ticket.fleet_reg_number}
					     </Text>
				    </View>
				    <View style={s.content.card}>
			          	<Text 
			          	 numberOfLines={1} 
			          	 style={s.content.infoTxt}>
			          	 	Seat Numbers
			          	 </Text>
					    <Text 
					     numberOfLines={1} 
					     style={s.content.infoContent}>
						    {ticket.seats}
					     </Text>
				    </View>
		            

				    <View style={s.content.card}>
			          	<Text 
			          	 numberOfLines={1} 
			          	 style={s.content.infoTxt}>
			          	 	Pickup Point
			          	 </Text>
					    <Text 
					     numberOfLines={1} 
					     style={s.content.infoContent}>
						    {ticket.pickup_point}
					     </Text>
				    </View>

				    <View style={s.content.card}>
			          	<Text 
			          	 numberOfLines={1} 
			          	 style={s.content.infoTxt}>
			          	 	Drop Point
			          	 </Text>
					    <Text 
					     numberOfLines={1} 
					     style={s.content.infoContent}>
						    {ticket.drop_point}
					     </Text>
				    </View>				    
		          </View>
		          </>}
			 	</View>
			 	<View style={s.content.row}>			       
			       <TouchableOpacity activeOpacity={0.8} onPress={this.support} style={s.content.supportBtn}>
			        <Text style={s.content.supportTxt}>Support</Text>
			       </TouchableOpacity>
			       <TouchableOpacity activeOpacity={0.8} onPress={this.share} style={s.content.shareBtn}>
			        <Text style={s.content.shareTxt}>Share Location</Text>
			       </TouchableOpacity>
			    </View>
			</View>
		)
	}

	renderIndicator = () => {
		const {errorMsg, error, busy} = this.state;
		if(error == true){
			return <View style={s.loadingBox}>
			<Text onPress={this.loadBooking} style={s.errorBox}>{errorMsg}</Text>
			</View>
		}else if (busy == true){
			return <View style={s.loadingBox}>
			 <ActivityIndicator color={theme.bgColor} size={30} />
			</View>
		}else{
			return null
		}
	}

	componentDidMount () {
		const bookingId = this.bookingId();
		if(bookingId){
			this.setState({
				bookingId
			}, this.loadBooking);
		}else{
			this.setState({
				error : true,
				busy : false,
				errorMsg : 'Invalid Link!'
			})
		}		
	}

	bookingId = () => {
		let data = window.location.toString().split('/');
		if(data?.length >= 4){
			let id = data[3];
			if(id?.length == 0){
				return false
			}else{
				return id
			}
		}else{
			return false
		}
	}

	support = () => {
		if(this.state.busy || this.state.error)return
		const company = this.state.company;
		window.open(`tel:${company.contact}`);	
	}

	share = () => {
		if(this.state.busy || this.state.error)return
		const {vehicle,bookingId,company} = this.state;		
		const link = `${helper.site_url}/${bookingId}`;
		const message = `*${company.name}*

		%0a%0a*Track Live* Location of your bus ${vehicle == null ? '' : vehicle?.name}

		%0a%0aContact: ${company.contact}

		%0a%0a${link}

		%0a%0a_Thank You_`
		window.open(`whatsapp://send?text=${message}`);	
	}

	loadBooking = async () => {
		const {bookingId, busy} = this.state;
		if(busy)return;		
		this.setState({busy:true,error:false})
		const response = await Backend.BusKhabri.BookingData(bookingId);
		console.log(response)
		if(response?.status == 400){
			this.setState({
				error : true,
				busy : false,
				errorMsg : response.message
			})
		}else if(response?.booking == undefined){
			this.setState({
				error : true,
				busy : false,
				errorMsg : 'Retry!'
			})
		}else{
			this.setState({
				error : false,
				busy : false,
				ticket: response.booking
			}, () => {				
				this.realRoute?.init(
					this.state.ticket?.task_id,
					this.state.ticket?.company_id
				);
			})
		}
	}

	setCompany = (company) => {
		this.setState({company})
	}
}

class RealRoute extends Component {
	constructor(props){
		super(props)
		this.state = {
			liveTxt: 'LIVE',
			agent : null,
		}
		this.connected = false;
	}
	render(){
		const {
			loading,
			error,
			liveTxt,
		} = this.state;
		const showData = !loading && !error;
		return (
			<View style={s.mapContainer}>
			    <Map
			      initialViewState={{
				      longitude: 0,
				      latitude: 0,
				      zoom: 1
				  }}
				  ref={ref => this.mapRef = ref}
			      mapboxAccessToken={helper.accessToken}
			      style={s.mapContainer}
			      onLoad={this.setMarker}
			      attributionControl={false}
			      mapStyle={helper.mapStyle}
			    >
			    	{this.renderMarker()}
			    	<AttributionControl customAttribution="Real Route" />
			    	<NavigationControl />
			    	<GeolocateControl />
			    </Map>
			    {showData ? <View style={s.status.main}>
			 	 <Text style={s.ready}>{liveTxt}</Text>
			 	</View> : null}
			 	{error == true ? this.renderMsg() : null}
			</View>
		)
	}

	renderMarker = () => {
		const {agent} = this.state;
		if(agent == null)return null;		
		return (
			<Marker longitude={agent.lng} latitude={agent.lat} anchor="bottom" >		      
			  <Image
			   source={markerImage}
			   style={{width:35,height:35}}
			  />			 
		    </Marker>
		)
	}

	init = (task_id, company_id) => {
		if(task_id == 0 || task_id == undefined || task_id == null){
			this.setState({
				error : true,
				busy : false,
				company_id,
				errorMsg : 'Tracking Will Be Aviliable Once Journey is Started!'
			}, this.companyData);
		}else{
			this.setState({
				task_id,
				company_id
			}, this.loadData);
		}
	}

	loadData = async () => {		
		const {task_id, busy} = this.state;
		if(busy)return;		
		this.setState({busy:true,error:false})
		const response = await Backend.Tracking.TrackingData(task_id);
		if(response?.code == 2){
			this.setState({
				error : true,
				busy : false,
				errorMsg : response.message
			})
		}else if(response?.cityId == undefined){
			this.setState({
				error : true,
				busy : false,
				errorMsg : 'Retry!'
			})
		}else{
			this.setState({
				agent : response.task.metaData.agent,
				company : response.company,
				city_id : response.cityId,
				busy:false,
				error : false
			}, () => {
				this.props?.onCompany(response.company);
				this.setMarker();
				this.setSockets();
			})
		}
	}

	companyData = async () => {		
		const {company_id} = this.state;
		const response = await Backend.Tracking.CompanyData(company_id);
		if(response?.company != undefined){
			this.props?.onCompany(response.company);
		}
	}

	setSockets = () => {
		if(this.connected == true){
			return
		}
		this.setState({liveTxt:'...'});
		this.connected = true
		const url = helper.socket_url + this.state.city_id;
		let socket = new WebSocket(url);
		socket.onopen = () => {
			this.setState({liveTxt:'LIVE'});
		}
		socket.onmessage = (message) => {
			this.handleEventMessage(message);
	    }
		socket.onclose = (err) => {	
			this.setState({liveTxt:'!'});
		    socket = null
		    this.connected = false;
		    this.setState({socket});
		    setTimeout(this.setSockets, 5000);
		}
		this.setState({socket});
	}

	handleEventMessage(message){
		try {
			const event = JSON.parse(message.data);
			const data = JSON.parse(event.eventPayload);
			if(data.event == helper.EVENT_AGENT_LOCATION_UPDATE){
				let agent = this.state.agent;
				if(agent.id == data.agent_id){
					agent.lat = data.agent_lat;
					agent.lng = data.agent_lng;
					this.setState({agent}, this.setMarker)
				}
			}
		}catch(err){
			console.log(err)
		}
	}

	setMarker = () => {		
		if(this.state.agent == null)return
		const {lat, lng} = this.state.agent;
		this.mapRef?.flyTo({center: [lng, lat], duration: 1000, zoom:13});	
	}

	renderMsg = () => {
		return (
			<View style={s.message.main}>
			 <Text style={s.message.txt}>{this.state.errorMsg}</Text>
			</View>
		)
	}
}
const s = {
	message : {
		main : {
			backgroundColor : '#ffffffb4',			
			backdropFilter: 'blur(2px)',
			width:'100%',
			height : '100%',
			position:'absolute',
			zIndex : 100,
			padding : 10,
			justifyContent:'center',
			alignItems:'center'
		},
		txt : {
			color : theme.bgColor,
			fontSize: 14,
			textAlign:'center'
		}
	},
	content : {
		row : {
			flexDirection : 'row',
			height : 50,
			width : '100%',
			alignItems:'center',
			borderTopWidth:1,
			borderColor : theme.greyFaint
		},
		infoCover:{
			flexDirection : 'row',
			paddingVertical: 10,
			flexWrap:'wrap',
			marginTop:10,
			paddingHorizontal: 10,
		},
		card : {
			width : '50%',
			marginBottom:20
		},
		main : {
			flex:1,
			backgroundColor : theme.fgColor,
		},
		stripe : {
			padding : 10,
			flexDirection : 'row',
			height: 50,
			alignItems:'center',
			justifyContent : 'space-between',
			borderBottomWidth : 1,
			borderColor : theme.greyFaint	
		},
		infoTxt : {
			fontSize : 11,
			color : theme.grey,
			fontWeight : '400'
		},
		infoContent : {
			fontSize : 15,
			fontWeight : '500',
			marginTop : 3,
			color : theme.grey,			
		},
		box : {
			width:'100%',
			padding : 10,
			borderBottomWidth : 1,
			borderColor : theme.greyFaint,			
		},
		title : {
			fontWeight : '600',
			color : theme.bgColor,
			fontSize : 13,
			marginBottom : 3
		},
		desc : {
			color : theme.greyLight,
			fontSize : 13
		},
		status : {
			color : theme.bgColor,
			fontSize : 12
		},
		supportBtn : {
			width : '50%',
			justifyContent:'center',
			alignItems:'center',
			height : 50,
			outline:'none',
			borderRightWidth : 1,
			borderColor : theme.greyFaint
		},
		shareBtn : {
			width : '50%',
			justifyContent:'center',
			alignItems:'center',
			height : 50,
			outline:'none'
		},
		shareTxt : {
			fontSize : 15,
			fontWeight : '600',
			color : theme.bgColor			
		},
		supportTxt : {
			fontSize : 15,
			fontWeight : '600',
			color : theme.bgColor			
		}
	},
	errorBox : {
		paddingHorizontal : 20,
		paddingVertical : 10,
		borderRadius : 5,
		backgroundColor : '#000000b4',
		fontWeight : 'bold',
		color : theme.fgColor,
		position : 'absolute',
		top:'45%',
		alignSelf:'center'
	},
	loadingBox : {
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
	errIcon : {
		height : 30,
		width : 30,
		tintColor : theme.red
	},
	ready : {
		color : theme.red,
		fontWeight : 'bold',
		fontSize : 12
	},
	status : {
		main : {
			width : 40,
			height : 40,
			borderRadius : 100,
			justifyContent : 'center',
			alignItems : 'center',
			backgroundColor : theme.fgColor,
			boxShadow:theme.shadow,
			position : 'absolute',
			bottom : 8,
			zIndex:100,
			right : 5
		}
	},
	branding : {
		main : {
			height : 50,
			width : '100%',
			backgroundColor : theme.fgColor,
			flexDirection : 'row',
			paddingVertical : 10,
			paddingHorizontal : 5,
			alignItems:'center',
			boxShadow : theme.shadow,
			zIndex:100
		},
		row : {
			flexDirection : 'row'
		},
		image : {
			height : 42,
			width : 42,
			borderRadius : 4,
			backgroundColor : theme.silver
		},
		box : {
			flex : 1,
		},
		title : {
			fontWeight : '600',
			color : theme.bgColor,
			fontSize : 15,
			marginBottom:2
		},
		powered : {
			fontSize : 10,
			color : theme.bgColor,
			fontWeight : '600'
		}
	},
	marker : {
		main : {
			width : 50,
			height : 50,
			borderRadius : 50,
			justifyContent:'center',
			alignItems:'center'
		},
		cover : {
			width : 34,
			height : 34,
			borderWidth : 3,
			borderRadius : 50,
			borderColor : theme.bgColor,
			justifyContent:'center',
			alignItems:'center'
		}
	},
	mapContainer : {
		height:mapHeight,
		width,
	},	
	main : {
		height,
		width,
		backgroundColor : theme.fgColor
	}
}