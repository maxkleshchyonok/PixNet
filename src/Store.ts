import {Post} from './app/profile/post/post'
import {ProfileInfoElement} from "./app/profile/status/status";

export const Posts: Post[]=[
  {id: 1, image:"https://planetofhotels.com/guide/sites/default/files/styles/paragraph__hero_banner__hb_image__1880bp/public/hero_banner/Edinburgh-castle.jpg", postDescr:"Spending time in Edinbrgh", likeNum: 118  },
  {id: 2, image:"https://media.istockphoto.com/photos/melbourne-central-business-district-picture-id600688368?k=20&m=600688368&s=612x612&w=0&h=hbN7pEOSGuyzbygdh-vgj5mmBeGne2NHDYlojpfmoTw=", postDescr:"Visited Melbourne",  likeNum: 117  },
  {id: 3, image:"https://www.amadriapark.com/wp-content/uploads/sites/5/2018/08/ap-excursion-Venice.jpg", postDescr:"Holiday in Venice", likeNum: 116  },
  {id: 3, image:"https://www.ab-in-den-urlaub.de/magazin/wp-content/uploads/2020/12/1611914058_Blick-auf-Kairo.jpg", postDescr:"I'm in Cairo", likeNum: 116  }
]

export const ProfileInfo: ProfileInfoElement[] = [
  {
    avatar: 'https://www.upskillist.com/assets/course-cards/website/wide/photography-21.png',
    userName: 'Max Kleshchyonok',
    status: 'Follow me!',
    friendsNum: 3,
    postsNum: 4
  }
]
