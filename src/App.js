import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions
} from 'react-native-web';
import InnerContent from './innerContent';
import BrandData from './brandData';
import theme from './assets/theme';
import './App.css'
const mobileGradient = "radial-gradient(70% 45%, rgba(0,0,0,0.00) 45%, rgba(0,0,0,0.00) 45%, rgba(0,0,0,0.00) 57%, rgba(0,0,0,0.27) 66%, rgba(0,0,0,0.59) 69%, #000000 45%, #000000 45%, #000000 45%)";
const desktopGradient = "radial-gradient(42% 71%, rgba(0,0,0,0.00) 50%, rgba(0,0,0,0.00) 50%, rgba(0,0,0,0.00) 57%, rgba(0,0,0,0.27) 66%, rgba(0,0,0,0.59) 69%, #000000 71%, #000000 71%, #000000 71%)";
const {height, width} = Dimensions.get('window');
const isMobile = height > width;
const site_url = "https://rathoddeepak.github.io/realroute/"
const homeIcon = `${site_url}home.png`;
const infoIcon = `${site_url}info.png`;
const callIcon = `${site_url}call.png`;

function App() {
  React.useEffect(() => {
    document.getElementById("appstore_image")?.addEventListener("click", () => {
      alert('Coming Soon!')
    });
    document.getElementById("googleplay_image")?.addEventListener("click", () => {
      window.open("https://play.google.com/store/apps/details?id=com.realroute.manager");
    });
    document.getElementById("WeAreHiring")?.addEventListener("click", () => {
      window.open("https://forms.gle/A5YY3oyQxpXynbWU6")
    });
    document.getElementById("Contact")?.addEventListener("click", () => {
      window.open("https://realroute.in/contact");
    });
    document.getElementById("PrivacyPolicy")?.addEventListener("click", () => {
      window.open("https://realroute.in/privacy");
    });    
    document.getElementById("AboutUs")?.addEventListener("click", () => {
      window.open("https://realroute.in/about");
    });
  }, [])
  return (
    <View style={s.main}>
     <View style={s.sideBar}>
      
      <View style={s.tabBox}>
       <Image source={homeIcon} style={s.tabIcon}  />
      </View>

      <View style={s.tabBox}>
       <Image source={infoIcon} style={s.tabIcon}  />
      </View>

      <View style={s.tabBox}>
       <Image source={callIcon} style={s.tabIcon}  />
      </View>

     </View>
     <View style={s.content}>
      <View style={s.innerContent}><InnerContent /></View>
     </View>
     <View style={s.contentCover}>
      
      <View style={s.brandData}>
       <BrandData />
      </View>

      <View style={s.bottomData}>
        <svg width="160px" height="126px" viewBox="0 0 160 126" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>Group 6</title>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" font-size={"20"}>                
                <g id="Group-6" transform="translate(0, 0)">
                    <text class="clickable" id="Contact" font-family="ArialMT, Arial" font-weight="normal" fill="#5F5F5F">
                        <tspan x="91.0742188" y="86">Contact</tspan>
                    </text>
                    <text class="clickable" id="PrivacyPolicy" font-family="ArialMT, Arial" font-weight="normal" fill="#5F5F5F">
                        <tspan x="35.5273438" y="120">Privacy Policy</tspan>
                    </text>
                    <text class="clickable" id="AboutUs" font-family="ArialMT, Arial" font-weight="normal" fill="#5F5F5F">
                        <tspan x="77.734375" y="52">About Us</tspan>
                    </text>
                    <text class="clickable" id="WeAreHiring" font-family="Arial-BoldMT, Arial" font-weight="bold" fill="#4184F8">
                        <tspan x="0.310546875" y="18">We Are Hiring </tspan>
                        <tspan x="137" y="18" font-family="AppleColorEmoji, Apple Color Emoji" font-weight="normal">🥳</tspan>
                    </text>
                </g>                
            </g>
        </svg>
      </View>

      <Text style={{position:'absolute',bottom:10,right:10,fontSize:isMobile ? 12 : 14,color:"#5F5F5F"}}>2022, Real Route Pvt. Ltd. All Rights Reserved.</Text>
     </View>
    </View>
  );
}


const s = {
  innerContent : {
    transform:[
     {
      scale: isMobile ? 0.6 : 1
     },
     {
      translateY: isMobile ? -65 : 0,
     },
     {
      translateX: isMobile ? -50 : 0,
     }
    ],
  },
  bottomData : {position:'absolute',bottom:isMobile ? 23 : 35,right:isMobile ? 0 : 10,
    transform:[
     {
      scale: isMobile ? 0.8 : 1
     }
    ]
  },
  brandData : {marginTop:isMobile ? -20 : 27,marginLeft:isMobile ? -30 : 27,width:272,height:222,transform:[
   {
    scale: isMobile ? 0.7 : 1.2
   }
  ]},
  contentCover : {
    width : isMobile ? width : width - 62,
    left : isMobile ? 0 : 62,
    height : height,
    position:'absolute',
    zIndex:100,    
    backgroundImage: isMobile ? mobileGradient : desktopGradient,
  },
  content : {
    flex:1,
    alignItems:'center',
    backgroundColor : '#000'    
  },
  tabIcon : {
    width : 30,
    height : 30,
    marginBottom:50,
    marginTop:10
  },
  tabBox : {
    width : 60,
    alignItems: 'center'
  },
  sideBar : {
    width : 60,
    height:height,
    borderRightWidth : 2,
    borderColor : theme.greyLight,
    backgroundColor:'#000'
  },
  main : {
    overflow:'hidden',
    width,
    height:height,
    backgroundColor : '#000',
    flexDirection : 'row'
  },  
}
export default App;
