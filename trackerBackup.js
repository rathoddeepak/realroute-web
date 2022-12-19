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

const width90 = width * 95 / 100;
const errIcon = `${helper.site_url}retry.png`;
export default class Tracker extends Component {
	constructor(props){
		super(props)
		this.state = {
			agent:null,
			vehicle:null,
			company:{},
			errorMsg : 'Link Expired!',
			error : false,
			busy : false,
			liveTxt:'LIVE',
		}
		this.connected = false;
	}
	render () {
		const {
			liveTxt,
			vehicle,
			company,
			agent,
			busy,
			error
		} = this.state;
		const showData = !busy && !error;
		let visibleImage = '';
		let visibleTitle = '';
		let visibleDesc = '';
		if(vehicle != null){
			visibleImage = vehicle.photo;
			visibleTitle = vehicle.name;
			if(agent != null){
				visibleDesc = `Driver: ${agent.name}`
			}else{
				visibleDesc = `Driver: To be assigned`
			}
		}else if(agent != null){
			visibleImage = agent.avatar;
			visibleTitle = agent.name;
			visibleDesc = `Phone: ${agent.phone}`
		}else{
			visibleTitle = 'No Data Aviliable!'
			visibleDesc = 'Driver: To Be Assigned'
		}
		return (
			<View style={s.main}>
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
				{showData ? <View style={s.content.main}>
			  	  <View style={s.content.row}>
				      <Image
				       source={helper.static_url + visibleImage}
				       style={s.content.image}
				      />
					  <View style={s.content.box}>			   
					   <Text numberOfLines={1} style={s.content.title}>{visibleTitle}</Text>
					   <Text numberOfLines={1} style={s.content.desc}>{visibleDesc}</Text>
					   <Text numberOfLines={2} style={s.content.status}>Live Tracking...</Text>
					  </View>
		          </View>
			      <View style={s.content.row}>			       
			       <TouchableOpacity activeOpacity={0.8} onPress={this.support} style={s.content.supportBtn}>
			        <Text style={s.content.supportTxt}>Support</Text>
			       </TouchableOpacity>
			       <TouchableOpacity activeOpacity={0.8} onPress={this.share} style={s.content.shareBtn}>
			        <Text style={s.content.shareTxt}>Share Location</Text>
			       </TouchableOpacity>
			      </View>
			 	</View> : this.renderIndicator()}

			 	{showData ? <View style={s.branding.main}>
			 	 {/*<Image
			 	  source={company.logo}
			 	  style={s.branding.image}
			 	 />*/}
			 	 <View style={s.branding.box}>
			 	  <Text style={s.branding.title}>{company.name}</Text>
			 	  <Text style={s.branding.powered}>Powered By Real Route</Text>
			 	 </View>
			 	</View> : null}

			 	{showData ? <View style={s.status.main}>
			 	 <Text style={s.ready}>{liveTxt}</Text>
			 	</View> : null}

			</View>
		)
	}

	renderMarker = () => {
		const {agent, vehicle} = this.state;
		if(agent == null)return null;
		const image = vehicle == null ? agent.avatar : vehicle.photo		
		return (
			<Marker longitude={agent.lng} latitude={agent.lat} anchor="bottom" >
		      <View style={[s.marker.main, {backgroundColor:theme.green + '17'}]}><View style={[s.marker.cover, {borderWidth:4,borderColor:theme.green}]}>
			  <Image
			   source={{uri:helper.static_url + image}}
			   style={{width:29,height:29,borderRadius:50,backgroundColor : theme.fgColor}}
			  />
			 </View></View>
		    </Marker>
		)
	}

	renderIndicator = () => {
		const {errorMsg, error, busy} = this.state;
		if(error == true){
			return <Text onPress={this.loadData} style={s.errorBox}>{errorMsg}</Text>
		}else if (busy == true){
			return <View style={s.loadingBox}><ActivityIndicator color={theme.fgColor} size={30} /></View>
		}else{
			return null
		}
	}

	componentDidMount () {
		const params = this.urlParams();
		if(params.t == undefined){
			this.setState({
				error : true,
				busy : false,
				errorMsg : 'Invalid Link!'
			})
		}else{
			this.setState({
				task_id:params.t
			}, this.loadData)			
		}		
	}

	urlParams = () => {
		let url = window.location.toString();
		let params = url?.split("?")[1]?.split("&");
		let obj = {};
		params?.forEach((el) => {
		  let [k, v] = el?.split("=");
		  obj[k] = v.replaceAll("%20", " ");
		});
		return obj;
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
				vehicle : response.task.metaData.vehicle,
				company : response.company,
				city_id : response.cityId,
				busy:false,
				error : false
			}, () => {
				this.setMarker();
				this.setSockets();
			})
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

	support = () => {
		const company = this.state.company;
		window.open(`tel:${company.contact}`);	
	}

	share = () => {		
		const {vehicle,task_id,company} = this.state;		
		const link = `${helper.tracking_url}?t=${task_id}`;
		const message = `*${company.name}*

		%0a%0a*Track Live* Location of your bus ${vehicle == null ? '' : vehicle?.name}

		%0a%0aContact: ${company.contact}

		%0a%0a${link}

		%0a%0a_Thank You_`
		window.open(`whatsapp://send?text=${message}`);	
	}
}

const s = {
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
		position : 'absolute',
		top:'45%',
		alignSelf:'center',
		borderRadius : 8,
		width : 55,
		height : 55,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor : '#000000b4',
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
			backgroundColor : theme.blackLight,
			elevation : 20,
			position : 'absolute',
			bottom : 170,
			right : '3%'
		}
	},
	branding : {
		main : {
			height : 50,
			borderRadius:4,
			backgroundColor : '#00000090',
			flexDirection : 'row',
			paddingVertical : 10,
			paddingHorizontal : 5,
			position : 'absolute',
			top : 10,
			left : 10,
			alignItems:'center'
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
			color : theme.fgColor,
			fontSize : 14
		},
		powered : {
			fontSize : 12,
			color : theme.fgColor,
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
		height,
		width,
	},
	content : {
		main : {
			width : width90,
			alignSelf:'center',
			backgroundColor : theme.blackLight,
			borderRadius : 10,
			position : 'absolute',
			bottom : 20,
			padding : 10,
			zIndex : 100
		},
		row : {
			flexDirection : 'row',
			justifyContent : 'space-between'
		},
		image : {
			width : 70,
			height : 70,
			backgroundColor : theme.silver,
			borderRadius : 10
		},
		box : {
			flex:1,
			justifyContent:'space-around',
			paddingLeft:10
		},
		title : {
			fontWeight : '600',
			color : theme.fgColor,
			fontSize : 15
		},
		desc : {
			color : theme.fgColor,
			fontSize : 13
		},
		status : {
			color : theme.fgColor,
			fontSize : 12
		},
		supportBtn : {
			backgroundColor : theme.blueLight,
			width : '48%',
			borderRadius: 6,
			justifyContent:'center',
			alignItems:'center',
			height : 40,
			marginTop : 10,
			outline:'none'
		},
		shareBtn : {
			backgroundColor : theme.greenLight,
			width : '48%',
			borderRadius: 6,
			justifyContent:'center',
			alignItems:'center',
			height : 40,
			marginTop : 10,
			outline:'none'
		},
		shareTxt : {
			fontSize : 15,
			fontWeight : 'bold',
			color : theme.darkGreen			
		},
		supportTxt : {
			fontSize : 15,
			fontWeight : 'bold',
			color : theme.primary			
		}
	},
	main : {
		height,
		width,
		backgroundColor : theme.bgColor
	}
}