import * as firebase from 'firebase';

// const config = {
//     apiKey: "AIzaSyC5LLlUpLyb62Zx6sn_901zoZYlG0t-IIU",
//     authDomain: "goalcoach-7de8e.firebaseapp.com",
//     databaseURL: "https://goalcoach-7de8e.firebaseio.com",
//     projectId: "goalcoach-7de8e",
//     storageBucket: "",
//     messagingSenderId: "656752265066"
//   };

// const config = {
//     apiKey: "AIzaSyC5LLlUpLyb62Zx6sn_901zoZYlG0t-IIU",
//     authDomain: "goalcoach-7de8e.firebaseapp.com",
//     databaseURL: "https://goalcoach-7de8e.firebaseio.com",
//     projectId: "goalcoach-7de8e",
//     storageBucket: "goalcoach-7de8e.appspot.com",
//     messagingSenderId: "656752265066"
//   };

const config = {
    apiKey: 'AIzaSyC_if_tj_tXKiyEl7o_JPU3AKKtOjMmN98',
    authDomain: 'smartchat-db60f.firebaseapp.com',
    databaseURL: 'https://smartchat-db60f.firebaseio.com',
    projectId: 'smartchat-db60f',
    storageBucket: '',
    messagingSenderId: '933609337585',
};

export const firebaseApp = firebase.initializeApp(config);

export const goalRef = firebase.database().ref('goals');
export const topicRef = firebase.database().ref('topics');
export const commentRef = firebase.database().ref('comments');
export const todoRef = firebase.database().ref('todos');

export const databaseRef = childType => firebase.database().ref(childType);

