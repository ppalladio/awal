'use client';
import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Define the Google Translate initialization function
        window.googleTranslateElementInit = function () {
            new window.google.translate.TranslateElement({
                pageLanguage: 'ca',
                includedLanguages: 'en,es',
                layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            }, 'google_translate_element');
        };

        // Check if the Google Translate script is already added
        if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js"]')) {
            const googleTranslateScript = document.createElement('script');
            googleTranslateScript.type = 'text/javascript';
            googleTranslateScript.async = true;
            googleTranslateScript.src =
                '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(googleTranslateScript);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const iframe = document.querySelector('#google_translate_element iframe');
            if (iframe instanceof HTMLElement) {
                clearInterval(intervalId);
                iframe.style.border = 'none'; 
                iframe.style.width = '100px'; 
                iframe.style.height = '40px'; 
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div id="google_translate_element"></div>
        </div>
    );
};

export default GoogleTranslate;
