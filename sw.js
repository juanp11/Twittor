//importacion
importScripts('js/sw-utils.js');

const CACHE_STATIC    = 'static-v5';
const CACHE_DYNAMIC   = 'dynamic-v2';
const CACHE_INMUTABLE = 'inmutable-v1';

// const APP_SHELL = [
//     '/index.html',
//     '/css/style.css',
//     '/img/favicon.ico',
//     '/js/app.js',
//     '/img/avatars/spiderman.jpg',
//     '/img/avatars/hulk.jpg',
//     '/img/avatars/ironman.jpg',
//     '/img/avatars/thor.jpg',
//     '/img/avatars/wolverine.jpg'
// ];

// const APP_SHELL_INMUTABLE = [
//     'https://fonts.googleapis.com/css?family=Quicksand:300,400',
//     'https://fonts.googleapis.com/css?family=Lato:400,300',
//     'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
//     '/css/animate.css',
//     '/js/libs/jquery.js'
// ];

self.addEventListener('install', e => {
    const cacheStatic = caches.open( CACHE_STATIC)
        .then( cacheSta => {
            return cacheSta.addAll([
                'index.html',
                'css/style.css',
                'img/favicon.ico',
                'js/app.js',
                'img/avatars/spiderman.jpg',
                'img/avatars/hulk.jpg',
                'img/avatars/ironman.jpg',
                'img/avatars/thor.jpg',
                'img/avatars/wolverine.jpg',
                'js/sw-utils.js'
            ]);
        });

    const cacheInmutable = caches.open( CACHE_INMUTABLE )
        .then( cacheInm => {
            return cacheInm.addAll([
                'https://fonts.googleapis.com/css?family=Quicksand:300,400',
                'https://fonts.googleapis.com/css?family=Lato:400,300',
                'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
                'css/animate.css',
                'js/libs/jquery.js'
            ]);
        });
    
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable]) );
});

self.addEventListener('activate', e => {

    const cacheDelete = caches.keys()
    .then( keys =>{
        keys.forEach( key =>{
            if( key !== CACHE_STATIC && key.includes('static') ){
                return caches.delete( key );
            }
            if( key !== CACHE_DYNAMIC && key.includes('dynamic') ){
                return caches.delete( key );
            }
        });
    });

    e.waitUntil( cacheDelete );
});

self.addEventListener('fetch', e => {
    const cacheOnly = caches.match( e.request)
        .then(resp => {
            if (resp) {
                return resp;
            }else{
                return fetch( e.request )
                    .then( newResp =>{
                        return actulizaCacheDinamico( CACHE_DYNAMIC, e.request, newResp);
                    });
            }
        });
    e.respondWith( cacheOnly );
});