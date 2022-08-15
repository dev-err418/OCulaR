# OCulaR
OCulaR is an OCR React Native app built with Google Cloud Vision and Expo. Google Cloud Vision API allows you to perform text recognition with machine learning. Expo is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React.

![OCR_vid](https://user-images.githubusercontent.com/59390256/184682898-75f90ac4-0010-4b87-9df0-7f5f2a70ef81.gif)

The app is really simple, it's a POC. Simply select an image in your gallery and the app will in few seconds highlight the text in green boxes. The "+" button at the bottom right corner will open a modal to show you the plain text detected. The "New photo" button at the bottom right is to load a new photo.

⚠️ Avoid live pics (IOS concerned) and non 4:3 pictures (default iPhone pictures format) otherwise the boxing won't work. This is a POC, not an app ready for launch.

First install librairies with:
```
npm install
```
Then run it with:
```
npm start
```


## Other examples:

![text_reco_with_book](https://user-images.githubusercontent.com/59390256/184684257-0d1e8623-aa0e-4e32-8d7e-bd2fce2a833f.PNG)
![text_reco_full_text](https://user-images.githubusercontent.com/59390256/184684279-18f4b7bc-5d31-40f6-9e0e-bded67e48b2b.PNG)

Enjoy it !
